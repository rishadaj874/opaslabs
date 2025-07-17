import axios from 'axios';

const BOT_TOKEN = '8064189934:AAGeRa_SIje_gEq7frBtUSJ-NvL6coLLJdo';
const ADMIN_CHAT_ID = '7216371031';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('🤖 Bot is up and running!');
  }

  try {
    const body = req.body;

    // Handle basic /start command
    if (body.message && body.message.text === '/start') {
      const chatId = body.message.chat.id;
      const userName = body.message.from.first_name || 'User';

      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: `👋 Hello ${userName}, welcome to Opas Labs bot!`,
      });

      return res.status(200).send('Start message sent');
    }

    // Handle other messages (optional fallback)
    if (body.message && body.message.text) {
      const chatId = body.message.chat.id;

      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: `🤖 I received your message: "${body.message.text}"`,
      });

      return res.status(200).send('Message echoed');
    }

    res.status(200).send('No action taken');
  } catch (err) {
    console.error('❌ Bot error:', err?.response?.data || err.message);
    return res.status(500).send('Internal Bot Error');
  }
}
