const axios = require('axios');

const BOT_TOKEN = '8064189934:AAGeRa_SIje_gEq7frBtUSJ-NvL6coLLJdo';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(200).send('Bot is up');
  }

  try {
    const message = req.body.message;
    if (message && message.text === '/start') {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: message.chat.id,
        text: `👋 Hello ${message.from.first_name}, welcome to Opas Labs!`,
      });
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Bot crashed');
  }
};
