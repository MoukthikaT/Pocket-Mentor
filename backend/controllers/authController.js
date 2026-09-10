import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { createUser, findUserByEmail, findUserById } from '../utils/demoStore.js';

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password.');
  }

  if (confirmPassword && password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match.');
  }

  const userExists = process.env.MONGODB_URI ? await User.findOne({ email }) : findUserByEmail(email);

  if (userExists) {
    res.status(400);
    throw new Error('User already exists.');
  }

  const user = process.env.MONGODB_URI ? await User.create({
    name,
    email,
    password,
  }) : createUser({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile || null,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data.');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = process.env.MONGODB_URI ? await User.findOne({ email }) : findUserByEmail(email);

  const passwordMatches = user && (process.env.MONGODB_URI ? await user.matchPassword(password) : user.password === password);
  if (!passwordMatches) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profile: user.profile || null,
    token: generateToken(user._id),
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = process.env.MONGODB_URI ? await User.findById(req.user._id).select('-password') : findUserById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  res.json(user);
});

export { registerUser, loginUser, getCurrentUser };
