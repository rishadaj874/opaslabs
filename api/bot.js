const axios = require('axios');

const BOT_TOKEN = '8064189934:AAGeRa_SIje_gEq7frBtUSJ-NvL6coLLJdo';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(200).send('Bot is running');
  }

  try {
    const body = req.body;
    console.log('📩 New message:', JSON.stringify(body));

    const message = body.message || body.edited_message;
    if (!message) {
      return res.status(200).send('No message found');
    }

    const chatId = message.chat.id;
    const text = message.text || '';

    if (text === '/start') {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: `👋 Hello ${message.from.first_name || 'there'}!\nWelcome to Opas Labs! 🚀`
      });
    } else {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: `🤖 You said: ${text}`
      });
    }

    return res.status(200).send('OK');
  } catch (err) {
    console.error('❌ Bot Error:', err.message);
    return res.status(500).send('Bot Error');
  }
};
