// authentication/index.js
const express = require('express');
const session = require('express-session');
const { createClient } = require('redis');
const RedisStore = require('connect-redis').default;
const User = require('./userModel');
const { login, register } = require('./authController');

const router = express.Router();

// // Initialize client.
// let redisClient = createClient()
// redisClient.connect().catch(console.error);

// // Initialize store.
// let redisStore = new RedisStore({
//   client: redisClient,
//   prefix: "productapp:",
// })


// // Express session setup
// router.use(session({
//   store: redisStore,
//   secret: 'secret', // Change this to a random string
//   resave: false,
//   saveUninitialized: true
// }));

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { username, token } = await login(email, password);
    //req.session.userId = user.id;
    res.send({message: 'Login Successfully', token: token, username: username});
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(401).send(error.message);
  }
});

router.post('/register', async (req, res) => {
    const {email, username, password } = req.body;
  
    try {
      const newUser = await register(email,username, password);
      res.status(201).send(newUser);
    } catch (error) {
      res.status(400).send(error.message);
    }
});
  

// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Internal server error');
    }
    res.send('Logout successful');
  });
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).send('Unauthorized');
};


module.exports = router;
