const express = require('express');
const router = express.Router();
const orderController = require('../../controller/orderController');

const jwt = require('jsonwebtoken');
require('dotenv').config();


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


const isSeller = (req, res, next) => {
    if (req.user.role !== 'seller') {
        return res.status(403).json({ msg: 'Access denied. Sellers only.' });
    }
    next();
};


router.post('/', auth, orderController.placeOrder);
router.get('/', [auth, isSeller], orderController.getSellerOrders);
router.get('/:id', auth, orderController.getUserOrder);

module.exports = router;