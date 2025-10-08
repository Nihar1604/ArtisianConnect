const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.placeOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ msg: 'Cannot place order with an empty cart' });
        }


        const productIds = cart.items.map(item => item.productId);

        const productsFromDB = await Product.find({ '_id': { $in: productIds } });

 
        const orderItems = cart.items.map(cartItem => {
            const productDetails = productsFromDB.find(p => p._id.toString() === cartItem.productId);
            
            if (!productDetails) {
               
                throw new Error(`Product with ID ${cartItem.productId} not found.`);
            }

            return {
                productId: cartItem.productId,
                name: cartItem.productName,
                price: cartItem.price,
                quantity: cartItem.quantity,
                seller: productDetails.seller 
            };
        });


        const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        
        const order = new Order({
            user: req.user.id,
            items: orderItems,
            totalAmount: totalAmount
        });
        await order.save();

        await Cart.findOneAndDelete({ user: req.user.id });

     
        res.status(201).json(order);

    } catch (err) {
        console.error("Error in placeOrder:", err.message); // This will show the exact error in your backend console
        res.status(500).send('Server Error');
    }
};


exports.getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 'items.seller': req.user.id }).populate('user', 'username email');
        
        // Filter the items in each order to only show those sold by this seller
        const sellerOrders = orders.map(order => {
            const sellerItems = order.items.filter(item => item.seller.toString() === req.user.id);
            return {
                _id: order._id,
                user: order.user,
                totalAmount: order.totalAmount, // You may want to recalculate total for seller-specific items
                orderDate: order.orderDate,
                items: sellerItems
            };
        });

        res.json(sellerOrders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get a user's own order history
exports.getUserOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order || order.user.toString() !== req.user.id) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};