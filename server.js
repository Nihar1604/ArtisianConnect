const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const userRoutes = require('./routes/api/user');
const cartRoutes = require('./routes/api/cart');
const productRoutes = require('./routes/api/products');
const orderRoutes = require('./routes/api/orders');     


const app = express();
const PORT = 3000;

const MONGO_URI = 'mongodb+srv://jadhavparth2626_db_user:ParthJ2602@cluster0.0vudh4r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON request bodies


app.use('/api/users', userRoutes);
app.use('/api/cart' , cartRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/orders', orderRoutes);     

app.get('/', (req, res) => res.send('Artisans Connect API is running...'));


mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("Could not connect to MongoDB...", err));