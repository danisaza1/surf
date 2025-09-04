import express from 'express';
import { getLatestUser } from "../controllers/authController.js";

import {
  signup,
  changePassword,
  login,
//   refreshToken,
//   logout,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.patch('/change-password', changePassword);
router.post('/login', login);
// router.post('/refresh-token', refreshToken); 
// router.post('/logout', logout); 
// router.get("/latest-user", getLatestUser)            

export default router;
