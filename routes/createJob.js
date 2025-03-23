import express from 'express';
import sequelize from '../config/db.js'; // Import the Sequelize instance
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user; // User info is available in req.user
    next();
  });
};

// Route to create a job
router.post('/jobs', authenticateJWT, async (req, res) => {
  const { category, company, description, location, title, hr_id } = req.body;

  // Ensure all required fields are provided
  if (!category || !company || !description || !location || !title || !hr_id) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Prepare the SQL query
  const query = `
    INSERT INTO job (category, company, description, location, title, hr_id, created_on)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  const values = [category, company, description, location, title, hr_id];

  try {
    // Execute the query using sequelize.query (raw query)
    await sequelize.query(query, {
      replacements: values,  // Use replacements for SQL injection protection
      type: sequelize.QueryTypes.INSERT, // Specify the query type
    });

    res.status(201).json({ message: 'Job created successfully!' });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job. Please try again.' });
  }
});

export default router;
