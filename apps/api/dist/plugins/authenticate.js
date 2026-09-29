"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.decorate('authenticate', async function (req, reply) {
        try {
            await req.jwtVerify();
        }
        catch (err) {
            reply.status(401).send({ error: 'Unauthorized' });
        }
    });
});
