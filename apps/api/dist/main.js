"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastify = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
require("dotenv/config");
const public_1 = require("./routes/public");
const auth_1 = require("./routes/auth");
const crm_1 = require("./routes/crm");
const customer_1 = require("./routes/customer");
const telegram_1 = require("./routes/telegram");
const websocket_2 = require("./websocket");
const fastify = (0, fastify_1.default)({ logger: true });
exports.fastify = fastify;
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://vyro.store',
    'https://www.vyro.store',
    'https://crm.vyro.store',
];
fastify.register(cors_1.default, {
    origin: (origin, cb) => {
        if (!origin ||
            allowedOrigins.includes(origin) ||
            origin.endsWith('.railway.app') ||
            origin.endsWith('.up.railway.app') ||
            origin.endsWith('.vercel.app')) {
            cb(null, true);
        }
        else {
            cb(new Error('Not allowed by CORS: ' + origin), false);
        }
    },
    credentials: true,
});
fastify.register(jwt_1.default, {
    secret: process.env.JWT_SECRET || 'fallback_secret_change_me',
});
const authenticate_1 = __importDefault(require("./plugins/authenticate"));
fastify.register(authenticate_1.default);
fastify.register(websocket_1.default);
// Initialize Telegram Bot
const telegram_2 = require("./telegram");
(0, telegram_2.initBot)();
// Health check
fastify.get('/api/health', async () => {
    return { status: 'ok', service: 'vyro-api', timestamp: new Date().toISOString() };
});
fastify.register(public_1.publicRoutes, { prefix: '/api/public' });
fastify.register(auth_1.authRoutes, { prefix: '/api/auth' });
fastify.register(crm_1.crmRoutes, { prefix: '/api/crm' });
fastify.register(customer_1.customerRoutes, { prefix: '/api/customer' });
fastify.register(telegram_1.telegramRoutes, { prefix: '/api/telegram' });
// Realtime WebSocket for CRM
fastify.get('/api/realtime', { websocket: true }, (connection) => {
    (0, websocket_2.registerWebSocketClient)(connection.socket);
    connection.socket.send(JSON.stringify({ type: 'CONNECTED', message: 'VYRO Realtime connected' }));
});
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("@vyro/database");
async function initDatabase() {
    if (!process.env.DATABASE_URL) {
        console.log('[DB] No DATABASE_URL provided, skipping auto-migration.');
        return;
    }
    // Find schema.prisma path
    const candidates = [
        path_1.default.resolve(__dirname, '../../../packages/database/prisma/schema.prisma'),
        path_1.default.resolve(process.cwd(), 'packages/database/prisma/schema.prisma'),
        path_1.default.resolve(process.cwd(), '../../packages/database/prisma/schema.prisma'),
        path_1.default.resolve(process.cwd(), '../packages/database/prisma/schema.prisma'),
    ];
    const schemaPath = candidates.find((p) => fs_1.default.existsSync(p));
    if (schemaPath) {
        try {
            console.log(`[DB] Pushing database schema from ${schemaPath}...`);
            (0, child_process_1.execSync)(`npx prisma db push --schema="${schemaPath}" --skip-generate --accept-data-loss`, {
                stdio: 'inherit',
                env: { ...process.env },
            });
            console.log('[DB] Schema pushed successfully.');
        }
        catch (err) {
            console.error('[DB] Schema push error (continuing):', err);
        }
    }
    else {
        console.warn('[DB] schema.prisma not found in candidates, skipping db push');
    }
    // Seed default admin manager if not exists
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@vyro.store';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
        const existingAdmin = await database_1.prisma.user.findFirst({
            where: { role: 'ADMIN' },
        });
        if (!existingAdmin) {
            const hashedPassword = await bcryptjs_1.default.hash(adminPassword, 10);
            await database_1.prisma.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'ADMIN',
                },
            });
            console.log(`[DB] Created default admin account: ${adminEmail} (role: ADMIN)`);
        }
        else {
            console.log(`[DB] Admin account exists: ${existingAdmin.email}`);
        }
    }
    catch (err) {
        console.error('[DB] Admin seed error (continuing):', err);
    }
}
const start = async () => {
    try {
        await initDatabase();
        await fastify.listen({ port: Number(process.env.PORT) || 4000, host: '0.0.0.0' });
        console.log('VYRO API Server running on port', process.env.PORT || 4000);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
