const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      console.log(err.message);
      return res.status(401).json({ message: 'Failed to authenticate token'});
    }

    // If token is valid, save decoded data to request for use in subsequent middleware
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
