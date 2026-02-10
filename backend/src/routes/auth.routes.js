import express from 'express';
import { register, login, getProfile, updateProfile, logout } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const authrouter = express.Router();

// Signup route
authrouter.post('/signup', register);

// Login route
authrouter.post('/login', login);

// Get Profile (Protected)
authrouter.get('/profile', protect, getProfile);

// Update Profile (Protected)
authrouter.put('/profile', protect, updateProfile);

// Logout (Protected)
authrouter.post('/logout', protect, logout);

export default authrouter;
