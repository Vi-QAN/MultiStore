const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    }

    
});

const Category = mongoose.model('categories', categorySchema);

module.exports = Category;
