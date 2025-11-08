const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/api/user');
const cartRoutes = require('./routes/api/cart');
const productRoutes = require('./routes/api/products');
const orderRoutes = require('./routes/api/orders');

const app = express();
const PORT = process.env.PORT || 3000;

const MONGO_URI = 'mongodb+srv://jadhavparth2626_db_user:ParthJ2602@cluster0.0vudh4r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const allowedOrigins = [
  'https://artisian-connect-frontend-729s.vercel.app', 
  'http://localhost:5500', 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// ✅ Handle preflight OPTIONS requests explicitly
app.options('*', cors());

app.use(express.json()); // Parse JSON request bodies

// ✅ API Routes
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Root route
app.get('/', (req, res) => res.send('Artisans Connect API is running...'));

// ✅ MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("❌ Could not connect to MongoDB...", err));
