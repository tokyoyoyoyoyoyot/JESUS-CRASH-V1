const { cmd } = require("../command");

cmd({
  pattern: "cid",
  alias: ["cinfo", "newsletter", "id"],
  react: "📡",
  desc: "Get WhatsApp Channel info from link",
  category: "whatsapp",
  filename: __filename
}, async (conn, mek, m, { from, args, q, reply }) => {
  try {
    if (!q) {
      return await reply(`❎ Please provide a WhatsApp Channel link.\n\n*Example:* .cid https://whatsapp.com/channel/123456789`);
    }

    const match = q.match(/whatsapp\.com\/channel\/([\w-]+)/);
    if (!match) {
      return await reply(`⚠️ Invalid channel link format.\nMake sure it looks like:\nhttps://whatsapp.com/channel/xxxxxxxxx`);
    }

    const inviteId = match[1];

    let metadata;
    try {
      metadata = await conn.newsletterMetadata("invite", inviteId);
    } catch (e) {
      console.error("❌ Failed to fetch metadata:", e);
      return await reply("❌ Failed to fetch channel info. Please check the link or access permission.");
    }

    if (!metadata?.id) {
      return await reply("❌ Channel not found or inaccessible.");
    }

    const createdDate = metadata.creation_time
      ? new Date(metadata.creation_time * 1000).toLocaleString('en-US', { timeZone: 'UTC' })
      : "Unknown";

    const infoText = `📡 *WhatsApp Channel Info*\n\n` +
      `🆔 *ID:* ${metadata.id}\n` +
      `📛 *Name:* ${metadata.name}\n` +
      `👥 *Followers:* ${metadata.subscribers?.toLocaleString() || "N/A"}\n` +
      `📅 *Created on:* ${createdDate}`;

    const previewUrl = metadata.preview ? `https://pps.whatsapp.net${metadata.preview}` : null;

    if (previewUrl) {
      await conn.sendMessage(from, {
        image: { url: previewUrl },
        caption: infoText
      }, { quoted: m });
    } else {
      await reply(infoText);
    }

  } catch (err) {
    console.error("❌ Error in .cid command:", err);
    await reply("⚠️ An unexpected error occurred while fetching channel info.");
  }
});
