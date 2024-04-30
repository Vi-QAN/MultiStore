// authentication/userModel.js
const mongoose = require('mongoose');

const OrderSchema = require('../order/orderModel');

const User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  orderList: [OrderSchema]
});

module.exports = User;
