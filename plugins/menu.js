const config = require('../config');
const os = require('os');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');

// Small caps function
function toSmallCaps(str) {
  const smallCaps = {
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ',
    I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ',
    Q: 'ǫ', R: 'ʀ', S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x',
    Y: 'ʏ', Z: 'ᴢ'
  };
  return str.toUpperCase().split('').map(c => smallCaps[c] || c).join('');
}

cmd({
  pattern: "menu",
  alias: ["allmenu", "jesus", "🖤"],
  desc: "Show all bot commands",
  category: "menu",
  react: "🖤",
  filename: __filename
}, async (conn, mek, m, { from, reply, isGroup }) => {
  try {
    const sender = m.sender || mek?.key?.participant || mek?.key?.remoteJid;

    if (config.MODE === "private" && isGroup && !config.OWNER_NUMBER.includes(sender.split('@')[0])) {
      return await reply("🚫 *Private Mode Active!*\nOnly the owner can use the bot in groups.");
    }

    const stages = [
      '⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜  0%',
      '🟩⬜⬜⬜⬜⬜⬜⬜⬜⬜  10%',
      '🟩🟩⬜⬜⬜⬜⬜⬜⬜⬜  25%',
      '🟩🟩🟩🟩⬜⬜⬜⬜⬜⬜  50%',
      '🟩🟩🟩🟩🟩🟩⬜⬜⬜⬜  75%',
      '🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩  100%'
    ];
    let loadingMsg = await conn.sendMessage(from, { text: `🖤 Loading...\n${stages[0]}` }, { quoted: mek });

    for (let i = 1; i < stages.length; i++) {
      await new Promise(r => setTimeout(r, 500));
      await conn.sendMessage(from, {
        edit: loadingMsg.key,
        text: `🖤 Loading...\n${stages[i]}`
      });
    }

    await new Promise(r => setTimeout(r, 500));
    await conn.sendMessage(from, {
      edit: loadingMsg.key,
      text: `✅ Loading complete! Preparing menu...`
    });

    const date = moment().tz("America/Port-au-Prince").format("dddd, DD MMMM YYYY");
    const uptime = () => {
      const sec = process.uptime();
      const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(1);
    const hostName = os.hostname();
    const totalCommands = commands.length;
    let usedPrefix = config.PREFIX || ".";

    let menuText = `
╔══════════════════════════╗
║ ⚡️🖤 𝐉𝐄𝐒𝐔𝐒-𝐂𝐑𝐀𝐒𝐇-𝐕𝟏 🖤⚡️ ║
╚══════════════════════════╝

👤 User      : @${sender.split("@")[0]}
⏱️ Uptime    : *${uptime()}*
⚙️ Mode      : ${config.MODE || "public"}
💠 Prefix    : [${usedPrefix}]
📦 Plugins   : *${totalCommands}*
🛠️ RAM       : *${ramUsage}MB / ${totalRam}MB*
🖥️ Host      : *${hostName}*
👑 Developer : 𝐃𝐀𝐖𝐄𝐍𝐒 𝐁𝐎𝐘🇭🇹
📆 Date      : *${date}*

────────────────────────────
✨ Welcome to *𝐉𝐄𝐒𝐔𝐒-𝐂𝐑𝐀𝐒𝐇-𝐕𝟏* ✨
🧠 Type *${usedPrefix}menu* to explore features.
⚔️ No mercy, just power. 🇭🇹
────────────────────────────
`;

    const categoryMap = {};
    for (let c of commands) {
      if (!c.category) continue;
      if (!categoryMap[c.category]) categoryMap[c.category] = [];
      categoryMap[c.category].push(c);
    }

    const keys = Object.keys(categoryMap).sort();

    for (let k of keys) {
      menuText += `\n\n⬛⫷ *${k.toUpperCase()} MENU* ⫸⬛`;
      const cmds = categoryMap[k].filter(c => c.pattern).sort((a, b) => a.pattern.localeCompare(b.pattern));
      cmds.forEach((cmd) => {
        const usage = cmd.pattern.split('|')[0];
        menuText += `\n⚔️ ${usedPrefix}${toSmallCaps(usage)}`;
      });
      menuText += `\n🕸️╌╌╌╌╌╌╌╌╌╌╌╌╌`;
    }

    menuText += `\n\n🔋 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐃𝐀𝐖𝐄𝐍𝐒 𝐁𝐎𝐘 🇭🇹`;

    const mediaOptions = [
      { type: 'video', url: 'https://files.catbox.moe/q9cbhm.mp4' },
      { type: 'video', url: 'https://files.catbox.moe/c7e8am.mp4' },
      { type: 'video', url: 'https://files.catbox.moe/t0gsrv.mp4' },
      { type: 'video', url: 'https://files.catbox.moe/m296z6.mp4' },
      { type: 'image', url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/fuoqii.png' }
    ];

    const selected = mediaOptions[Math.floor(Math.random() * mediaOptions.length)];

    const msgOptions = {
      caption: menuText,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: config.newsletterJid || '120363419768812867@newsletter',
          newsletterName: '𝗝𝗘𝗦𝗨𝗦-𝗖𝗥𝗔𝗦𝗛-𝐕𝟏',
          serverMessageId: 143
        }
      }
    };

    if (selected.type === 'video') {
      await conn.sendMessage(from, {
        video: { url: selected.url },
        ...msgOptions
      }, { quoted: mek });
    } else {
      await conn.sendMessage(from, {
        image: { url: selected.url },
        ...msgOptions
      }, { quoted: mek });
    }

    const audioOptions = [
      'https://files.catbox.moe/3cj1e3.mp4',
      'https://files.catbox.moe/vq3odo.mp4',
      'https://files.catbox.moe/fo2kz0.mp4',
      'https://files.catbox.moe/31os2j.mp4',
      'https://files.catbox.moe/2auhjw.mp4',
      'https://files.catbox.moe/czk8mu.mp4'
    ];

    const randomAudio = audioOptions[Math.floor(Math.random() * audioOptions.length)];

        try {
      await conn.sendMessage(from, {
        audio: { url: randomAudio },
        mimetype: 'audio/mp4',
        ptt: true
      }, { quoted: mek });
    } catch (e) {
      console.error('⚠️ Audio send failed:', e.message);
    }

  } catch (e) {
    console.error('❌ Menu error:', e.message);
    await reply(`❌ Menu Error: ${e.message}`);
  }
});
