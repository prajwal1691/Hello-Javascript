const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

// Load the MongoDB URI from the .env file
require('dotenv').config();
const uri = process.env.MONGO_URI;

// Load user data from the database
async function loadUsers() {
  const client = await MongoClient.connect(uri);
  const db = client.db('userdb');
  const users = await db.collection('users').find().toArray();
  client.close();
  return users;
}

// Display the list of users
app.get('/', async (req, res) => {
  const users = await loadUsers();
  res.send(`
    <h1>User Database</h1>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        ${users.map(user => `
          <tr>
            <td>${user._id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td><a href="/edit?id=${user._id}">Edit</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `);
});

// Display the edit form for a specific user
app.get('/edit', async (req, res) => {
  const client = await MongoClient.connect(uri);
  const db = client.db('userdb');
  const user = await db.collection('users').findOne({ _id: new ObjectId(req.query.id) });
  client.close();
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  res.send(`
    <h1>Edit User ${user.name}</h1>
    <form method="post">
      <label>Name:</label>
      <input type="text" name="name" value="${user.name}">
      <label>Email:</label>
      <input type="email" name="email" value="${user.email}">
      <label>Phone:</label>
      <input type="text" name="phone" value="${user.phone}">
      <button type="submit">Save</button>
    </form>
  `);
});

// Handle form submission and update the user data in the database
app.post('/edit', async (req, res) => {
  const client = await MongoClient.connect(uri);
  const db = client.db('userdb');
  await db.collection('users').updateOne(
    { _id: new ObjectId(req.query.id) },
    { $set: { name: req.body.name, email: req.body.email, phone: req.body.phone } }
  );
  client.close();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
