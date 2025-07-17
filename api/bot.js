const axios = require('axios');

const BOT_TOKEN = '8064189934:AAGeRa_SIje_gEq7frBtUSJ-NvL6coLLJdo';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

module.exports = async (req, res) => {
  console.log('📩 Received request from Telegram');

  if (req.method !== 'POST') {
    return res.status(200).send('Bot is running');
  }

  try {
    const body = req.body;
    console.log('🧠 Message Body:', JSON.stringify(body));

    if (body.message && body.message.text === '/start') {
      const chatId = body.message.chat.id;
      const name = body.message.from.first_name || 'user';

      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: `👋 Hello ${name}, Opas Labs welcomes you again!`
      });

      console.log('✅ Message sent!');
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).send('Something went wrong');
  }
};
