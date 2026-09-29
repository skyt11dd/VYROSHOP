import { Telegraf, Markup } from 'telegraf';
import 'dotenv/config';

const MINI_APP_URL = process.env.MINI_APP_URL || 'https://mini.vyro.store';
const CRM_URL = process.env.CRM_URL || 'https://crm.vyro.store';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

// /start command with optional deep link payload
bot.start(async (ctx) => {
  const startPayload = ctx.startPayload;
  const firstName = ctx.from?.first_name || 'друже';

  let text = `👋 Вітаємо у *VYRO*, ${firstName}!\n\nВідкрийте наш магазин прямо в Telegram — без реєстрації, швидко і зручно.`;
  let url = MINI_APP_URL;

  if (startPayload?.startsWith('product_')) {
    const slug = startPayload.replace('product_', '');
    url = `${MINI_APP_URL}/product/${slug}`;
    text += `\n\n🛍 Переходимо до товару...`;
  } else if (startPayload?.startsWith('category_')) {
    const slug = startPayload.replace('category_', '');
    url = `${MINI_APP_URL}/category/${slug}`;
    text += `\n\n📁 Переходимо до категорії...`;
  }

  await ctx.reply(text, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.webApp('🛍 Відкрити магазин', url)],
    ]),
  });
});

// Main keyboard
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
  await ctx.reply('Відкрити магазин:', Markup.inlineKeyboard([
    [Markup.button.webApp('🛍 Відкрити', MINI_APP_URL)],
  ]));
});

bot.hears('📦 Мої замовлення', async (ctx) => {
  await ctx.reply('Переглянути замовлення:', Markup.inlineKeyboard([
    [Markup.button.webApp('📦 Мої замовлення', `${MINI_APP_URL}/orders`)],
  ]));
});

bot.hears('🔎 Пошук', async (ctx) => {
  await ctx.reply('Пошук товарів:', Markup.inlineKeyboard([
    [Markup.button.webApp('🔎 Пошук', `${MINI_APP_URL}/search`)],
  ]));
});

bot.hears('👤 Мій профіль', async (ctx) => {
  await ctx.reply('Мій профіль:', Markup.inlineKeyboard([
    [Markup.button.webApp('👤 Профіль', `${MINI_APP_URL}/profile`)],
  ]));
});

bot.hears('❓ Допомога', async (ctx) => {
  await ctx.reply(
    '❓ *Допомога*\n\nЯкщо у вас виникли питання:\n\n• Перегляньте наш FAQ\n• Напишіть нам у підтримку\n• Або просто натисніть кнопку нижче',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([[Markup.button.webApp('📞 Підтримка', MINI_APP_URL)]]),
    }
  );
});

// Handle inline button to open app
bot.on('message', async (ctx) => {
  const text = (ctx.message as any).text || '';
  if (!text.startsWith('/')) {
    await ctx.reply('Скористайтесь меню нижче або відкрийте магазин:', Markup.inlineKeyboard([
      [Markup.button.webApp('🛍 Відкрити магазин', MINI_APP_URL)],
    ]));
  }
});

bot.launch().then(() => {
  console.log('🤖 VYRO Telegram Bot started');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
