const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key';

// Middleware to authenticate using JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
    console.log(token)
    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user; // Add user info to the request
        next();
    });
}

module.exports = authenticateToken;
