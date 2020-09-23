const { Telegraf } = require('telegraf');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const bot = new Telegraf(process.env.TOKEN);

const arr = [];

const appState = {
  text: 'default',
};

const textStates = {
  gettingFirstChannelId: {
    reply: 'first channel id saved!',
    func: (ctx) => {
      appData.firstChannelId = ctx.message.text;
    },
    nextState: 'default',
  },
  gettingSecondChannelId: {
    reply: 'second channel id saved!',
    func: (ctx) => {
      appData.seocndChannelId = ctx.message.text;
    },
    nextState: 'default',
  },
  gettingNumberOfMessages: {
    reply: 'number of messaegs saved!',
    func: (ctx) => {
      appData.numberOfMessages = Number(ctx.message.text);
    },
    nextState: 'default',
  },
};

const appData = {
  firstChannelId: '@mtproto_ir',
  seocndChannelId: '@mtproto_ir',
  dumpChannelId: '@cu_mium',
  numberOfMessages: 5500,
  time: 100,
};

function setTextState(state) {
  appState.text = state;
  console.log(state);
}

async function forwardAsCopy(context, i) {
  try {
    //forward to dump channel to get the message object
    const res = await context.telegram.forwardMessage(
      appData.dumpChannelId,
      appData.firstChannelId,
      i
    );

    const message = res;
    if (message.forward_date) {
      message.date = message.forward_date;
    }
    delete message.forward_from_message_id;
    delete message.forward_date;
    delete message.forward_from_chat;

    // try for forward as copy
    try {
      const res = await context.telegram.sendCopy(
        appData.seocndChannelId,
        message
      );

      console.log('sent to Dump and copied: ' + i);
    } catch (err) {
      console.log(`not sent as copy:  + ${i}`);

      console.log(err);
    }
  } catch (err) {
    if (
      err.response &&
      err.response.description === 'Bad Request: message to forward not found'
    ) {
      console.log('not found: ' + i);
    } else {
      console.log(err);
    }
  }
}

async function deleteMessageWithId(ctx, id) {
  try {
    await ctx.telegram.deleteMessage(appData.dumpChannelId, id);

    console.log('deleted' + id);
  } catch (err) {
    console.log('not deleted' + id);
  }
}

bot.start((ctx) => ctx.reply('this is forward bot'));

bot.command('test', async (ctx) => {
  // await ctx.telegram.forwardMessage('@mtproto_ir', '@cd_mium', 5490);

  // const res = await ctx.telegram.getChat(appData.firstChannelId);

  // console.log(res);

  // const res12 = await ctx.telegram.forwardMessage(
  //   appData.dumpChannelId,
  //   appData.firstChannelId,
  //   12
  // );

  // console.log(res12);

  // const res83 = await ctx.telegram.forwardMessage(
  //   appData.dumpChannelId,
  //   appData.firstChannelId,
  //   83
  // );

  // console.log(res83);

  // const res12 = await ctx.telegram.forwardMessage(
  //   appData.dumpChannelId,
  //   appData.firstChannelId,
  //   12
  // );

  // console.log(res12);

  // const res12 = await ctx.telegram.forwardMessage(
  //   appData.dumpChannelId,
  //   appData.firstChannelId,
  //   12
  // );

  // console.log(res12);

  // const res12 = await ctx.telegram.forwardMessage(
  //   appData.dumpChannelId,
  //   appData.firstChannelId,
  //   12
  // );

  // console.log(res12);

  // const res12 = await ctx.telegram.forwardMessage(
  //   appData.dumpChannelId,
  //   appData.firstChannelId,
  //   12
  // );

  // console.log(res12);

  // const res12 = await ctx.telegram.forwardMessage(
  //   appData.dumpChannelId,
  //   appData.firstChannelId,
  //   12
  // );

  // console.log(res12);

  // const res12 = await ctx.telegram.forwardMessage(
  //   appData.dumpChannelId,
  //   appData.firstChannelId,
  //   12
  // );

  // console.log(res12);

  ctx.reply('test reply');
});

bot.command('setfirstchannelid', (ctx) => {
  setTextState('gettingFirstChannelId');

  ctx.reply('send the id of first channel');
});

bot.command('setsecondchannelid', (ctx) => {
  setTextState('gettingSecondChannelId');

  ctx.reply('send the id of second channel');
});

bot.command('getdata', (ctx) => {
  ctx.reply(appData);
});

bot.command('cancel', (ctx) => {
  setTextState('default');

  ctx.reply('select a new command');
});

bot.command('forward', async (ctx) => {
  let i = 1;

  const context = ctx;

  async function sendMessage(context) {
    if (i < appData.numberOfMessages) {
      await forwardAsCopy(context, i);

      i++;

      setTimeout(() => {
        sendMessage(context);
      }, appData.time);
    } else {
      context.reply('forward completed');
    }
  }

  if (appData.firstChannelId && appData.seocndChannelId) {
    if (
      appData.firstChannelId.startsWith('@') &&
      appData.seocndChannelId.startsWith('@')
    ) {
      sendMessage(context);
    } else {
      ctx.reply('please provide valid ids');
    }
  } else {
    ctx.reply('please provide ids');
  }

  ctx.reply('forwarding...');
});

bot.command('startsendingmessagestream', (ctx) => {
  setTextState('sendingMessage');

  ctx.reply('sending message to ' + appData.firstChannelId);
});

bot.command('cancel', (ctx) => {
  ctx.reply('bot back to default state');

  setTextState('default');
});

bot.command('deletedump', (ctx) => {
  let i = 0;

  const context = ctx;

  async function deleteit(context) {
    if (i < appData.numberOfMessages) {
      await deleteMessageWithId(context, i);

      i++;

      setTimeout(() => {
        deleteit(context);
      }, appData.time);
    }
  }

  deleteit(context);

  ctx.reply('deleting...');
});

bot.command('setnumberofmessages', (ctx) => {
  setTextState('gettingNumberOfMessages');

  ctx.reply('say number of messages');
});

bot.on('text', (ctx) => {
  console.log('text recived');
  if (textStates[appState.text]) {
    ctx.reply(textStates[appState.text].reply);

    textStates[appState.text].func(ctx);

    setTextState(textStates[appState.text].nextState);
  }

  if (ctx.message.text.startsWith('setTime:')) {
    const timeNumber = ctx.message.text.split(':')[1];

    appData.time = Number(timeNumber);

    ctx.reply('time changed');
  }

  if (appState.text === 'sendingMessage') {
    ctx.telegram.sendMessage(appData.firstChannelId, ctx.message.text);

    ctx.reply('sent!');
  }
});

bot.launch();
