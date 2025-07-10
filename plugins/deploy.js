const { cmd } = require('../command');
const { File } = require('megajs');
const { default: makeWASocket } = require('@whiskeysockets/baileys');

global.jadibotSessions = global.jadibotSessions || {};

cmd({
  pattern: 'deploy',
  desc: '🚀 Deploy WhatsApp session via MEGA backup.',
  category: 'spam',
  react: '🪛',
  filename: __filename
}, async (conn, m, { text }) => {
  if (!text) return m.reply('❌ *Please provide a MEGA Session ID!*\nExample:\n.deploy JESUS~CRASH~V1~<file_id>#<file_key>');

  const input = text.trim();
  const prefix = "JESUS~CRASH~V1~";

  if (!input.startsWith(prefix)) {
    return m.reply('❌ *Invalid session format.* Use:\n.deploy JESUS~CRASH~V1~<file_id>#<file_key>');
  }

  const sessionPart = input.slice(prefix.length);
  const splitIndex = sessionPart.indexOf('#');
  if (splitIndex === -1) {
    return m.reply('❌ *Invalid session format.* Missing # separator.');
  }

  const fileId = sessionPart.slice(0, splitIndex);
  const fileKey = sessionPart.slice(splitIndex + 1);

  if (!fileId || !fileKey) {
    return m.reply('❌ *Invalid session format.* File ID or File Key missing.');
  }

  if (global.jadibotSessions[fileId]) return m.reply('⚠️ *Session already active.*');
  if (Object.keys(global.jadibotSessions).length >= 5) return m.reply('⚠️ *Limit reached (max 5 sessions).*');

  try {
    m.reply(`📥 *Fetching session...* ID: ${fileId}`);

    const sessionFile = File.fromURL(`https://mega.nz/#!${fileId}!${fileKey}`);
    const stream = await sessionFile.download();

    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const sessionJson = JSON.parse(Buffer.concat(chunks).toString());

    if (!sessionJson.creds || typeof sessionJson.creds !== 'object') {
      return m.reply('❌ *Invalid session JSON: missing or malformed creds.*');
    }

    const sock = makeWASocket({
      auth: {
        creds: sessionJson.creds,
        keys: sessionJson.keys || {}
      },
      printQRInTerminal: false,
      browser: ['Jesus-Crash-Deploy', 'Firefox', '121.0.0']
    });

    global.jadibotSessions[fileId] = sock;
    m.reply('⏳ *Connecting session... please wait*');

    sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
      if (connection === 'open') {
        m.reply(`✅ *Session \`${fileId}\` connected successfully!*`);
        console.log(`✅ [CONNECTED] ${fileId}`);
      } else if (connection === 'close') {
        delete global.jadibotSessions[fileId];
        const reason = lastDisconnect?.error?.output?.statusCode || 'Unknown';
        console.log(`❌ [DISCONNECTED] ${fileId} | Reason: ${reason}`);
      }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
      const msg = messages[0];
      if (!msg?.message) return;

      const from = msg.key.remoteJid;
      const isGroup = from.endsWith('@g.us');
      const sender = isGroup ? msg.key.participant : from;
      const content = msg.message.conversation || msg.message.extendedTextMessage?.text;

      if (content?.toLowerCase() === 'ping') {
        await sock.sendMessage(from, {
          text: `🏓 *Pong!* \nHello <@${sender.split('@')[0]}> 👋`,
          mentions: [sender]
        }, { quoted: msg });
      }
    });

  } catch (err) {
    console.error(`[DEPLOY ERROR]`, err);
    m.reply(`❌ *Deployment failed:*\n${err.message || err}`);
  }
});
