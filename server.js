const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } = require('transbank-sdk');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Lula7553',
  database: 'ferremas'
});

app.use(session({
  secret: 'ferre',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Cambia a true si usas HTTPS
}));



connection.connect(err => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

// Rutas de usuario

app.post('/ini-sesion', async (req, res) => {
  const { correo, clave } = req.body;
  const query = `
    SELECT Usuario.*, tipo_usuario.descripcion AS rol
    FROM Usuario
    INNER JOIN tipo_usuario ON Usuario.tipo_usuario_id = tipo_usuario.id
    WHERE Usuario.correo = ?`;
  const Usuario = await new Promise((resolve, reject) => {
    connection.query(query, [correo], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });

  if (!Usuario) {
    return res.status(401).json({ message: 'Usuario no existe' });
  }

  if (clave !== Usuario.clave) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }

  req.session.user = {
    id: Usuario.id,
    nombre: Usuario.nombre,
    apellido: Usuario.apellido,
    correo: Usuario.correo,
    rol: Usuario.rol
  };
  res.status(200).json({ message: 'Inicio de sesión exitoso', usuario: req.session.user });
});

app.get('/sesion-usuario', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'No estás autenticado' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  });
});

app.post('/registro-usuario', async (req, res) => {
  const { nombre, apellido, rut, correo, clave } = req.body;
  const checkQuery = 'SELECT * FROM Usuario WHERE correo = ?';
  connection.query(checkQuery, [correo], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al verificar el correo' });
    } else if (results.length > 0) {
      res.status(400).json({ message: 'El correo ya está registrado' });
    } else {
      const insertQuery = 'INSERT INTO Usuario (nombre, apellido, rut, correo, clave, Tipo_usuario_id) VALUES (?, ?, ?, ?, ?, 1)';
      connection.query(insertQuery, [nombre, apellido, rut, correo, clave], (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ message: 'Error al registrar el usuario' });
        } else {
          res.status(200).json({ message: 'Registro exitoso' });
        }
      });
    }
  });
});

// Configuración Webpay
WebpayPlus.configureForIntegration(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration);

app.post('/create', async (req, res) => {
  const { buyOrder, sessionId, amount, returnUrl } = req.body;
  try {
    const tx = new WebpayPlus.Transaction();
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    res.json({
      url: response.url,
      token: response.token,
      returnUrl: response.returnUrl
    });
  } catch (error) {
    console.error('Error al crear la transacción:', error);
    res.status(500).json({ error: 'Error al crear la transacción' });
  }
});

app.post('/commit', async (req, res) => {
  const { token } = req.body;
  try {
    const response = await WebpayPlus.Transaction.commit(token);
    res.json(response);
  } catch (error) {
    console.error('Error al confirmar la transacción:', error);
    res.status(500).json({ error: 'Error al confirmar la transacción' });
  }
});

app.post('/crear-transaccion', async (req, res) => {
  const { buyOrder, sessionId, amount, cliente, carrito, despacho } = req.body;

  const insertQuery = `
    INSERT INTO pedidos_temporales (buyOrder, sessionId, amount, cliente, carrito, despacho)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  connection.query(insertQuery, [buyOrder, sessionId, amount, cliente, carrito, despacho], async (error, results) => {
    if (error) {
      console.error('Error al insertar en la tabla pedidos_temporales:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    const returnUrl = `http://localhost:3307/commit-transaccion?buyOrder=${buyOrder}&sessionId=${sessionId}`;

    try {
      const tx = new WebpayPlus.Transaction();
      const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
      res.json(response);
    } catch (error) {
      console.error('Error al crear la transacción:', error);
      res.status(500).json({ error: 'Error al crear la transacción' });
    }
  });
});


