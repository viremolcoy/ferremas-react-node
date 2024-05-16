const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

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


