const express = require("express");
const path = require("path");
const app = express();
const bcrypt = require('bcrypt');
const cors = require("cors");
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server') 

const authenticationRoutes = require('./authentication');
const productRoutes = require('./product');
const orderRoutes = require('./order');
const categoryRoutes = require('./category');

const Category = require('./category/categoryModel')
const User = require('./authentication/userModel');

const { readData } = require('./product/productController');

app.use(cors());
app.use(express.json());

async function connect(){
  try {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // await mongoose.connect('mongodb://qa:qa@127.0.0.1:27017/Assignment?authSource=admin', {useNewUrlParser: true});
    await mongoose.connect(uri)
    console.log('Connect successfully');
  } catch (err){
      console.log('Cannot connect to mongo')
  }
}



async function populateDatabase(){
  await connect();

  try {
    await User.createCollection();
    const hashedPassword = await bcrypt.hash("123", 10);
    await User.create({email: "123@gmail.com", username: "User 1", password: hashedPassword});

    await Category.createCollection();
    const count = await Category.countDocuments().exec();
    if (count === 0){
      const products = await readData();
        
      let avaiblableCategories = new Set();
      let categoryIds = []
      let categoryNames = []
      const categories = products.map(p => p.category);
      for (let list of categories){
        for (let item of list){
          if (!avaiblableCategories.has(item['id'])){
            categoryIds.push(item['id']);
            categoryNames.push(item['name']);
            avaiblableCategories.add(item['id']);
          }
        }
      }
      let combined = []
      for (let i = 0; i < categoryIds.length; i++){
        combined.push({ id: categoryIds[i], name: categoryNames[i]})
      }

      await Category.create(combined);
    }
    console.log("Database is populated successfully");
  } 
  catch (error){
    console.log("Failed to populate database", error);
  }
}

populateDatabase();

// Authentication routes
app.use('/auth', authenticationRoutes);

// Product routes
app.use('/products', productRoutes);

// Order routes
app.use('/orders', orderRoutes);

// Category
app.use('/categories', categoryRoutes);

app.listen(3000, () => {
  console.log("App running on http://localhost:3000");
});
