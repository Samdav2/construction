import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// 1. ROUTE IMPORTS
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/ProjectRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import marketplaceRoutes from './routes/marketplaceRoutes';
import workforceRoutes from './routes/workforceRoutes';
import boqRoutes from './routes/boqRoutes';
import tenderRoutes from './routes/tenderRoutes';
import messageRoutes from './routes/messageRoutes';
import adminRoutes from './routes/adminRoutes';
import exploreRoutes from './routes/exploreRoutes';
import inquiryRoutes from './routes/inquiryRoutes';
import documentRoutes from './routes/documentRoutes';
import aiRoutes from './routes/aiRoutes';
import serviceRoutes from './routes/serviceRoutes';
import walletRoutes from './routes/walletRoutes';
import fxRoutes from './routes/fxRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import opportunityRoutes from './routes/opportunityRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import payrollRoutes from './routes/payrollRoutes';
import taskRoutes from './routes/taskRoutes';
import workerAuthRoutes from './routes/workerAuthRoutes';
import receiptRoutes from './routes/receiptRoutes';
import superAdminRoutes from './routes/superAdminRoutes';
import communityRoutes from './routes/communityRoutes';

import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();
const app = express();

// 2. GLOBAL MIDDLEWARES
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

const isOriginAllowed = (origin?: string | null): boolean => {
  if (!origin) return true;

  const staticOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:4173",
    "https://construction-ten-zeta.vercel.app",
    "https://cpromark.com",
    "https://www.cpromark.com",
    "https://cprohub.cpromark.com",
    "https://d1q5gtvb1a02hf.cloudfront.net",
    "https://d12e8wwao0hlhx.cloudfront.net"
  ];

  if (process.env.CLIENT_URL) staticOrigins.push(process.env.CLIENT_URL);
  if (process.env.FRONTEND_URL) staticOrigins.push(process.env.FRONTEND_URL);

  if (staticOrigins.includes(origin)) return true;

  try {
    const url = new URL(origin);
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return true;
    if (url.hostname.endsWith('.railway.app') || url.hostname.endsWith('.up.railway.app')) return true;
    if (url.hostname.endsWith('.cpromark.com') || url.hostname === 'cpromark.com') return true;
    if (url.hostname.endsWith('.cprohub.com') || url.hostname === 'cprohub.com') return true;
  } catch {
    return false;
  }

  return false;
};

app.use(cors({
  origin: function (origin, callback) {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));

// Webhook route needs raw body for HMAC verification — mount BEFORE express.json()
app.use('/api/v1/wallet/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

// 3. API ENDPOINTS (Version 1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/marketplace', marketplaceRoutes);
app.use('/api/v1/workforce', workforceRoutes);
app.use('/api/v1/boq', boqRoutes);
app.use('/api/v1/tenders', tenderRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/superadmin', superAdminRoutes);
app.use('/api/v1/explore', exploreRoutes);
app.use('/api/v1/inquiries', inquiryRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/fx', fxRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/opportunities', opportunityRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/payroll', payrollRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/worker', workerAuthRoutes);
app.use('/api/v1/receipts', receiptRoutes);
app.use('/api/v1/community', communityRoutes);

// 4. API STATUS & HEALTH CHECK ROUTES
app.get(['/api', '/api/v1'], (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Cpro Hub / BuildHub API Engine',
    version: '4.0.0',
    status: 'online',
    health: '/health',
    message: 'Welcome to Cpro Hub / BuildHub API v1. Use the endpoints below to interact with the platform.',
    endpoints: {
      auth: '/api/v1/auth',
      projects: '/api/v1/projects',
      invoices: '/api/v1/invoices',
      marketplace: '/api/v1/marketplace',
      workforce: '/api/v1/workforce',
      boq: '/api/v1/boq',
      tenders: '/api/v1/tenders',
      messages: '/api/v1/messages',
      admin: '/api/v1/admin',
      superadmin: '/api/v1/superadmin',
      explore: '/api/v1/explore',
      inquiries: '/api/v1/inquiries',
      documents: '/api/v1/documents',
      ai: '/api/v1/ai',
      services: '/api/v1/services',
      wallet: '/api/v1/wallet',
      fx: '/api/v1/fx',
      analytics: '/api/v1/analytics',
      opportunities: '/api/v1/opportunities',
      attendance: '/api/v1/attendance',
      payroll: '/api/v1/payroll',
      tasks: '/api/v1/tasks',
      worker: '/api/v1/worker',
      receipts: '/api/v1/receipts',
      community: '/api/v1/community'
    },
    timestamp: new Date()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'BuildHub API Engine is healthy', 
    service: 'cprohub-api',
    timestamp: new Date() 
  });
});

// Catch-all for unhandled API routes — ALWAYS return JSON, NEVER return HTML
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date()
  });
});

// 5. PRODUCTION STATIC CLIENT SERVING (Only when explicitly enabled via SERVE_FRONTEND=true)
const shouldServeFrontend = process.env.SERVE_FRONTEND === 'true';

if (shouldServeFrontend) {
  const possibleDistPaths = [
    path.resolve(__dirname, '../../web/dist'),
    path.resolve(__dirname, '../../../apps/web/dist'),
    path.resolve(process.cwd(), 'apps/web/dist'),
    path.resolve(process.cwd(), 'dist')
  ];

  for (const distPath of possibleDistPaths) {
    if (fs.existsSync(path.join(distPath, 'index.html'))) {
      app.use(express.static(distPath, { index: false }));
      app.use((req, res, next) => {
        if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/health')) {
          return next();
        }
        res.sendFile(path.join(distPath, 'index.html'));
      });
      break;
    }
  }
}

// 6. DEFAULT API ROOT ROUTE
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'Cpro Hub / BuildHub API Engine',
    status: 'online',
    version: '4.0.0',
    health: '/health',
    api: '/api/v1',
    timestamp: new Date()
  });
});

// 7. GLOBAL 404 HANDLER FOR UNMATCHED ROUTES (Always JSON)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Resource not found',
    path: req.originalUrl,
    method: req.method
  });
});

app.use(errorHandler);

export default app;