const userPresence = new Map();

bot.ev.on('presence.update', update => {
  const { id, presences } = update;
  userPresence.set(id, presences);
});

// Kòmand
cmd({
  pattern: 'device',
  desc: 'Check what device a user is using',
  category: 'spam',
  filename: __filename,
  fromMe: false
}, async (bot, mek, { reply, quoted, isGroup }) => {
  try {
    const target = isGroup
      ? (quoted ? quoted.sender : (mek.mentionedJid && mek.mentionedJid.length ? mek.mentionedJid[0] : mek.sender))
      : mek.sender;

    const presences = userPresence.get(target);

    let deviceType = 'Unknown';

    if (presences) {
      // Presences se yon object: aparèy => done prezans
      // Nou ka pran premye aparèy ki pa offline oswa jis premye kle a
      const activeDevices = Object.entries(presences).filter(([device, info]) => info.lastKnownPresence !== 'offline');

      if (activeDevices.length > 0) {
        deviceType = activeDevices[0][0]; // Premye aparèy (ex: 'android', 'web', etc)
      } else {
        // Si tout offline, pran premye aparèy nan lis
        deviceType = Object.keys(presences)[0];
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
