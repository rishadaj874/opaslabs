import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config(); // Load .env

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN_API;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

const policeRequests = new Map(); // stores verification state

export default async function handler(req, res) {
  if (req.method === 'GET') return res.status(200).send('🟢 Bot is alive!');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const body = req.body;
  const message = body.message || body.callback_query?.message;
  const chatId = message?.chat?.id;
  const text = message?.text;
  const callbackQuery = body.callback_query;
  const photo = message?.photo;

  try {
    // /start
    if (text === '/start') {
      await sendWelcomeWithButtons(chatId);
      return res.status(200).send('OK');
    }

    // Police Enquiry Button
    if (callbackQuery?.data === 'police') {
      await sendMessageNoMarkdown(
        callbackQuery.message.chat.id,
        `🛂 Police Verification Required\n\n📸 Please send a clear photo of your Police ID.\nOur admin will verify and give you access to confidential resources.`
      );
      await answerCallback(callbackQuery.id);
      return res.status(200).send('OK');
    }

    // Fishing Button
    if (callbackQuery?.data === 'fishing') {
      const userId = callbackQuery.message.chat.id.toString();
      const isAdmin = userId === ADMIN_CHAT_ID;

      if (isAdmin) {
        const spoilerLink = '||https://heavenscake\\.vercel\\.app/page\\.html||';
        const message = `🎣 Fishing Link \\(Private\\)\n🔗 ${spoilerLink}`;
        await sendSpoilerMessage(userId, message);
      } else {
        await sendMessageNoMarkdown(
          userId,
          `💡 Note:\n"This feature is made for admins for educational purposes only.\nIt is not meant for public use and may lead to misuse."`
        );
      }

      await answerCallback(callbackQuery.id);
      return res.status(200).send('OK');
    }

    // Police ID photo
    if (photo && chatId.toString() !== ADMIN_CHAT_ID) {
      const fileId = photo[photo.length - 1].file_id;
      policeRequests.set(chatId, { verified: false });

      const caption = `📸 Police ID Submitted\nFrom: [User ID: ${chatId}]`;

      await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: ADMIN_CHAT_ID,
          photo: fileId,
          caption,
          reply_markup: {
            inline_keyboard: [
              [
                { text: `✅ Verify [${chatId}]`, callback_data: `verify_${chatId}` },
                { text: `❌ Deny [${chatId}]`, callback_data: `deny_${chatId}` }
              ]
            ]
          }
        })
      });

      await sendMessageNoMarkdown(chatId, `📤 Your ID has been received.\n🕵️‍♂️ It is under verification. Please wait.`);
      return res.status(200).send('OK');
    }

    // Admin verifies or denies
    if (callbackQuery && callbackQuery.message.chat.id.toString() === ADMIN_CHAT_ID) {
      const data = callbackQuery.data;

      if (data.startsWith('verify_')) {
        const targetId = data.split('_')[1];
        policeRequests.set(Number(targetId), { verified: true });

        await sendMessageNoMarkdown(
          targetId,
          `✅ You have been verified as a police officer.\n\n📞 Contact the admin directly: @mohdrishad\n📱 Phone: +918157088697`
        );

        await sendMessageNoMarkdown(ADMIN_CHAT_ID, `✅ Verified police ID: ${targetId}`);
      }

      if (data.startsWith('deny_')) {
        const targetId = data.split('_')[1];
        policeRequests.delete(Number(targetId));

        await sendMessageNoMarkdown(targetId, `❌ Your police ID verification was denied. You can try again if needed.`);
        await sendMessageNoMarkdown(ADMIN_CHAT_ID, `❌ Denied police ID: ${targetId}`);
      }

      await answerCallback(callbackQuery.id);
      return res.status(200).send('OK');
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('❌ Bot Error:', err);
    res.status(500).send('Internal Server Error');
  }
}

// 🟢 Welcome with buttons
async function sendWelcomeWithButtons(chatId) {
  await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: `👋 Welcome to Tecky Rishad Bot!\n\nChoose an option below:\n\n💬 <i>Note:</i>\n"Some features of this bot are made for admins for educational purposes only. They are restricted from public use to avoid misuse."`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '✨ Join Our Community', url: 'https://t.me/r1shaad' }],
          [{ text: '🎣 Let’s Fish', callback_data: 'fishing' }],
          [{ text: '🚨 Police Enquiry', callback_data: 'police' }]
        ]
      }
    })
  });
}

// 📨 Send plain text
async function sendMessageNoMarkdown(chatId, message) {
  return fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message })
  });
}

// 🕵️ Spoiler message (MarkdownV2)
async function sendSpoilerMessage(chatId, message) {
  return fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'MarkdownV2'
    })
  });
}

// ✅ Acknowledge button press
async function answerCallback(callbackQueryId) {
  return fetch(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackQueryId })
  });
}
