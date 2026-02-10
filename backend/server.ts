import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';

// Carregar .env apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

import connectDB from './src/config/db';

// Routes
import authRoutes from './routes/authRoutes';
import uploadRoutes from './routes/uploadRoutes'; // Assuming these will be migrated or are implicit
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
// import promotionRoutes from './routes/promotionRoutes'; // To be migrated
// import analyticsRoutes from './routes/analyticsRoutes'; // To be migrated
// import userRoutes from './routes/userRoutes'; // To be migrated
// import settingsRoutes from './routes/settingsRoutes'; // To be migrated
// import freteRoutes from './src/routes/frete.routes'; // To be migrated
// import pedidoRoutes from './src/routes/pedido.routes'; // To be migrated
// import adminRoutes from './src/routes/admin'; // To be migrated

// Import cron jobs - assuming these files handle their own execution or are converted
// import { iniciarCronRastreamento } from './src/cron/rastreamento.cron'; 

const app: Express = express();

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Too many requests from this IP, please try again later.'
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

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// Placeholder for routes not yet migrated - keeping logical placeholders
app.use('/api/admin/upload', uploadRoutes); // Needs migration
// app.use('/api/admin/promotions', promotionRoutes);
// app.use('/api/admin/analytics', analyticsRoutes);
// app.use('/api/admin/users', userRoutes);
// app.use('/api/admin/settings', settingsRoutes);
// app.use('/api/settings', settingsRoutes); 
// app.use('/api', freteRoutes); 
// app.use('/api', pedidoRoutes); 
// app.use('/api/admin', adminRoutes); 

app.get('/', (req: Request, res: Response) => {
  res.send('Edy-Bike API is running');
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    // Only connect to DB if URI is valid/present
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
