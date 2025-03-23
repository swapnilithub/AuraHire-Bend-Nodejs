import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Sequelize model for User

const router = express.Router();

// ✅ Register HR User (Signup) at /signup-hr
router.post("/signup-hr", async (req, res) => {
  const { name, email, password, phone, photo, resume } = req.body;

  try {
    // Check if the user already exists using Sequelize
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json("User already exists");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new HR user using Sequelize
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'hr', // Default role for HR users
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, role: 'hr' },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Response without sending the password
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };

    res.status(201).json({ message: "Signup successful", token, user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Login HR User at /login-hr
router.post("/login-hr", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists in the database using Sequelize
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json("User not found");

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Invalid credentials");

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: 'hr' }, // Store the user ID in the JWT payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Response without sending the password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'hr'
    };

    res.json({ message: "Login successful", token, user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
