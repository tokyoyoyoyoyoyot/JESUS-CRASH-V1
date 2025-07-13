const { cmd } = require('../command');

// Mete nimewo WhatsApp moun ki deploy bot la
// Fòma egzak: 'number@s.whatsapp.net'
// Egzanp: '50912345678@s.whatsapp.net' pou nimewo +50912345678
const OWNER_ID = '13058962443@s.whatsapp.net'; // <-- modifye ak nimewo w lan

/**
 * Fonksyon verifye si moun ki voye mesaj la se owner bot la
 * @param {string} sender - ID WhatsApp moun nan
 * @returns {boolean}
 */
function isOwner(sender) {
  return sender === OWNER_ID;
}

cmd({
  pattern: 'anti-use',               // Kaptire tout kòmand ak mesaj
  fromMe: false,               // Sa pa limite a mesaj ou menm
  dontAddCommandList: true,    // Pa ajoute nan lis kòmand otomatik
  filename: __filename,
}, async (conn, m, { next, reply }) => {
  if (!isOwner(m.sender)) {
    // Si se pa owner, voye mesaj entèdiksyon epi pa kontinye
    await reply(
      '⛔ Ou pa gen dwa itilize bot sa a.\n' +
      'Tanpri kontakte moun ki deploy bot la pou jwenn aksè.'
    );
    return; // Pa kontinye ak lòt kòmand oswa travay
  }
  // Si se owner, kontinye ak tretman nòmal kòmand yo
  await next();
});
