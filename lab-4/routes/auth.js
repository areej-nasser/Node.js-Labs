// routes/auth
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { registerSchema, loginSchema } = require('../validators/authSchemas');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_prod';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';

// POST /auth/register
router.post('/register', async (req, res) => {
    try {
        // Validate request body
        const { error, value } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { name, email, password, age } = value;

        // Check if email already exists
        const [rows] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

        // Insert user
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password_hash, age) VALUES (?, ?, ?, ?)',
            [name, email, password_hash, age]
        );

        const createdUserId = result.insertId;

        // Return minimal user object (exclude password hash)
        const [newUserRows] = await pool.execute(
            'SELECT id, name, email, age, created_at FROM users WHERE id = ?',
            [createdUserId]
        );

        res.status(201).json({ user: newUserRows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email, password } = value;

        const [rows] = await pool.execute(
            'SELECT id, email, password_hash FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // sign a JWT
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
