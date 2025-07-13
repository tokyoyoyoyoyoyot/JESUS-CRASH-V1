let autoblockEnabled = false;

const bannedWords = ['hi', 'hello', 'bb', 'bro', 'mdr', 'yooo', 'manmi', 'papoo', 'fr'];

const { cmd } = require('../command');

cmd({
  pattern: 'autoblock',
  desc: 'Enable or disable autoblock when people write dumb messages in group',
  category: 'spam',
  use: 'on / off',
  react: '🔒'
}, async ({ m, args }) => {
  const option = args?.toLowerCase();
  if (option === 'on') {
    autoblockEnabled = true;
    m.reply('✅ Autoblock is now *enabled*.');
  } else if (option === 'off') {
    autoblockEnabled = false;
    m.reply('❌ Autoblock is now *disabled*.');
  } else {
    m.reply('ℹ️ Usage: .autoblock on / off');
  }
});

// Message listener
cmd({
  on: 'message'
}, async ({ m, sock, isGroup, body }) => {
  if (!autoblockEnabled || !isGroup) return;

  const text = (body || '').toLowerCase().trim();
  const containsBanned = bannedWords.some(word => text === word || text.includes(word));

  if (containsBanned) {
    try {
      await sock.updateBlockStatus(m.sender, 'block');
      console.log(`⛔ Blocked: ${m.sender} for message: ${text}`);
    } catch (err) {
      console.error(`❌ Failed to block ${m.sender}:`, err.message);
    }
  }
});
