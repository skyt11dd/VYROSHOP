"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerWebSocketClient = registerWebSocketClient;
exports.broadcastToManagers = broadcastToManagers;
const clients = new Set();
function registerWebSocketClient(ws) {
    clients.add(ws);
    ws.on('close', () => clients.delete(ws));
}
function broadcastToManagers(data) {
    const message = JSON.stringify(data);
    clients.forEach((ws) => {
        try {
            if (ws.readyState === 1)
                ws.send(message);
        }
        catch {
            clients.delete(ws);
        }
    });
}
