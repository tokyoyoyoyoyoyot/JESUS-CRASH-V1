const { cmd } = require('../command');

cmd({
  pattern: 'device',
  desc: 'Check what device a user is using',
  category: 'spam',
  filename: __filename,
  fromMe: false
}, async (bot, mek, { reply, quoted, isGroup }) => {
  try {
    const target = isGroup
      ? (quoted ? quoted.sender : mek.mentionedJid[0] || mek.sender)
      : mek.sender;

    const presence = bot.presence?.[target];

    let deviceType = 'Unknown';

    if (presence && presence.lastKnownPresence) {
      const platform = presence.lastKnownPresence?.platform || presence.platform;
      if (platform) {
        deviceType = platform;
      }
    }

    const formattedDevice = {
      'android': '📱 Android',
      'ios': '📱 iPhone',
      'web': '💻 WhatsApp Web',
      'macos': '🖥️ macOS App',
      'windows': '🪟 Windows App',
      'unknown': '❓ Unknown Device'
    }[deviceType.toLowerCase()] || deviceType;

    await reply(`That user is using: *${formattedDevice}*`);

  } catch (err) {
    console.error(err);
    await reply('❌ Error checking device.');
  }
});