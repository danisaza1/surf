import express from 'express';
import { getProfile } from "../controllers/authController.js";
import { authenticateToken } from '../middleware/authMiddleware.js';
import {
  signup,
  changePassword,
  login,
  
  refreshToken,
//   logout,
} from '../controllers/authController.js';
console.log('authRoutes loaded sir'); // Debug

const router = express.Router();

router.post('/signup', signup);
router.patch('/change-password', changePassword);
router.post('/login', login);
router.post('/refresh-token', refreshToken); 
// router.post('/logout', logout); 
router.get('/profile',authenticateToken , getProfile)

export default router;
