const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// Get all products (for users to view)
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'username');
        res.json(products);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Add a new product (seller only)
exports.addProduct = async (req, res) => {
    const { name, image, price } = req.body;
    try {
        const newProduct = new Product({
            name,
            image,
            price,
            seller: req.user.id
        });
        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Update a product (seller only, must own the product)
exports.updateProduct = async (req, res) => {
    const { name, image, price } = req.body;
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        // Ensure the seller owns the product
        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        product = await Product.findByIdAndUpdate(req.params.id, { $set: { name, image, price } }, { new: true });
        res.json(product);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Delete a product (seller only, must own the product)
exports.deleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Product.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Product removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

//Search 
exports.searchProducts = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ msg: 'Search query is required' });
        }

        const products = await Product.find({
            name: { $regex: query, $options: 'i' } 
        }).populate('seller', 'username');

        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};