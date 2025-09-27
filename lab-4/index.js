// index.js
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const authMiddleware = require('./middlware/auth');

// Middleware
app.use(express.json());

// 1) Public homepage
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the API' });
});

// 2) Auth routes: /auth/register, /auth/login
app.use('/auth', authRoutes);

// 3) Profile: protected route
app.use('/profile', authMiddleware, profileRoutes);

// 404 catch
app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});

// Error handler (optional)
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