app.get('/commit-transaccion', async (req, res) => {
  const { token_ws, buyOrder, sessionId } = req.query;

  if (!token_ws || token_ws.trim() === '') {
    console.error('Error: token no puede ser nulo o una cadena vacía');
    return res.status(400).redirect('http://localhost:3000/errorCompra');
  }

  try {
    const tx = new WebpayPlus.Transaction();
    const response = await tx.commit(token_ws);

    console.log('Respuesta recibida:', response);

    if (response.response_code === 0) {
      const selectQuery = `
        SELECT cliente, carrito, despacho
        FROM pedidos_temporales
        WHERE buyOrder = ? AND sessionId = ?
      `;
      connection.query(selectQuery, [buyOrder, sessionId], async (error, results) => {
        if (error || results.length === 0) {
          console.error('Error al obtener datos del pedido temporal:', error);
          return res.status(500).redirect('http://localhost:3000/errorCompra');
        }

        const { cliente, carrito, despacho } = results[0];
        const parsedCliente = JSON.parse(cliente);
        const parsedCarrito = JSON.parse(carrito);
        const parsedDespacho = JSON.parse(despacho);
        const paymentType = response.payment_type_code;
        let tipoPago;

        switch (paymentType) {
          case 'VD': // Venta débito
            tipoPago = 1;
            break;
          case 'VN': // Venta normal (crédito)
          case 'VC': // Venta en cuotas
          case 'SI': // 3 cuotas sin interés
          case 'S2': // 2 cuotas sin interés
          case 'NC': // N cuotas sin interés
          case 'VP': // Venta Prepago
            tipoPago = 2;
            break;
          default:
            tipoPago = 1; // Default to debit if unknown
        }

        const pago = { total: response.amount, tipoPago }; // Asignar el tipo de pago basado en el tipo de tarjeta

        try {
          await procesarPedido(parsedCliente, parsedCarrito, parsedDespacho, pago, 'Confirmado');
          const queryParams = new URLSearchParams({
            buy_order: response.buy_order,
            amount: response.amount,
            card_detail: JSON.stringify(response.card_detail),
            transaction_date: response.transaction_date,
            installments_number: response.installments_number,
            compraRealizada: 'true'
          }).toString();
          res.redirect(`http://localhost:3000/compraRealizada?${queryParams}`);
        } catch (error) {
          console.error('Error al procesar el pedido:', error);
          res.status(500).redirect('http://localhost:3000/errorCompra');
        }
      });
    } else {
      res.redirect('http://localhost:3000/errorCompra');
    }
  } catch (error) {
    console.error('Error al confirmar la transacción:', error);
    res.status(500).redirect('http://localhost:3000/errorCompra');
  }
});

// Rutas adicionales

