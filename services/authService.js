const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');

dotenv.config();

const registerUser = async (username, password, email) => {
  
    const hashedPassword = await bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });

    
    await newUser.save();
    return newUser;
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid password');

 
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
};

const refreshAccessToken = async (refreshToken) => {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return newAccessToken;
};

module.exports = { registerUser, loginUser, refreshAccessToken };

