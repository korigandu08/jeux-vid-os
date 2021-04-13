const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
 
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'score',
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
const app = express();
 
app.use(cors());
app.use(express.json());
 
app.get('/', (request, response) => {
  response.status(200).send({ message: 'It is working!' });
});
 
app.get('/scoreboard', (request, response) => {
  connection.query(
    'SELECT * FROM score ORDER BY score DESC LIMIT 5',
    (error, results, fields) => {
      if (error) throw error;
      response.status(200).send(results);
    }
  );
});

app.post('/score', (request, response) => {
  const payload = request.body;
 
  if (!payload.player || !payload.score) {
    response
      .status(400)
      .send({ message: 'The player name or the score is missing.' });
  }
 
  connection.query(
    `INSERT INTO score (player, score) VALUES ('${payload.player}', ${payload.score})`,
    (error, results, fields) => {
      if (error) throw error;
      response.status(200).send({ message: 'Score has been saved!' });
    }
  );
});
 
app.listen(8080, () => console.log('Server is listening...'));