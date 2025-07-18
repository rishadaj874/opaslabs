const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('8064189934:AAGeRa_SIje_gEq7frBtUSJ-NvL6coLLJdo', { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const welcomeMessage = `👋 Hello ${msg.from.first_name || 'there'}!\n\n` +
    `Welcome to our Telegram Bot 🤖\n` +
    `I'm here to assist you with anything you need.\n\n` +
    `✅ Use the menu or type a command to get started.\n` +
    `📩 Need help? Just type /help anytime.\n\n` +
    `Let's make things happen! 🚀`;
// Code by @Teleservice_Assistant_bot
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const TELEGRAM_BOT_TOKEN = '8064189934:AAGeRa_SIje_gEq7frBtUSJ-NvL6coLLJdo'; // Your bot token
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`; // API URL

app.use(bodyParser.json());

// Start command handler
app.post('/webhook', async (req, res) => {
    const message = req.body.message;

    if (message && message.text) {
        const chatId = message.chat.id;
        const text = message.text;

        // Check if the message is a /start command
        if (text === '/start') {
            const welcomeMessage = `👋 Welcome to the bot, ${message.from.first_name}! \n\nChoose an option below to continue.`;
            await sendMessage(chatId, welcomeMessage);
        }
    }

    res.sendStatus(200); // Respond to Telegram that the message was received
});

// Function to send a message
async function sendMessage(chatId, message) {
    await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        })
    });
}

// Set webhook
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
  const options = {
    reply_markup: {
      keyboard: [
        ['📜 Help', 'ℹ️ About'],
        ['⚙️ Settings', '❓ FAQ']
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  };

  bot.sendMessage(chatId, welcomeMessage, options);
});
