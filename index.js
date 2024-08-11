const express = require('express');
const cors = require('cors');
const mongoose = require('./config/db'); // Import the database connection
require('dotenv').config();

// Define the schema for the Product model
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: mongoose.Types.Decimal128, // Use Decimal128 for precise decimal values
      required: true,
    },
    photos: {
      type: [String], // Array of strings to store multiple photo URLs
    },
  },
  {
    timestamps: false, // No automatic timestamps
    collection: "products", // Ensure the collection name matches the existing MySQL table
  }
);

// Create and export the Product model
const Product = mongoose.model("Product", productSchema);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3001', // Allow this origin, use env variable if needed
  methods: 'GET,POST,PUT,DELETE', // Allowed methods
  allowedHeaders: 'Content-Type,Authorization', // Allowed headers
};

app.use(cors(corsOptions));
app.use(express.json());

// Add product endpoint
app.post('/add-product', async (req, res) => {
  const { name, category, brand, price, description, photos } = req.body;
  try {
    const newProduct = new Product({
      name,
      category,
      brand,
      price,
      description,
      photos
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Fetch all products endpoint
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Update product endpoint
app.put('/products/update/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, brand, price, description, photos } = req.body;

  try {
    const product = await Product.findById(id);
    if (product) {
      product.name = name;
      product.category = category;
      product.brand = brand;
      product.price = price;
      product.description = description;
      product.photos = photos;

      await product.save();
      res.status(200).json({ message: 'Product updated successfully', product });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
