// made by dawens boy

const { cmd } = require('../command');
const fs = require("fs");
const path = require("path");

cmd({
  pattern: "payment",
  alias: ["pay", "donate"],
  desc: "Show all payment methods with buttons",
  category: "spam",
  react: "💰",
  filename: __filename
}, async (bot, m) => {

  const qrPath = path.join(__dirname, '../media/paymentqr.jpg');
  const imageBuffer = fs.existsSync(qrPath) ? fs.readFileSync(qrPath) : null;

  const paymentText = `
💸 *PAYMENT OPTIONS* 💸

📲 *MonCash:* +50942241547
💳 *Zelle:* berryxoe@gmail.com
💵 *CashApp:* $berryxoe
🌐 *PayPal:* berryxoe@gmail.com

✅ Tap a button below to proceed:
`;

  const buttons = [
    { buttonId: "btn_contactowner", buttonText: { displayText: "📞 Contact Owner" }, type: 1 },
    { buttonId: "btn_sendproof", buttonText: { displayText: "📤 Send Proof" }, type: 1 }
  ];

  await bot.sendMessage(m.chat, {
    image: imageBuffer,
    caption: paymentText,
    footer: "Powered by DAWENS SYSTEM",
    buttons: buttons,
    headerType: 4
  }, { quoted: m });
});