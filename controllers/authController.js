const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:"1h"});
};

// Register User
exports.registerUser = async (req, res) => {
    const {fullName, username, email, password, profileImageUrl} = req.body;

    // Validation: check for missing fields
    if (!fullName || !username || !email || !password) {
        return res.status(400).json({message:"All field are required"});       
    }

    // Validation : Check username format
    // Allows alphanumeric characters and hyphens only
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({
            message:"Invalid username. Only alphanumeric characters and hyphens are allowed. No spaces are permitted."
        });
    }

    try {
        // check if email already exists
        const existingUser = await User.findOne({ email});
        if (existingUser) {
            return res.status(400).json({message:"Email already in use."});
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ email });
        if (existingUsername) {
            return res
                .status(400)
                .json({message:"Username not available. Try another one."});
        }

        // Create the user
        const user = await User.create({
            fullName,
            username,
            email,
            password,
            profileImageUrl
        });

        res.status(201).json({
            id:user._id,
            user,
            token:generateToken(user._id)
        });
    } catch (error) {
        res
            .status(500)
            .json({message:"Error registering user", error:error.message});
    }
}
