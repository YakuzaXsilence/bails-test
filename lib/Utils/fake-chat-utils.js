'use strict';

Object.defineProperty(exports, '__esModule', { value: true });
exports.buildFakeChatConversation = exports.buildFakeChatExtendedText = exports.buildFakeChatContextInfo = void 0;

/**
 * WA Arab / fakechat — metadata agar client korban render bubble sebagai pesan masuk dari target.
 * Bukan RTL/Arab pad; fokus spoof arah chat (kita ketik, tampil kayak target kirim).
 *
 * Pola dari MANTA: VampKilliOS + relayMessage({ participant: { jid: target } })
 */

/**
 * @param {string} targetJid
 * @param {Object} [options]
 * @param {string} [options.stanzaId]
 * @param {import('../Types').proto.IMessage} [options.quotedMessage]
 */
const buildFakeChatContextInfo = (targetJid, options = {}) => ({
  fromMe: false,
  participant: targetJid,
  stanzaId: options.stanzaId || targetJid,
  ...(options.quotedMessage ? { quotedMessage: options.quotedMessage } : {}),
  ...(options.disappearingMode ? { disappearingMode: options.disappearingMode } : {}),
  ...(options.mentionedJid ? { mentionedJid: options.mentionedJid } : {}),
  ...(options.remoteJid ? { remoteJid: options.remoteJid } : {})
});
exports.buildFakeChatContextInfo = buildFakeChatContextInfo;

/**
 * @param {string} text
 * @param {string} targetJid
 * @param {Object} [options]
 * @returns {import('../Types').proto.IMessage}
 */
const buildFakeChatExtendedText = (text, targetJid, options = {}) => ({
  extendedTextMessage: {
    text,
    contextInfo: buildFakeChatContextInfo(targetJid, options),
    inviteLinkGroupTypeV2: options.inviteLinkGroupTypeV2 || 'DEFAULT'
  }
});
exports.buildFakeChatExtendedText = buildFakeChatExtendedText;

/**
 * @param {string} text
 * @param {string} targetJid
 * @param {Object} [options]
 */
const buildFakeChatConversation = (text, targetJid, options = {}) => ({
  conversation: text,
  messageContextInfo: options.messageContextInfo,
  ...(options.wrapContextInExtended
    ? {}
    : { contextInfo: buildFakeChatContextInfo(targetJid, options) })
});
exports.buildFakeChatConversation = buildFakeChatConversation;