const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authService = require('../services/authService');
const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *               - email
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);  
        const newUser = new User({ username, password: hashedPassword, email });

        await newUser.save();

        res.status(201).json({ message: 'User successfully registered' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     description: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Invalid password
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: 'User not found' });
        }

        
        console.log("User found:", user);

        
        const isMatch = bcrypt.compareSync(password.trim(), user.password);
  
        console.log("Password match result:", isMatch);

        if (!isMatch) {
            console.log("Invalid password");
            return res.status(400).json({ message: 'Invalid password' });
        }

        
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        res.json({ accessToken, refreshToken });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: 'Server error' });
    }
});


/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     description: Refresh access token using refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: New access token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Invalid refresh token
 */
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const newAccessToken = await authService.refreshAccessToken(refreshToken);
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(400).json({ message: 'Invalid refresh token' });
    }
});

module.exports = router;


