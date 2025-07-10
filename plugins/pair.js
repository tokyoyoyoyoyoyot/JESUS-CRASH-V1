const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "✅",
    desc: "Get pairing code for 𝐉𝐄𝐒𝐔𝐒-𝐂𝐑𝐀𝐒𝐇-𝐕𝟏 bot",
    category: "download",
    use: ".pair 226XXXXX",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply }) => {
    try {
        // Récupère numéro, sanitize li
        const phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');
        console.log('[PAIR] Using phone number:', phoneNumber);

        // Validation basic
        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return await reply("❌ Please provide a valid phone number without `+`\nExample: `.pair 1305896XXXXX`");
        }

        // Requête API
        const response = await axios.get(`https://sessions-jesus-crash.onrender.com/pair/code?number=${encodeURIComponent(phoneNumber)}`);
        console.log('[PAIR] API response:', response.data);

        // Verifye si gen code nan repons lan
        if (!response.data) {
            return await reply("❌ API response empty. Please try again later.");
        }

        // Nou ka siyen ke code ka nan response.data.code, oswa li ka nan response.data.data.code (depen sou API)
        let pairingCode = null;
        if (response.data.code) {
            pairingCode = response.data.code;
        } else if (response.data.data && response.data.data.code) {
            pairingCode = response.data.data.code;
        }

        if (!pairingCode) {
            return await reply("❌ Failed to retrieve pairing code. Please try again later.");
        }

        const doneMessage = "> *𝐉𝐄𝐒𝐔𝐒-𝐂𝐑𝐀𝐒𝐇-𝐕𝟏 PAIRING COMPLETED*";

        await reply(`${doneMessage}\n\n*Your pairing code is:* ${pairingCode}`);

        // Delay 2 segonn
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Re-send pairing code
        await reply(`${pairingCode}`);

    } catch (error) {
        console.error("[PAIR COMMAND ERROR]", error);
        await reply("❌ An error occurred while getting pairing code. Please try again later.");
    }
});
