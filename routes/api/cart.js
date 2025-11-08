const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); 
require('dotenv').config();
const cartController = require('../../controller/cartController');

const authMiddleware = (req, res, next) => {
  
  const token = req.header('Authorization')?.split(' ')[1];

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
router.get('/', authMiddleware, cartController.getCart);

router.post('/', authMiddleware, cartController.addItemToCart);

router.put('/:productId', authMiddleware, cartController.updateItemQuantity);

router.delete('/:productId', authMiddleware, cartController.removeItemFromCart);

module.exports = router;