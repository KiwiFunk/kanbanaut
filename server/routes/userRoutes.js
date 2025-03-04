const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Registration Endpoint
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const saltRounds = 10; // The complexity of the hashing process
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create and save the user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        // Respond with success
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
});

// Login Endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT
        const token = require('jsonwebtoken').sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'secretkey', // Replace 'secretkey' with a real secret in your .env file
            { expiresIn: '1h' }
        );

        // Respond with the token
        res.status(200).json({ token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
});


module.exports = router;