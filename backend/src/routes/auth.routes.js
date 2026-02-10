import express from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = express.Router();

// Signup route
router.post('/signup', register);

// Login route
router.post('/login', login);

export default router;
