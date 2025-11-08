const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Links to the User model
        required: true
    }
});

module.exports = mongoose.model('product', ProductSchema);