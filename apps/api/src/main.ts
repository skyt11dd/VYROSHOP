import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import 'dotenv/config';

import { publicRoutes } from './routes/public';
import { authRoutes } from './routes/auth';
import { crmRoutes } from './routes/crm';
import { customerRoutes } from './routes/customer';
import { telegramRoutes } from './routes/telegram';
import { registerWebSocketClient } from './websocket';

const fastify = Fastify({ logger: true });

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'https://vyro.store',
  'https://www.vyro.store',
  'https://crm.vyro.store',
];

fastify.register(cors, {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'fallback_secret_change_me',
});

fastify.register(websocket);

// Initialize Telegram Bot
import { initBot } from './telegram';
initBot();

// Health check
fastify.get('/api/health', async () => {
  return { status: 'ok', service: 'vyro-api', timestamp: new Date().toISOString() };
});

fastify.register(publicRoutes, { prefix: '/api/public' });
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(crmRoutes, { prefix: '/api/crm' });
fastify.register(customerRoutes, { prefix: '/api/customer' });
fastify.register(telegramRoutes, { prefix: '/api/telegram' });

// Realtime WebSocket for CRM
fastify.get('/api/realtime', { websocket: true }, (connection) => {
  registerWebSocketClient(connection.socket);
  connection.socket.send(JSON.stringify({ type: 'CONNECTED', message: 'VYRO Realtime connected' }));
});

const start = async () => {
  try {
    await fastify.listen({ port: Number(process.env.PORT) || 4000, host: '0.0.0.0' });
    console.log('VYRO API Server running on port', process.env.PORT || 4000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

export { fastify };
