const { cmd } = require('../command');

cmd({
  pattern: "bugmenu",
  category: "menu",
  desc: "Show BUG MENU commands list with a random video",
  filename: __filename,
  react: "⚠️"
}, async (conn, m, { reply }) => {
  try {
    const bugMenuText = `
╭───〔 *BUG MENU* 〕───⬣
│
├ 📂 .dawens-xy <number>
│   └ 🧨 Fast text spam
│
├ 📂 .jesus-ios <number>
│   └ 👻 iOS WhatsApp crash
│
├ 📂 .jesus-crash <number>
│   └ 🧧 Media crash effect
│
├ 📂 .jesus-bug <number>
│   └ 📱 Android crash with view-once
│
├ 📂 .xkiller-ui <number>
│   └ 🧠 UI bug (Android/WhatsApp)
│
├ 📂 .pairspam <number>
│   └ 📎 Malicious document spam
│
├ 📂 .jesus-x-dawens <number>
│   └ 📄 PDF crash bug
│
├ 📂 .xdave <number>
│   └ 🇻🇳 Vietnamese iOS bug
│
╰────────────⬣
*⚠️ Use with caution. Do not abuse.*
    `.trim();

    const videos = [
      { url: 'https://files.catbox.moe/m296z6.mp4' },
      { url: 'https://files.catbox.moe/c7e8am.mp4' },
      { url: 'https://files.catbox.moe/q9cbhm.mp4' }
    ];

    const randomVideo = videos[Math.floor(Math.random() * videos.length)];

    await conn.sendMessage(m.chat, {
      video: { url: randomVideo.url },
      caption: bugMenuText,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363419768812867@newsletter',
          newsletterName: 'JESUS-CRASH-V1',
          serverMessageId: 143
        }
      },
      quoted: m
    });

  } catch (error) {
    console.error("Error sending bug menu video:", error);
    await reply("❌ Sorry, something went wrong while sending the bug menu video.");
  }
});
