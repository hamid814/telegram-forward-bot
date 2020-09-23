const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const bot = new Telegraf(process.env.PIG_TOKEN);

bot.start((ctx) => ctx.reply('pig test bot'));

bot.command('test', (ctx) => {
  ctx.reply('test');
});

bot.launch();
