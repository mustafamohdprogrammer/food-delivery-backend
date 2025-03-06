const express = require("express");
const router = express.Router();
const User = require("../Modals/User"); // Import your User model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Import dotenv to load environment variables

const JWT_SECRET = process.env.JWT_SECRET; // Load JWT_SECRET from .env

// Login route
router.post("/loginuser", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        // Compare the password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT token
        const authToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

        res.json({
            success: true,
            authToken,
            message: "Login successful",
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;
