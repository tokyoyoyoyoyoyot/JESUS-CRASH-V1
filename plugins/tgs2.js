// Plugin tgs2.js — Convert Telegram animated stickers to WhatsApp
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const ffmpeg = require('fluent-ffmpeg');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { cmd } = require('../command');

cmd({
  pattern: 'tgs2',
  desc: 'Convert animated Telegram .tgs stickers to WhatsApp animated sticker',
  category: 'convert',
  filename: __filename
}, async (conn, mek, m, { reply, args }) => {
  try {
    if (!args[0]) return reply('📎 *Send Telegram sticker pack link!*\nEx: .tgs2 https://t.me/addstickers/Bbcxzsd_by_S7_5BOT');

    const name = args[0].split('/addstickers/')[1];
    if (!name) return reply('❌ Invalid sticker link.');

    const api = `https://api.telegram.org/bot<YOUR_TOKEN>/getStickerSet?name=${name}`;
    const res = await axios.get(api);

    if (!res.data.result.is_animated) {
      return reply('❌ Not an animated pack. Use `.tgs` for static ones.');
    }

    const list = res.data.result.stickers;
    reply(`🔄 Converting ${list.length} animated stickers...`);

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 512, height: 512 });

    for (let i = 0; i < Math.min(list.length, 101); i++) {
      const fid = list[i].file_id;
      const f = await axios.get(`https://api.telegram.org/bot<YOUR_TOKEN>/getFile?file_id=${fid}`);
      const url = `https://api.telegram.org/file/bot<YOUR_TOKEN>/${f.data.result.file_path}`;
      const tgsPath = `tgs_${i}.json`;
      fs.writeFileSync(tgsPath, (await axios.get(url, { responseType: 'arraybuffer' })).data);

      await page.goto(`data:text/html,<!DOCTYPE html><html><body>
        <div id="anim"></div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.0/lottie.min.js"></script>
        <script>
          var anim = bodymovin.loadAnimation({
            container: document.getElementById('anim'),
            renderer: 'canvas',
            loop: false,
            autoplay: true,
            path: 'file://${process.cwd()}/${tgsPath}'
          });
          anim.addEventListener('DOMLoaded', () => {});
        </script></body></html>`);

      await page.waitForTimeout(1200);
      const png = await page.screenshot({ omitBackground: true });
      fs.writeFileSync(`frame_${i}.png`, png);

      const webpPath = `anim_${i}.webp`;
      await new Promise((res, rej) => {
        ffmpeg()
          .input(`frame_${i}.png`)
          .loop(1)
          .duration(3) // ~3s
          .outputOptions('-vcodec', 'libwebp', '-lossless', '1', '-loop', '0', '-preset', 'picture')
          .save(webpPath)
          .on('end', res)
          .on('error', rej);
      });

      await conn.sendMessage(m.chat, { sticker: fs.readFileSync(webpPath) }, { quoted: mek });

      fs.unlinkSync(tgsPath);
      fs.unlinkSync(`frame_${i}.png`);
      fs.unlinkSync(webpPath);
    }

    await browser.close();
    reply('✅ Animated stickers sent!');
  } catch (e) {
    console.error(e);
    reply('❌ Error converting animated stickers.');
  }
});
