"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const database_1 = require("@vyro/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function authRoutes(fastify) {
    // Customer register
    fastify.post('/customer/register', async (req, reply) => {
        const { email, password, firstName, lastName, phone } = req.body;
        if (!email || !password)
            return reply.status(400).send({ error: 'Email and password required' });
        const existing = await database_1.prisma.customer.findUnique({ where: { email } });
        if (existing)
            return reply.status(409).send({ error: 'Email already in use' });
        const hashed = await bcryptjs_1.default.hash(password, 12);
        const customer = await database_1.prisma.customer.create({
            data: { email, password: hashed, firstName, lastName, phone },
        });
        const token = fastify.jwt.sign({ id: customer.id, role: 'customer' }, { expiresIn: '7d' });
        const refreshToken = fastify.jwt.sign({ id: customer.id, role: 'customer', type: 'refresh' }, { expiresIn: '30d' });
        return { token, refreshToken, customer: { id: customer.id, email: customer.email, firstName: customer.firstName, lastName: customer.lastName } };
    });
    // Customer login
    fastify.post('/customer/login', async (req, reply) => {
        const { email, password } = req.body;
        const customer = await database_1.prisma.customer.findUnique({ where: { email } });
        if (!customer || !customer.password)
            return reply.status(401).send({ error: 'Invalid credentials' });
        const valid = await bcryptjs_1.default.compare(password, customer.password);
        if (!valid)
            return reply.status(401).send({ error: 'Invalid credentials' });
        await database_1.prisma.customer.update({ where: { id: customer.id }, data: { lastActivityAt: new Date() } });
        const token = fastify.jwt.sign({ id: customer.id, role: 'customer' }, { expiresIn: '7d' });
        const refreshToken = fastify.jwt.sign({ id: customer.id, role: 'customer', type: 'refresh' }, { expiresIn: '30d' });
        return { token, refreshToken, customer: { id: customer.id, email: customer.email, firstName: customer.firstName, lastName: customer.lastName } };
    });
    // Manager login (CRM)
    fastify.post('/manager/login', async (req, reply) => {
        const { email, password } = req.body;
        const manager = await database_1.prisma.user.findUnique({ where: { email } });
        if (!manager)
            return reply.status(401).send({ error: 'Invalid credentials' });
        const valid = await bcryptjs_1.default.compare(password, manager.password);
        if (!valid)
            return reply.status(401).send({ error: 'Invalid credentials' });
        const token = fastify.jwt.sign({ id: manager.id, role: manager.role }, { expiresIn: '8h' });
        const refreshToken = fastify.jwt.sign({ id: manager.id, role: manager.role, type: 'refresh' }, { expiresIn: '7d' });
        return { token, refreshToken, manager: { id: manager.id, email: manager.email, role: manager.role } };
    });
    // Refresh token
    fastify.post('/refresh', async (req, reply) => {
        const { refreshToken } = req.body;
        try {
            const decoded = fastify.jwt.verify(refreshToken);
            if (decoded.type !== 'refresh')
                return reply.status(401).send({ error: 'Invalid token' });
            const newToken = fastify.jwt.sign({ id: decoded.id, role: decoded.role }, { expiresIn: decoded.role === 'customer' ? '7d' : '8h' });
            return { token: newToken };
        }
        catch {
            return reply.status(401).send({ error: 'Invalid or expired token' });
        }
    });
    // Get current user (customer)
    fastify.get('/customer/me', { preHandler: [fastify.authenticate] }, async (req, reply) => {
        const user = req.user;
        if (user.role !== 'customer')
            return reply.status(403).send({ error: 'Forbidden' });
        const customer = await database_1.prisma.customer.findUnique({ where: { id: user.id } });
        if (!customer)
            return reply.status(404).send({ error: 'Not found' });
        return { customer };
    });
    // Get current manager
    fastify.get('/manager/me', { preHandler: [fastify.authenticate] }, async (req, reply) => {
        const user = req.user;
        if (!['ADMIN', 'MANAGER'].includes(user.role))
            return reply.status(403).send({ error: 'Forbidden' });
        const manager = await database_1.prisma.user.findUnique({ where: { id: user.id }, select: { id: true, email: true, role: true, createdAt: true } });
        if (!manager)
            return reply.status(404).send({ error: 'Not found' });
        return { manager };
    });
}
