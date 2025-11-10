const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

const MONGO_URI ='mongodb+srv://jadhavparth2626_db_user:ParthJ2602@cluster0.0vudh4r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// ✅ CORS Middleware
const allowedOrigins = [
  'https://artisian-connect-frontend-729s.vercel.app',
  'http://localhost:5500',
  'http://localhost:5173',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'null'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// ✅ Must come before routes
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Important for preflight
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static routes
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/favicon.png', (req, res) => res.status(204).end());
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Artisans Connect API is running...',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
const userRoutes = require('./routes/api/user');
const cartRoutes = require('./routes/api/cart');
const productRoutes = require('./routes/api/products');
const orderRoutes = require('./routes/api/orders');

app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Internal server error'
  });
});

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    }
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

module.exports = app;
