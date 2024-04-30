// productService/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: Number,
  name: String,
  type: String,
  price: Number,
  upc: String,
  category: [{
    id: String,
    name: String
  }],
  shipping: Number,
  description: String,
  manufacturer: String,
  model: String,
  url: String,
  image: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
