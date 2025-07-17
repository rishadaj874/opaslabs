import axios from 'axios';

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN_API}`;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('Bot is running...');
  }

  try {
    const body = req.body;

    // Check if this is a /start message
    if (body.message && body.message.text === '/start') {
      const chatId = body.message.chat.id;
      const firstName = body.message.from.first_name || 'there';

      const welcomeMessage = `👋 Hello ${firstName}! Welcome to Opas Labs Bot.`;

      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: welcomeMessage,
      });

      return res.status(200).send('OK');
    }

    // Handle other messages here if needed
    return res.status(200).send('No action for this message');
  } catch (error) {
    console.error('❌ BOT ERROR:', error?.response?.data || error.message);
    return res.status(500).send('Internal Server Error');
  }
}
