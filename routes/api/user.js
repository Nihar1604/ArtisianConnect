const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../../controller/userController');
const jwt = require('jsonwebtoken'); // ✅ ADD THIS LINE
require('dotenv').config(); // ✅ ADD THIS LINE

const auth = (req, res, next) => {

  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
  }

 
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
      next();
  } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
  }
};


router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  userController.registerUser
);


router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  userController.loginUser
);

router.get('/profile', auth, userController.getUserProfile);

module.exports = router;