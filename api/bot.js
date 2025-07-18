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
