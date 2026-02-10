import express from 'express';
import { register, login } from '../controllers/auth.controller.js';

const authrouter = express.Router();

// Signup route
authrouter.post('/signup', register);

// Login route
authrouter.post('/login', login);

export default authrouter;
