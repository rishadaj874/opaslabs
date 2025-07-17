import axios from 'axios';

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN_API}`;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const body = req.body;
  const message = body.message || body.callback_query?.message;
  const chatId = message?.chat?.id;
  const text = body.message?.text;

  if (!chatId) {
    return res.status(200).send('No chat ID');
  }

  try {
    // Handle /start command
    if (text === '/start') {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: '👋 Welcome to Opas Labs Bot!',
      });

      return res.status(200).send('OK');
    }

    // Optional: forward unknown messages to admin
    if (ADMIN_CHAT_ID && chatId !== ADMIN_CHAT_ID) {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: ADMIN_CHAT_ID,
        text: `📩 Message from ${chatId}: ${text || '[No text]'}`,
      });
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('Telegram API error:', error.message);
    return res.status(500).send('Bot handler failed');
  }
}
