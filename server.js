const http = require('http');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

// Connection URL and database name
const url = 'mongodb://admin:password@localhost:27017';
const dbName = 'user-account';

const server = http.createServer((req, res) => {
  // Read the HTML file containing the JavaScript app
  fs.readFile('index.html', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
});

const port = process.env.PORT || 3000;

// Connect to the MongoDB database
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Connected to MongoDB');

  const db = client.db(dbName);

  // Start the server after connecting to the database
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
