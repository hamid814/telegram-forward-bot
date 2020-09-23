const express = require('express');
const axios = require('axios');
const colors = require('colors');

const app = express();

app.use(express.json({ extended: false }));

app.get('/webhook', (req, res) => {
  console.log(req);
});

app.post('/webhook', async (req, res, next) => {
  // console.log(req.body);

  try {
    const forwarded = await axios.get(
      `https://api.telegram.org/botTOKEN/forwardMessage?chat_id=@hamid_dump&from_chat_id=${req.body.message.chat.id}&message_id=${req.body.message.message_id}`
    );

    res.status(200).send('forwarded');

    console.log(' sent '.magenta.inverse);

    console.log(forwarded.data);

    next();
  } catch (err) {
    console.log(' err '.red.inverse);

    res.status(200).send('not forwarded');

    // console.log(err);

    next();
  }
});

app.listen(8080, () => console.log('running 8080'));
