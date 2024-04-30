// categoryRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('./categoryModel');

// GET /categories - Get categories with optional filtering by name and pagination
router.get('/', async (req, res) => {
  try {
    let filter = {};
    if (req.query.search) {
      filter.name = { $regex: new RegExp(req.query.search, 'i') }; // Case-insensitive search
    }

    const pageSize = parseInt(req.query.pageSize) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * pageSize;

    const categories = await Category.find(filter)
      .skip(skip)
      .limit(pageSize);

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
