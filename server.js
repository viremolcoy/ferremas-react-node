const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const WebpayPlus = require("transbank-sdk").WebpayPlus; // CommonJS
const { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = require("transbank-sdk");


const bodyParser = require('body-parser');
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


WebpayPlus.commerceCode = 597055555532;
WebpayPlus.apiKey = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';
WebpayPlus.environment = Environment.Integration;

app.post('/create', async (req, res) => {
  const { buyOrder, sessionId, amount, returnUrl } = req.body;
  const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
  const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
  res.json({
    url: response.url,
    token: response.token,
    returnUrl: response.returnUrl
  });
  console.log("create url: ",response.url);
  console.log("create token: ",response.token);
  console.log("create return: ",response.returnUrl);
});

app.post('/commit', async (req, res) => {
  const { token } = req.body;
  const response = await WebpayPlus.Transaction.commit(token);
  console.log("commit: ",response);
  res.json(response);
});

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
    console.log('Producto encontrado:', results[0]); // Registro adicional para depuración
    const producto = results[0];
    // Consulta para obtener la descripción de la categoría
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
      console.log('Descripción de la categoría:', categoriaResults[0].categoria_descripcion); // Registro adicional para depuración
      const categoriaDescripcion = categoriaResults[0].categoria_descripcion;
      // Agregamos la descripción de la categoría al objeto del producto
      producto.categoria_descripcion = categoriaDescripcion;
      console.log('Producto con descripción de categoría:', producto); // Registro adicional para depuración
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
            console.log(productos);
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


