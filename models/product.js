
const mongoose = require("mongoose");

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

module.exports = Product;
