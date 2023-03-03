const express = require('express');
/* const mongodb = require('mongodb'); */
const { MongoClient } = require("mongodb");
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');

    const db = client.db();

    app.get('/', (req, res) => {
      db.collection('users').find().toArray()
        .then(users => {
          res.send(users);
        })
        .catch(err => {
          console.error(err);
          res.status(500).send('Internal server error');
        });
    });

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error(err);
  });
