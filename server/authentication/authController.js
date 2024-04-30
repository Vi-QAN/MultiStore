// authentication/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./userModel');

const generateToken = require('../middlewares/generateToken');

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email: email }).exec();

    if (!user) {
      throw new Error('Invalid username or password');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new Error('Invalid username or password');
    }

    // Generate JWT token
    const token = generateToken(user.id);
    return { username: user.username, token };

  } catch (error) {
    throw error;
  }
};

const register = async (email, username, password) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({email, username, password: hashedPassword, orderList: [] });
      await newUser.save();
      return newUser;
    } catch (error) {
      throw error;
    }
};

module.exports = {
  login,
  register
};
