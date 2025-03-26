const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables from .env
const cors = require('cors');  // Import CORS

const dbURI = process.env.MONGO_URI; // Your MongoDB connection string

// Connect to MongoDB
mongoose.connect(dbURI)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.log('MongoDB Connection Error:', err);
  });

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());  // This line enables CORS

// Add the Product model
const Product = require('./models/Product');

// Create a GET route for products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from MongoDB
    res.json(products); // Return products as JSON
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// Create a POST route to add a new product
app.post('/products', async (req, res) => {
  const { name, price, description } = req.body; // Expecting these fields in the body
  const newProduct = new Product({ name, price, description });

  try {
    const savedProduct = await newProduct.save(); // Save the product to MongoDB
    res.status(201).json(savedProduct); // Return the saved product with a 201 status (created)
  } catch (err) {
    res.status(500).json({ message: 'Failed to save product' });
  }
});

// Handle all other routes
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