app.get('/sucursales', (req, res) => {
  connection.query('SELECT * FROM sucursal', (error, results) => {
    if (error) {
      console.error('Error al obtener sucursales:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.json(results);
  });
});

app.get('/sucursales/:nombre', (req, res) => {
  const { nombre } = req.params;
  connection.query('SELECT direccion FROM Sucursal WHERE nombre = ?', [nombre], (error, results) => {
    if (error) {
      console.error('Error al obtener las direcciones de la sucursal:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    const direcciones = results.map(result => result.direccion);
    res.json(direcciones);
  });
});

app.post('/limpiar-carrito', (req, res) => {
  res.status(200).json({ message: 'Carrito limpio' });
});

app.get('/productos-todos', (req, res) => {
  const { categorias, marcas } = req.query;

  let query = 'SELECT * FROM Producto WHERE 1=1';
  let queryParams = [];

  if (categorias) {
    const categoriasArray = categorias.split(',');
    query += ' AND categoria_id IN (?)';
    queryParams.push(categoriasArray);
  }

  if (marcas) {
    const marcasArray = marcas.split(',');
    query += ' AND marca_id IN (?)';
    queryParams.push(marcasArray);
  }

  connection.query(query, queryParams, (error, results) => {
    if (error) {
      console.error('Error al obtener los productos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.json(results);
  });
});

app.get('/productos', (req, res) => {
  const { categorias, marcas } = req.query;

  let query = 'SELECT * FROM Producto WHERE 1=1';
  let queryParams = [];

  if (categorias) {
    const categoriasArray = categorias.split(',');
    query += ' AND categoria_id IN (?)';
    queryParams.push(categoriasArray);
  }

  if (marcas) {
    const marcasArray = marcas.split(',');
    query += ' AND marca_id IN (?)';
    queryParams.push(marcasArray);
  }

  connection.query(query, queryParams, (error, results) => {
    if (error) {
      console.error('Error al obtener los productos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.json(results);
  });
});

app.put('/editar-productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, precio, stock, estado_id } = req.body;

  connection.query('SELECT * FROM Producto WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Error al obtener el producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Producto no encontrado');
      return;
    }

    connection.query('UPDATE Producto SET nombre = ?, precio = ?, stock = ?, estado_id = ? WHERE id = ?', [nombre, precio, stock, estado_id, id], (error, results) => {
      if (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }

      res.json({ id, nombre, precio, stock, estado_id });
    });
  });
});

app.delete('/eliminar-producto/:id', (req, res) => {
  const id = parseInt(req.params.id);

  connection.query('SELECT * FROM Producto WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Error al obtener el producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Producto no encontrado');
      return;
    }

    connection.query('DELETE FROM Producto WHERE id = ?', [id], (error, results) => {
      if (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }

      res.json({ message: 'Producto eliminado correctamente' });
    });
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/imagenes')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

app.use('/imagenes', express.static(path.join(__dirname, 'public/imagenes')));
const upload = multer({ storage: storage });

app.post('/agregar-producto', upload.single('imagen'), (req, res) => {
  const { nombre, precio, stock, descripcion, categoria_id, marca_id } = req.body;
  if (!req.file) {
    console.error('No se subió ningún archivo');
    res.status(400).send('No se subió ningún archivo');
    return;
  }
  const imagenTemp = req.file.filename;

  connection.query(
    'INSERT INTO Producto (nombre, precio, stock, descripcion, categoria_id, marca_id, estado_id) VALUES (?, ?, ?, ?, ?, ?, 1)', 
    [nombre, precio, stock, descripcion, categoria_id, marca_id], 
    (error, results) => {
      if (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).send('Error al crear el producto');
        return;
      }

      const productoId = results.insertId;
      const imagenFinal = `${productoId}.jpeg`;
      const imagenRuta = path.join(__dirname, 'public/imagenes', imagenFinal);

      fs.rename(path.join(__dirname, 'public/imagenes', imagenTemp), imagenRuta, (err) => {
        if (err) {
          console.error('Error al renombrar la imagen:', err);
          res.status(500).send('Error al renombrar la imagen');
          return;
        }

        res.status(200).json({ message: 'Producto creado', id: productoId });
        console.log('Producto creado correctamente:', { id: productoId, nombre, precio, stock, descripcion, categoria_id, marca_id });
      });
    }
  );
});

app.get('/productos/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM Producto WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Error al obtener el producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    const producto = results[0];
    connection.query('SELECT descripcion AS categoria_descripcion FROM Categoria WHERE id = ?', [producto.categoria_id], (error, categoriaResults) => {
      if (error) {
        console.error('Error al obtener la descripción de la categoría:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }
      if (categoriaResults.length === 0) {
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }
      const categoriaDescripcion = categoriaResults[0].categoria_descripcion;
      producto.categoria_descripcion = categoriaDescripcion;
      res.json(producto);
    });
  });
});

app.get('/clientes', (req, res) => {
  connection.query('SELECT * FROM Cliente', (error, results) => {
    if (error) {
      console.error('Error al obtener los productos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.json(results);
  });
});

app.get('/categorias', (req, res) => {
  connection.query('SELECT * FROM Categoria', (error, categorias) => {
    if (error) {
      console.error('Error al obtener las categorías de SERVER JS:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    let completedQueries = 0;
    categorias.forEach((categoria, index) => {
      connection.query('SELECT * FROM Producto WHERE categoria_id = ?', [categoria.id], (err, productos) => {
        if (err) {
          console.error('Error al obtener los productos SERVER JS:', err);
          res.status(500).json({ error: 'Error interno del servidor SERVER JS' });
          return;
        }
        categoria.productos = productos;
        completedQueries++;
        if (completedQueries === categorias.length) {
          res.json(categorias);
        }
      });
    });
  });
});

app.get('/estado-producto', (req, res) => {
  connection.query('SELECT * FROM Estado_producto', (error, results) => {
    if (error) {
      console.error('Error al obtener los productos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.json(results);
  });
});

app.get('/marcas', (req, res) => {
  connection.query('SELECT * FROM Marca', (error, marcas) => {
    if (error) {
      console.error('Error al obtener las marcas de SERVER JS:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    let completedQueries = 0;
    marcas.forEach((marca, index) => {
      connection.query('SELECT * FROM Producto WHERE marca_id = ?', [marca.id], (err, productos) => {
        if (err) {
          console.error('Error al obtener los productos SERVER JS:', err);
          res.status(500).json({ error: 'Error interno del servidor SERVER JS' });
          return;
        }
        marca.productos = productos;
        completedQueries++;
        if (completedQueries === marcas.length) {
          res.json(marcas);
        }
      });
    });
  });
});

app.post('/productos/filtrar', (req, res) => {
  const { categorias, marcas } = req.body;
  let query = 'SELECT id, nombre, precio FROM Producto WHERE 1=1 AND estado_id=1';
  let params = [];

  if (categorias.length > 0) {
    query += ' AND categoria_id IN (?)';
    params.push(categorias);
  }

  if (marcas.length > 0) {
    query += ' AND marca_id IN (?)';
    params.push(marcas);
  }

  connection.query(query, params, (error, results) => {
    if (error) {
      console.error('Error al obtener los productos filtrados:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.json(results);
  });
});


async function procesarPedido(cliente, carrito, despacho, pago, estadoPago) {
  return new Promise((resolve, reject) => {
    connection.beginTransaction(err => {
      if (err) {
        return reject('Error al iniciar la transacción');
      }

      const clienteQuery = 'INSERT INTO cliente (nombre, apellido, rut, direccion, telefono) VALUES (?, ?, ?, ?, ?)';
      connection.query(clienteQuery, [cliente.nombre, cliente.apellido, cliente.rut, cliente.direccion, cliente.telefono], (error, clienteResults) => {
        if (error) {
          return connection.rollback(() => reject('Error al insertar en la tabla cliente'));
        }
        const clienteId = clienteResults.insertId;

        const boletaQuery = 'INSERT INTO boleta (fecha, Cliente_id) VALUES (CURDATE(), ?)';
        connection.query(boletaQuery, [clienteId], (error, boletaResults) => {
          if (error) {
            return connection.rollback(() => reject('Error al insertar en la tabla boleta'));
          }
          const boletaId = boletaResults.insertId;

          const despachoQuery = 'INSERT INTO despacho (tipo_despacho, Boleta_id) VALUES (?, ?)';
          connection.query(despachoQuery, [despacho.tipoDespacho, boletaId], (error, despachoResults) => {
            if (error) {
              return connection.rollback(() => reject('Error al insertar en la tabla despacho'));
            }
            const despachoId = despachoResults.insertId;

            if (despacho.tipoDespacho === 1) {
              const domicilioQuery = 'INSERT INTO domicilio (Despacho_id, direccion, seguimiento) VALUES (?, ?, ?)';
              const seguimiento = Math.random().toString().slice(2, 18);
              connection.query(domicilioQuery, [despachoId, despacho.direccion, seguimiento], error => {
                if (error) {
                  return connection.rollback(() => reject('Error al insertar en la tabla domicilio'));
                }
              });
            } else if (despacho.tipoDespacho === 2) {
              const tiendaQuery = 'INSERT INTO tienda (Sucursal_id, Despacho_id) VALUES (?, ?)';
              connection.query(tiendaQuery, [despacho.sucursalId, despachoId], error => {
                if (error) {
                  return connection.rollback(() => reject('Error al insertar en la tabla tienda'));
                }
              });
            }

            const pagoQuery = 'INSERT INTO pago (total, Tipo_Pago_id, Boleta_id, estado_pago) VALUES (?, ?, ?, ?)';
            connection.query(pagoQuery, [pago.total, pago.tipoPago, boletaId, estadoPago], error => {
              if (error) {
                return connection.rollback(() => reject('Error al insertar en la tabla pago'));
              }
            });

            const detalleQueries = carrito.map(item => {
              return new Promise((resolve, reject) => {
                const detalleQuery = 'INSERT INTO detalle (cantidad, precio_unitario, subtotal, Producto_id, Boleta_id) VALUES (?, ?, ?, ?, ?)';
                connection.query(detalleQuery, [item.cantidad, item.precioUnitario, item.subtotal, item.productoId, boletaId], error => {
                  if (error) {
                    return reject(error);
                  }

                  const actualizarStockQuery = 'UPDATE producto SET stock = stock - ? WHERE id = ?';
                  connection.query(actualizarStockQuery, [item.cantidad, item.productoId], error => {
                    if (error) {
                      return reject(error);
                    }
                    resolve();
                  });
                });
              });
            });

            Promise.all(detalleQueries)
              .then(() => {
                connection.commit(err => {
                  if (err) {
                    return connection.rollback(() => reject('Error al confirmar la transacción'));
                  }
                  resolve();
                });
              })
              .catch(error => {
                connection.rollback(() => reject('Error al procesar el pedido'));
              });
          });
        });
      });
    });
  });
}


app.post('/guardar-pedido', (req, res) => {
  const { cliente, carrito, despacho } = req.body;
  req.session.cliente = JSON.stringify(cliente);
  req.session.carrito = JSON.stringify(carrito);
  req.session.despacho = JSON.stringify(despacho);
  console.log('Datos del pedido guardados en la sesión:', req.session);
  res.status(200).json({ message: 'Datos del pedido guardados en la sesión' });
});




app.post('/confirmar-transferencia', async (req, res) => {
  const { total, cliente, carrito, despacho } = req.body;

  try {
    const clienteData = JSON.parse(cliente);
    const carritoData = JSON.parse(carrito);
    const despachoData = JSON.parse(despacho);
    const pago = { total, tipoPago: 3 }; // 2 para Transferencia

    await procesarPedido(clienteData, carritoData, despachoData, pago, 'Por confirmar');
    res.status(200).json({ message: 'Pago confirmado y pedido procesado' });
  } catch (error) {
    console.error('Error al confirmar el pago y procesar el pedido:', error);
    res.status(500).json({ message: 'Error al confirmar el pago y procesar el pedido' });
  }
});


const PORT = process.env.PORT || 3307;
app.listen(PORT, () => {
  console.log('Servidor backend corriendo en el puerto', PORT);
});
