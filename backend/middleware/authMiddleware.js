import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { findUserById } from '../utils/demoStore.js';
import { useMongo } from '../utils/storageMode.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pocketmentor-secret');

      req.user = useMongo()
        ? await User.findById(decoded.id).select('-password')
        : findUserById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ message: 'User not found.' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token.' });
  }
};

export { protect };
