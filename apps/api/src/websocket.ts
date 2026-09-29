const clients: Set<any> = new Set();

export function registerWebSocketClient(ws: any) {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
}

export function broadcastToManagers(data: Record<string, unknown>) {
  const message = JSON.stringify(data);
  clients.forEach((ws) => {
    try {
      if (ws.readyState === 1) ws.send(message);
    } catch {
      clients.delete(ws);
    }
  });
}
