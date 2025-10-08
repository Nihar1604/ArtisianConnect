const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
require('dotenv').config();

// --- User Registration ---
exports.registerUser = async (req, res) => {
 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password ,role} = req.body;

  try {
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    
    user = new User({
      username,
      email,
      password,
      role
    });


    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);


    await user.save();


    const payload = {
      user: {
        id: user.id, 
        role:user.role
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, // Token expires in 5 hours
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// --- User Login ---
exports.loginUser = async (req, res) => {
  // 1. Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // 2. Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. Compare provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 4. If credentials are valid, create and return JWT
    const payload = {
      user: {
        id: user.id,
        role:user.role
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserProfile = async (req, res) => {
  try {
      // Find user by their ID from the token
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
          return res.status(404).json({ msg: 'User not found' });
      }

      // If the user is a seller, find their products
      if (user.role === 'seller') {
          const products = await Product.find({ seller: req.user.id });
          // Return user info along with their products
          return res.json({ ...user.toObject(), products });
      } else {
          // If the user is a regular user, find their order history
          const orders = await Order.find({ user: req.user.id }).sort({ orderDate: -1 });
          // Return user info along with their orders
          return res.json({ ...user.toObject(), orders });
      }
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
};