export async function sendTelegramNotification(order: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token || !chatId) return;

  const items = order.items?.map((i: any) => `• ${i.product?.name} ×${i.quantity}`).join('\n') || '';

  const text = `🔔 *НОВЕ ЗАМОВЛЕННЯ*\n\n#${order.orderNumber}\n\n👤 *Клієнт:*\n${order.customerName}\n\n📱 *Джерело:*\n${order.source}\n\n🛒 *Товари:*\n${items}\n\n💰 *Сума:*\n${order.totalAmount} ₴\n\n📌 *Статус:*\nНове`;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[{ text: '📂 Відкрити CRM', url: `${process.env.CRM_URL || 'https://crm.vyro.store'}/orders/${order.id}` }]],
        },
      }),
    });
  } catch (e) {
    console.error('Telegram notification error:', e);
  }
}
