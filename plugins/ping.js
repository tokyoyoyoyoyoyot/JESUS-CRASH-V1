const { cmd } = require('../command');
const os = require('os');

cmd({
  pattern: "ping",
  desc: "Check bot's speed and status.",
  category: "main",
  react: "🍂",
  filename: __filename
}, async (conn, mek, m, {
  from, pushname, reply
}) => {
  try {
    const start = Date.now();
    const msg = await conn.sendMessage(from, { text: `🍃 *Checking system response...*` });
    const ping = Date.now() - start;
    const uptime = formatUptime(process.uptime());
    const ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);

    const caption = `
*╭───❍ JESUS-CRASH-V1 STATUS ❍───╮*
│ 🧑‍💻 *User:* ${pushname || 'Unknown'}
│ ⚡ *Response:* ${ping} ms
│ ⏱ *Uptime:* ${uptime}
│ 💻 *Platform:* ${os.platform()} (${os.arch()})
│ 🔋 *RAM:* ${ram} MB
│ 👑 *Owner:* 𝐃𝐀𝐖𝐄𝐍𝐒 𝐁𝐎𝐘
*╰──────────────────────────────╯*

> _ᴘᴏᴡᴇʀᴇᴅ ʙʏ DAWENS BOY & INCONNU BOY_ 🤍
    `.trim();

    await conn.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/fuoqii.png' },
      caption,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363419768812867@newsletter',
          newsletterName: 'JESUS-CRASH-V1',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error('Ping error:', e);
    return reply(`❌ Error: ${e.message || e}`);
  }
});

function formatUptime(seconds) {
  const pad = (s) => (s < 10 ? '0' : '') + s;
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${pad(hrs)}h:${pad(mins)}m:${pad(secs)}s`;
}
