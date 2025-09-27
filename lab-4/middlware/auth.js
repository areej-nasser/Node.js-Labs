// middleware/auth
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    console.warn("JWT_SECRET is not set. Set it in .env for proper auth.");
}

function authMiddleware(req, res, next) {
    const auth = req.headers['authorization'];
    if (!auth) return res.status(401).json({ message: 'Authorization header missing' });

    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Invalid Authorization format' });
    }

    const token = parts[1];
    try {
        const payload = jwt.verify(token, jwtSecret);
        // attach user minimal info to req
        req.user = { id: payload.id, email: payload.email };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = authMiddleware;
