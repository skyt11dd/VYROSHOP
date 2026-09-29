import { Telegraf, Markup } from 'telegraf';

const MINI_APP_URL = process.env.MINI_APP_URL || 'https://mini.vyro.store';

let bot: Telegraf | null = null;

export function initBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn('⚠️ TELEGRAM_BOT_TOKEN not found, bot will not start');
    return;
  }

  bot = new Telegraf(token);

  bot.start(async (ctx) => {
    const startPayload = ctx.startPayload;
    const firstName = ctx.from?.first_name || 'друже';

    let text = `👋 Вітаємо у *VYRO*, ${firstName}!\n\nВідкрийте наш магазин прямо в Telegram — без реєстрації, швидко і зручно.`;
    let url = MINI_APP_URL;

    if (startPayload?.startsWith('product_')) {
      const slug = startPayload.replace('product_', '');
      url = `${MINI_APP_URL}/product/${slug}`;
      text += `\n\n🛍 Переходимо до товару...`;
    }

    await ctx.reply(text, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([[Markup.button.webApp('🛍 Відкрити магазин', url)]]),
    });
  });

  bot.command('menu', async (ctx) => {
    await ctx.reply('Оберіть дію:', {
      ...Markup.keyboard([
        ['🛍 Магазин', '🔎 Пошук'],
        ['📦 Мої замовлення', '👤 Мій профіль'],
        ['❓ Допомога'],
      ]).resize(),
    });
  });

  bot.hears('🛍 Магазин', async (ctx) => {
    await ctx.reply('Відкрити магазин:', Markup.inlineKeyboard([[Markup.button.webApp('🛍 Відкрити', MINI_APP_URL)]]));
  });

  bot.on('message', async (ctx) => {
    const text = (ctx.message as any).text || '';
    if (!text.startsWith('/')) {
      await ctx.reply('Скористайтесь меню нижче або відкрийте магазин:', Markup.inlineKeyboard([[Markup.button.webApp('🛍 Відкрити магазин', MINI_APP_URL)]]));
    }
  });

  bot.launch().then(() => console.log('🤖 VYRO Telegram Bot started inside API'));

  process.once('SIGINT', () => bot?.stop('SIGINT'));
  process.once('SIGTERM', () => bot?.stop('SIGTERM'));
}

export async function sendTelegramNotification(order: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!token || !chatId) return;

  const items = order.items?.map((i: any) => `• ${i.product?.name} ×${i.quantity}`).join('\n') || '';
  const text = `🔔 *НОВЕ ЗАМОВЛЕННЯ*\n\n#${order.orderNumber}\n\n👤 *Клієнт:*\n${order.customerName}\n\n📱 *Джерело:*\n${order.source}\n\n🛒 *Товари:*\n${items}\n\n💰 *Сума:*\n${order.totalAmount} ₴\n\n📌 *Статус:*\nНове`;
  
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
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
