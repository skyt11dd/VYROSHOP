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
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.railway.app') ||
      origin.endsWith('.up.railway.app') ||
      origin.endsWith('.vercel.app')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS: ' + origin), false);
    }
  },
  credentials: true,
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'fallback_secret_change_me',
});

import authenticatePlugin from './plugins/authenticate';
fastify.register(authenticatePlugin);

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

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { prisma } from '@vyro/database';

async function initDatabase() {
  if (!process.env.DATABASE_URL) {
    console.log('[DB] No DATABASE_URL provided, skipping auto-migration.');
    return;
  }

  // Find schema.prisma path
  const candidates = [
    path.resolve(__dirname, '../../../packages/database/prisma/schema.prisma'),
    path.resolve(process.cwd(), 'packages/database/prisma/schema.prisma'),
    path.resolve(process.cwd(), '../../packages/database/prisma/schema.prisma'),
    path.resolve(process.cwd(), '../packages/database/prisma/schema.prisma'),
  ];
  const schemaPath = candidates.find((p) => fs.existsSync(p));

  if (schemaPath) {
    try {
      console.log(`[DB] Pushing database schema from ${schemaPath}...`);
      execSync(`npx prisma db push --schema="${schemaPath}" --skip-generate --accept-data-loss`, {
        stdio: 'inherit',
        env: { ...process.env },
      });
      console.log('[DB] Schema pushed successfully.');
    } catch (err) {
      console.error('[DB] Schema push error (continuing):', err);
    }
  } else {
    console.warn('[DB] schema.prisma not found in candidates, skipping db push');
  }

  // Seed default admin manager if not exists
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@vyro.store';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
      console.log(`[DB] Created default admin account: ${adminEmail} (role: ADMIN)`);
    } else {
      console.log(`[DB] Admin account exists: ${existingAdmin.email}`);
    }
  } catch (err) {
    console.error('[DB] Admin seed error (continuing):', err);
  }
}

const start = async () => {
  try {
    await initDatabase();
    await fastify.listen({ port: Number(process.env.PORT) || 4000, host: '0.0.0.0' });
    console.log('VYRO API Server running on port', process.env.PORT || 4000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

export { fastify };

