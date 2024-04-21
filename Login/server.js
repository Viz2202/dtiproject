// server.js
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/LoginSignUp")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

// Define the schema for the login data
const loginSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

// Create a model from the schema
const Collection = mongoose.model("Collection1", loginSchema);

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../Login')));

// Route to serve the login/signup form
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, '../Login/index.html'));
});

// Route to handle signup form submission
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('Please fill all the required fields');
  }

  try {
    // Create a new document in the database
    const data = new Collection({ name, email, password });
    await data.save();

    // Optionally, you can redirect the user to another page after successful signup
    res.sendFile(path.join(__dirname, '../Option/option_selector.html'));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving user data');
  }
});

// Route to handle login form submission
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Please fill all the required fields');
  }

  try {
    // Find the user in the database based on email and password
    const user = await Collection.findOne({ email, password });

    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    // Optionally, you can redirect the user to another page after successful login
    res.sendFile(path.join(__dirname, '../Option/option_selector.html'));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error logging in');
  }
});

app.listen(3000, () => {
  console.log('Port Connected');
});
