// productService/routes.js
const express = require('express');
const { getAllProducts, getProductById } = require('./productController');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, categories, maxPrice, sortedBy, pageSize, page } = req.query;
      
    const products = await getAllProducts(search, categories, parseFloat(maxPrice), sortedBy, parseInt(pageSize), parseInt(page));
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal server error');
  }
});


module.exports = router;
