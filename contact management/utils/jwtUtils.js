const jwt = require('jsonwebtoken');

const createAccessToken = (user) => jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

const createRefreshToken = (user) => jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

module.exports = { createAccessToken, createRefreshToken };

