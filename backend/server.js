const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

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
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.send('Edy-Bike API is running');
});

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
