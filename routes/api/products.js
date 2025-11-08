const express = require('express');
const router = express.Router();
const productController = require('../../controller/productController');

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify token
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

// Middleware to check if user is a seller
const isSeller = (req, res, next) => {
    if (req.user.role !== 'seller') {
        return res.status(403).json({ msg: 'Access denied. Sellers only.' });
    }
    next();
};

router.get('/', productController.getAllProducts);

router.post('/', [auth, isSeller], productController.addProduct);

router.put('/:id', [auth, isSeller], productController.updateProduct);

router.delete('/:id', [auth, isSeller], productController.deleteProduct);

router.get('/search', productController.searchProducts);

module.exports = router;