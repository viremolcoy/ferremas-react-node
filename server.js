const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } = require('transbank-sdk');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'nano2004',
  database: 'ferremas'
});

connection.connect(err => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

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
    console.log("create url: ", response.url);
    console.log("create token: ", response.token);
    console.log("create return: ", response.returnUrl);
  } catch (error) {
    console.error('Error al crear la transacción:', error);
    res.status(500).json({ error: 'Error al crear la transacción' });
  }
});

// Ruta para obtener las categorías de la base de datos y formatearlas como filtros
app.get('/filters', (req, res) => {
  connection.query('SELECT * FROM Categoria', (error, results) => {
    if (error) {
      console.error('Error al obtener las categorías:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }

    const filters = [
      {
        id: 'category',
        name: 'Category',
        options: results.map(category => ({
          value: category.id,
          label: category.descripcion, // Asumiendo que tienes una columna 'descripcion' en la tabla 'Categoria'
          checked: false // Inicialmente, ninguna categoría está seleccionada
        }))
      }
    ];

    res.json(filters);
  });
});

app.post('/commit', async (req, res) => {
  const { token } = req.body;
  try {
    const response = await WebpayPlus.Transaction.commit(token);
    console.log("commit: ", response);
    res.json(response);
  } catch (error) {
    console.error('Error al confirmar la transacción:', error);
    res.status(500).json({ error: 'Error al confirmar la transacción' });
  }
});

app.post('/crear-transaccion', async (req, res) => {
  const { buyOrder, sessionId, amount, returnUrl } = req.body;
  try {
    const tx = new WebpayPlus.Transaction();
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    res.json(response);
  } catch (error) {
    console.error('Error al crear la transacción:', error);
    res.status(500).json({ error: 'Error al crear la transacción' });
  }
});

// Ruta para obtener los productos de la base de datos
app.get('/productos', (req, res) => {
  const { categorias, marcas } = req.query;

  let query = 'SELECT id, nombre, precio FROM Producto WHERE 1=1';
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

app.get('/categorias', (req, res) => {
  connection.query('SELECT * FROM Categoria', (error, categorias) => {
    if (error) {
      console.error('Error al obtener las categorías de SERVER JS:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    console.log('Categorías obtenidas:', categorias);
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
          console.log('Categorías con productos:', categorias);
          res.json(categorias);
        }
      });
    });
  });
});


// Ruta para obtener las categorías de la base de datos
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
  let query = 'SELECT id, nombre, precio FROM Producto WHERE 1=1';
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



const PORT = process.env.PORT || 3307;
app.listen(PORT, () => {
  console.log('Servidor backend corriendo en el puerto', PORT);
});
