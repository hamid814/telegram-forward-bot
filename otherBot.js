const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TOHER_BOT_TOKEN);

bot.start((ctx) => ctx.reply('hello hamid!'));

bot.on('text', (ctx) => {
  console.log(ctx.message);

  ctx.reply('logged');
});

bot.launch();

console.log('here');
