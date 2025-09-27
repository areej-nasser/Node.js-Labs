// routes/profile
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /profile (protected) — req.user is set by auth middleware
router.get('/', async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const [rows] = await pool.execute(
            'SELECT id, name, email, age, created_at FROM users WHERE id = ?',
            [userId]
        );

        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ profile: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
