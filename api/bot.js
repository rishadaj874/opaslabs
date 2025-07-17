const axios = require('axios');

const BOT_TOKEN = '8064189934:AAGeRa_SIje_gEq7frBtUSJ-NvL6coLLJdo'; // Replace with your token
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(200).send('Opas Bot is Running 🚀');
  }

  try {
    const message = req.body.message || req.body.edited_message;

    if (!message) {
      return res.status(200).send('No message to process');
    }

    const chatId = message.chat.id;
    const text = message.text || '';

    // Fallback for non-text messages
    if (!text) {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: '⚠️ Please send a text message.'
      });
      return res.status(200).send('OK');
    }

    // Reply to /start
    if (text === '/start') {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: `👋 Hello ${message.from.first_name || 'there'}!\nWelcome to Opas Labs! 🚀`
      });
      return res.status(200).send('OK');
    }

    // Reply to other messages
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: `🤖 You said: ${text}`
    });

    return res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Bot Error:', error.message);
    return res.status(500).send('Internal Server Error');
  }
};
