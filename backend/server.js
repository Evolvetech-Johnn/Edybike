const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Rate Limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login
  message: 'Too many login attempts, please try again later.'
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());

// Apply rate limiting to all API routes
app.use('/api/', limiter);

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const freteRoutes = require('./src/routes/frete.routes');
const pedidoRoutes = require('./src/routes/pedido.routes');

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api', freteRoutes); // Rotas de frete
app.use('/api', pedidoRoutes); // Rotas de pedidos

app.get('/', (req, res) => {
  res.send('Edy-Bike API is running');
});

// Inicializar Cron Jobs
const { iniciarCronRastreamento } = require('./src/cron/rastreamento.cron');

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    // Only connect to DB if URI is valid/present, otherwise server will crash on start if env is not set
    if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<password>')) {
        await connectDB();
    } else {
        console.warn('MongoDB URI not configured or contains placeholders. Skipping DB connection for dry run.');
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
};

startServer();
