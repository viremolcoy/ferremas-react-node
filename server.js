const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } = require('transbank-sdk'); // Asegúrate de importar todos los módulos necesarios

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors()); 

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Lula7553',
  database: 'ferremas'
});

connection.connect(err => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

app.post('/ini-sesion', async (req, res) => {
  const { correo, clave } = req.body;

  // Buscar el usuario en la base de datos
  const query = 'SELECT * FROM Usuario WHERE correo = ?';
  const Usuario = await new Promise((resolve, reject) => {
    connection.query(query, [correo], (error, results) => {
      console.log('Usuario:', results);
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });

  if (!Usuario) {
    console.log('Usuario no encontrado');
    return res.status(401).json({ message: 'Usuario no existe' });
  }

  // Comprobar la contraseña
  if (clave !== Usuario.clave) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }

  res.status(200).json({ message: 'Inicio de sesión exitoso' });
});

app.post('/registro-usuario', async (req, res) => {
  const { nombre, apellido, rut, correo, clave } = req.body;

  // verificar si el correo existe en la bd
  const checkQuery = 'SELECT * FROM Usuario WHERE correo = ?';
  connection.query(checkQuery, [correo], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al verificar el correo' });
    } else if (results.length > 0) {
      res.status(400).json({ message: 'El correo ya está registrado' });
    } else {
      // si no existe el correo se inserta el nuevo usuario
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


//webpay
WebpayPlus.configureForIntegration(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration);


app.post('/crear-transaccion', async (req, res) => {
  const { buyOrder, sessionId, amount, returnUrl } = req.body;
  try {
    const tx = new WebpayPlus.Transaction();
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    res.json(response);
    console.log("create url: ", response.url);
    console.log("create token: ", response.token);
  } catch (error) {
    console.error('Error al crear la transacción:', error);
    res.status(500).json({ error: 'Error al crear la transacción' });
  }
});

app.get('/commit-transaccion', async (req, res) => {
  const { token_ws } = req.query;

  console.log('Token recibido:', token_ws);

  if (!token_ws || token_ws.trim() === '') {
    console.error('Error: token no puede ser nulo o una cadena vacía');
    res.status(400).redirect('http://localhost:3000/errorCompra');
    return;
  }
  try {
    const tx = new WebpayPlus.Transaction();
    const response = await tx.commit(token_ws);
    console.log('Respuesta recibida:', response);
    if (response.response_code === 0) {
      res.redirect('http://localhost:3000/compraRealizada');
    } else {
      res.redirect('http://localhost:3000/errorCompra');
    }
  } catch (error) {
    console.error('Error al confirmar la transacción:', error);
    console.log('Error al confirmar la transacción:', error);
    res.status(500).redirect('http://localhost:3000/errorCompra');
  }
});
//fin webpay

// Ruta para obtener los productos de la base de datos
app.get('/productos', (req, res) => {
  connection.query('SELECT id, nombre, precio FROM Producto', (error, results) => {
    if (error) {
      console.error('Error al obtener los productos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.json(results);
  });
});


// ruta para editar productos
app.put('/editar-productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, precio, stock } = req.body;

  // verifica si el producto existe
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

    // si el producto existe se actualiza
    connection.query('UPDATE Producto SET nombre = ?, precio = ?, stock = ? WHERE id = ?', [nombre, precio, stock, id], (error, results) => {
      if (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }

      // Devuelve el producto actualizado
      res.json({ id, nombre, precio, stock });
    });
  });
});


app.delete('/eliminar-producto/:id', (req, res) => {
  const id = parseInt(req.params.id);

  // verifica si el producto existe
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

    // si existe se borra 
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

// Ruta para obtener los detalles de un producto por su ID
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
    console.log('Producto encontrado:', results[0]);
    const producto = results[0];
    connection.query('SELECT descripcion AS categoria_descripcion FROM Categoria WHERE id = ?', [producto.categoria_id], (error, categoriaResults) => {
      if (error) {
        console.error('Error al obtener la descripción de la categoría:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }
      if (categoriaResults.length === 0) {
        console.error('No se encontró la categoría correspondiente al producto:', producto);
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }
      const categoriaDescripcion = categoriaResults[0].categoria_descripcion;
      producto.categoria_descripcion = categoriaDescripcion;
      res.json(producto);
    });
  });
});

// Ruta para obtener los productos por categoría
app.get('/productos/categoria/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT id, nombre, precio FROM Producto WHERE categoria_id = ?', [id], (error, results) => {
    if (error) {
      console.error('Error al obtener los productos por categoría:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener los clientes de la base de datos
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

// Ruta para obtener las categorías de la base de datos
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

const PORT = process.env.PORT || 3307;
app.listen(PORT, () => {
  console.log('Servidor backend corriendo en el puerto', PORT);
});
