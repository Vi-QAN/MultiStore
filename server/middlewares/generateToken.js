const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    const token = jwt.sign({ userId: userId }, 'secret', { expiresIn: '1h' }); // Replace 'your_secret_key' with your actual secret key
    return token;
};

module.exports = generateToken;
