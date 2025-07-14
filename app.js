const express = require('express');
const path = require('path');
const connectToDB = require('./mongo'); 

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json()); // allows post

//  GET /api/users (Search, Sort, Paginate) 
app.get('/api/users', async (req, res) => {
  const db = await connectToDB();
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const queryField = req.query.sortBy || 'firstName';
  const queryText = req.query.query || '';

  const query = {};
  if (queryText) {
    query[queryField] = { $regex: queryText, $options: 'i' };
  }

  const sortOrder = req.query.order === 'asc' ? 1 : -1;
  const sort = { [queryField]: sortOrder };

  const users = await db.collection('users')
    .find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();

  const total = await db.collection('users').countDocuments(query);

  res.json({ users, total });
});

//  POST /api/newUser 

app.post('/api/newUser', async (req, res) => {
  const db = await connectToDB();
  const newUser = req.body;

  console.log('New user data:', newUser);

  await db.collection('users').insertOne(newUser);

  res.json({ message: 'User created successfully', user: newUser });
});

// DELETE /api/deleteUser/:id

app.delete('/api/deleteUser/:id', async (req, res) => {
  const db = await connectToDB();
  const userId = req.params.id;

  console.log('Deleting user with ID:', userId);

  const result = await db.collection('users').deleteOne({ userId: parseInt(userId) });

  if (result.deletedCount === 1) {
    res.json({ message: 'User deleted successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});


// Update user

app.put('/api/users/:id', async (req, res) => { 

  const db = await connectToDB();
  const userId = req.params.id;
  const updatedUser = req.body;

  console.log('Editing user with ID:', userId);

   await db.collection('users').updateOne({ userId: parseInt(userId) }, { $set: updatedUser });

  res.json({ message: 'User updated successfully', user: updatedUser });

})

// ===== Start Server =====
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
