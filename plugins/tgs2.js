// Plugin tgs2.js — Convert Telegram animated stickers to WhatsApp
const axios = require('axios');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');
const FormData = require('form-data');

cmd({
  pattern: 'tgs2',
  alias: ['tgsvideo'],
  desc: 'Convert Telegram animated sticker to WhatsApp sticker',
  category: 'spam',
  filename: __filename
}, async (conn, mek, m, { reply, args }) => {
  try {
    if (!args[0]) return reply('📎 *Send Telegram sticker link!*\nEx: .tgs2 https://t.me/addstickers/Bbcxzsd_by_S7_5BOT');

    const link = args[0];
    const name = link.split('/addstickers/')[1];
    if (!name) return reply('❌ Invalid sticker link.');

    // Get Telegram sticker pack info
    const api = `https://api.telegram.org/bot7025486524:AAGNJ3lMa8610p7OAIycwLtNmF9vG8GfboM/getStickerSet?name=${name}`;
    const res = await axios.get(api);
    const stickerList = res.data.result.stickers;

    if (!stickerList || stickerList.length === 0) return reply('❌ Sticker pack empty.');

    reply(`🔄 Converting *${stickerList.length}* animated stickers...\nPack: *𝐒𝐇𝐎𝐓𝐓𝐀𓅓𝐆𝐎𝐃𒋲𝐒𝐓𝐈𝐋𝐄𝐒𒋲𝗩𝗢𝗜𝗗 —͟͟͞͞𖣘 𒋲𝐃𝐀𝐖𝐄𝐍𝐒ᵈᵉᵐᵒⁿˢ𒋲 𓄂*`);

    // Process each sticker
    for (let i = 0; i < Math.min(stickerList.length, 90); i++) { // limit to 90 to avoid spam
      const fileId = stickerList[i].file_id;
      const fileInfo = await axios.get(`https://api.telegram.org/bot7025486524:AAGNJ3lMa8610p7OAIycwLtNmF9vG8GfboM/getFile?file_id=${fileId}`);
      const filePath = fileInfo.data.result.file_path;
      const fileUrl = `https://api.telegram.org/file/bot7025486524:AAGNJ3lMa8610p7OAIycwLtNmF9vG8GfboM/${filePath}`;

      const tgsName = `sticker_${i}.tgs`;
      const webpName = `sticker_${i}.webp`;

      fs.writeFileSync(tgsName, (await axios.get(fileUrl, { responseType: 'arraybuffer' })).data);

      // Convert .tgs to .webp using lottie-web or dotLottie + ffmpeg (simplified)
      execSync(`npx lottie-to-webp ${tgsName} -o ${webpName} --fps 30 --quality 80`);

      // Send as animated sticker
      await conn.sendMessage(m.chat, {
        sticker: fs.readFileSync(webpName)
      }, { quoted: mek });

      // Clean up
      fs.unlinkSync(tgsName);
      fs.unlinkSync(webpName);
    }

    reply('✅ Conversion complete!');

  } catch (e) {
    console.error(e);
    reply('❌ Error while converting sticker.');
  }
});
