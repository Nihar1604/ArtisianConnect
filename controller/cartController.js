const Cart = require('../models/Cart');


exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.json({ items: [] }); // Return empty cart if none exists
        }
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.addItemToCart = async (req, res) => {
    const { productId, name, price, image } = req.body;

    try {
        let cart = await Cart.findOne({ user: req.user.id });

   
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        const itemIndex = cart.items.findIndex(p => p.productId === productId);

        if (itemIndex > -1) {
          
            let productItem = cart.items[itemIndex];
            productItem.quantity += 1;
            cart.items[itemIndex] = productItem;
        } else {
          
            cart.items.push({ 
                productId: productId, 
                productName: name, 
                price: price, 
                productImage: image,
                quantity: 1 
            });
        }
        
        await cart.save();
        res.status(200).json(cart);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateItemQuantity = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
        return res.status(400).json({ msg: 'Quantity must be at least 1.' });
    }

    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }
        
        const itemIndex = cart.items.findIndex(p => p.productId === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ msg: 'Item not found in cart' });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        res.json(cart);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.removeItemFromCart = async (req, res) => {
    const { productId } = req.params;

    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }
        
        cart.items = cart.items.filter(p => p.productId !== productId);

        await cart.save();
        res.json(cart);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};