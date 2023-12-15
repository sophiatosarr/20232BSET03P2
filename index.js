const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE cats (id INTEGER PRIMARY KEY, name TEXT, votes INTEGER)");
  db.run("CREATE TABLE dogs (id INTEGER PRIMARY KEY, name TEXT, votes INTEGER)");
});

app.post('/cats', (req, res) => {
  const name = req.body.name;

  db.run('INSERT INTO cats (name, votes) VALUES (?, 0)', [name], function(err) {
    if (err) {
      res.status(500).send("Erro ao inserir no banco de dados");
    } else {
      res.status(201).json({ id: this.lastID, name, votes: 0 });
    }
  });
});

app.post('/dogs', (req, res) => {
  const name = req.body.name;

  db.run('INSERT INTO dogs (name, votes) VALUES (?, 0)', [name], function(err) {
    if (err) {
      res.status(500).send("Erro ao inserir no banco de dados");
    } else {
      res.status(201).json({ id: this.lastID, name, votes: 0 });
    }
  });
});

app.post('/vote/:animalType/:id', (req, res) => {
  const { animalType, id } = req.params;

  const checkQuery = `SELECT COUNT(*) AS count FROM ${animalType} WHERE id = ?`;

  db.get(checkQuery, [id], (err, row) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else {
      const recordExists = row.count > 0;

      if (!recordExists) {
        res.status(404).send("Registro não encontrado");
      } else {
        const updateQuery = `UPDATE ${animalType} SET votes = votes + 1 WHERE id = ?`;

        db.run(updateQuery, [id], function(updateErr) {
          if (updateErr) {
            res.status(500).send("Erro ao atualizar o banco de dados");
          } else {
            res.status(200).send("Voto computado");
          }
        });
      }
    }
  });
});

app.get('/cats', (req, res) => {
  db.all("SELECT * FROM cats", [], (err, rows) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else {
      res.json(rows);
    }
  });
});

app.get('/dogs', (req, res) => {
  db.all("SELECT * FROM dogs", [], (err, rows) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else {
      res.json(rows);
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ocorreu um erro!');
});

app.listen(port, () => {
  console.log(`Cats and Dogs Vote app listening at http://localhost:${port}`);
});
