import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { asyncHandler } from '../middleware/error.middleware.js';

// Register/Signup
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    message: 'User registered successfully. Please login to continue.',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const jwtSecret = process.env.JWT_SECRET;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  if (!jwtSecret) {
    return res.status(500).json({ message: 'JWT_SECRET is not configured on the server' });
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Compare password
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    jwtSecret,
    { expiresIn: '7d' }
  );

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// Get User Profile
export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId).select('-password');
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({
    message: 'Profile fetched successfully',
    user,
  });
});

// Update User Profile
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { name, email, currentPassword, newPassword } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const hasPasswordUpdate = Boolean(newPassword || currentPassword);

  if (!normalizedName || !normalizedEmail) {
    return res.status(400).json({ message: 'Please provide your name and email' });
  }

  // Check if email already exists (excluding current user)
  if (normalizedEmail !== user.email) {
    const emailExists = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: userId },
    });

    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }
  }

  if (hasPasswordUpdate) {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Please provide current password and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters',
      });
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
  }

  user.name = normalizedName;
  user.email = normalizedEmail;
  await user.save();

  const safeUser = user.toObject();
  delete safeUser.password;

  res.status(200).json({
    message: 'Profile updated successfully',
    user: safeUser,
  });
});

// Logout
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: 'Logout successful. Please delete the token from client side.',
  });
});
