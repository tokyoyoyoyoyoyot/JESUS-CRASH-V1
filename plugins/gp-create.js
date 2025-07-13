const { cmd } = require('../command');
const { delay } = require('@whiskeysockets/baileys');

cmd({
  pattern: 'gpcreate',
  alias: ['creategp', 'newgroup'],
  desc: 'Create a group, promote owner, set description (bot stays)',
  category: 'group',
  use: '<group name>|@members',
  react: '👥'
}, async ({ m, sock, args, isCreator }) => {
  if (!isCreator) return m.reply('❌ Only the bot owner can use this command.');

  if (!args || !args.includes('|')) {
    return m.reply('✏️ *Usage:* .gpcreate Group Name | @member1 @member2');
  }

  const [groupName, mentionRaw] = args.split('|').map(str => str.trim());
  const mentions = [...m.mentionedJid];

  if (!groupName || mentions.length < 1) {
    return m.reply('⚠️ Group name or member mentions missing!');
  }

  try {
    // Step 1: Create group
    const { id: groupId } = await sock.groupCreate(groupName, mentions);

    if (!groupId) return m.reply('❌ Failed to create group.');

    m.reply(`✅ *Group Created:*\n📛 Name: ${groupName}\n🆔 ID: ${groupId}`);

    await delay(2000);

    // Step 2: Promote you (owner) to admin
    await sock.groupParticipantsUpdate(groupId, [m.sender], 'promote');

    // Step 3: Set group description
    const desc = `👑 Group created by ${m.pushName || "Owner"}\n🎯 ${groupName} by DAWENS-XD 🤖`;
    await sock.groupUpdateDescription(groupId, desc);

    // Bot stays in group (does NOT leave)

  } catch (err) {
    console.error(err);
    m.reply('❌ An error occurred while creating the group.');
  }
});
