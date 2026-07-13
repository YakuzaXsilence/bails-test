'use strict';

Object.defineProperty(exports, '__esModule', { value: true });
exports.SPAM_FLOWS = exports.buildSpamReportMessageNodes = exports.buildSpamReportIq = exports.parseSpamReportResponse = exports.extractReportingInfoFromStanza = exports.extractMessageText = exports.normalizeReportingTag = exports.resolveReportJid = void 0;

var _index = require('../WABinary/index.js');
var _messages = require('./messages.js');

/** Common spam_flow values (subset — full enum has 92 in WA client). */
const SPAM_FLOWS = exports.SPAM_FLOWS = {
  ACCOUNT_INFO_REPORT: 'account_info_report',
  ACCOUNT_INFO_BLOCK: 'account_info_block',
  ONE_TO_ONE_SPAM_BANNER_REPORT: '1_1_spam_banner_report',
  MESSAGE_MENU: 'message_menu',
  OVERFLOW_MENU_REPORT: 'overflow_menu_report'
};

const toBuffer = data => {
  if (!data) return null;
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof Uint8Array) return Buffer.from(data);
  if (typeof data === 'string') return Buffer.from(data, 'base64');
  return null;
};

/**
 * Resolve target JID for spam_list (prefer LID when available).
 * @param {string} jid
 * @param {import('../Signal/lid-mapping').LIDMappingStore} [lidMapping]
 */
const resolveReportJid = async (jid, lidMapping) => {
  if (!jid) throw new Error('reportSpam: jid required');
  if ((0, _index.isLidUser)(jid) || (0, _index.isHostedLidUser)(jid)) return jid;
  if (lidMapping?.getLIDForPN) {
    const lid = await lidMapping.getLIDForPN(jid);
    if (lid) return lid;
  }
  return jid;
};
exports.resolveReportJid = resolveReportJid;

/**
 * @param {Buffer|string|null} tag
 * @returns {Buffer|null}
 */
const normalizeReportingTag = tag => {
  const buf = toBuffer(tag);
  if (!buf?.length) return null;
  return buf;
};
exports.normalizeReportingTag = normalizeReportingTag;

/**
 * Extract plain text from decrypted WA message content.
 * @param {import('../Types').WAMessage} msg
 */
const extractMessageText = msg => {
  if (!msg?.message) return '';
  const content = (0, _messages.extractMessageContent)(msg.message);
  if (!content) return '';
  if (typeof content.conversation === 'string') return content.conversation;
  if (content.extendedTextMessage?.text) return content.extendedTextMessage.text;
  if (content.imageMessage?.caption) return content.imageMessage.caption;
  if (content.videoMessage?.caption) return content.videoMessage.caption;
  return '';
};
exports.extractMessageText = extractMessageText;

/**
 * Parse reporting_tag blob from incoming message stanza.
 * @param {import('../WABinary').BinaryNode} stanza
 * @returns {{ stanzaId: string, timestamp: number, reportingTag: Buffer }|null}
 */
const extractReportingInfoFromStanza = stanza => {
  const reporting = (0, _index.getBinaryNodeChild)(stanza, 'reporting');
  if (!reporting) return null;

  let tagNode = (0, _index.getBinaryNodeChild)(reporting, 'reporting_tag');
  if (!tagNode) {
    const validation = (0, _index.getBinaryNodeChild)(reporting, 'reporting_validation');
    tagNode = validation ? (0, _index.getBinaryNodeChild)(validation, 'reporting_tag') : undefined;
  }
  if (!tagNode) return null;

  const raw = tagNode.content;
  const reportingTag = toBuffer(raw instanceof Uint8Array || Buffer.isBuffer(raw) ? raw : typeof raw === 'string' ? raw : null);
  if (!reportingTag?.length) return null;

  const stanzaId = tagNode.attrs?.id || stanza.attrs?.id;
  const tsRaw = tagNode.attrs?.ts_s || stanza.attrs?.t;
  const timestamp = tsRaw ? Number(tsRaw) : 0;
  if (!stanzaId) return null;

  return { stanzaId, timestamp, reportingTag };
};
exports.extractReportingInfoFromStanza = extractReportingInfoFromStanza;

/**
 * @typedef {Object} SpamReportMessageInput
 * @property {string} stanzaId
 * @property {number} timestamp
 * @property {Buffer|string} reportingTag
 * @property {string} [text]
 * @property {string} [pushName]
 * @property {string} [messageType]
 * @property {string} [fromJid]
 */

/**
 * Build <message> nodes for spam_list IQ (max 5).
 * @param {SpamReportMessageInput[]} messages
 */
const buildSpamReportMessageNodes = messages => {
  return messages.slice(0, 5).map(m => {
    const reportingTag = normalizeReportingTag(m.reportingTag);
    if (!reportingTag) throw new Error(`reportSpam: missing reportingTag for ${m.stanzaId}`);

    const fromJid = m.fromJid;
    const text = m.text ?? '';
    const msgType = m.messageType || 'text';

    return {
      tag: 'message',
      attrs: {
        t: String(m.timestamp),
        id: m.stanzaId,
        reported_push_name: m.pushName || '',
        type: msgType,
        from: fromJid
      },
      content: [
        {
          tag: 'raw',
          attrs: { local_message_type: '0', v: '2' },
          content: text
        },
        {
          tag: 'reporting',
          attrs: {},
          content: [
            {
              tag: 'reporting_validation',
              attrs: {},
              content: [
                {
                  tag: 'reporting_tag',
                  attrs: {
                    id: m.stanzaId,
                    ts_s: String(m.timestamp)
                  },
                  content: reportingTag
                }
              ]
            }
          ]
        }
      ]
    };
  });
};
exports.buildSpamReportMessageNodes = buildSpamReportMessageNodes;

/**
 * @param {string} jid - target LID/PN
 * @param {SpamReportMessageInput[]} messages
 * @param {string} [spamFlow]
 * @returns {import('../WABinary').BinaryNode}
 */
const buildSpamReportIq = (jid, messages, spamFlow = SPAM_FLOWS.ACCOUNT_INFO_REPORT) => {
  if (!messages?.length) throw new Error('reportSpam: at least one message with reporting_tag required');

  return {
    tag: 'iq',
    attrs: { type: 'set', xmlns: 'spam', to: _index.S_WHATSAPP_NET },
    content: [
      {
        tag: 'spam_list',
        attrs: { jid, spam_flow: spamFlow },
        content: buildSpamReportMessageNodes(messages)
      }
    ]
  };
};
exports.buildSpamReportIq = buildSpamReportIq;

/**
 * @param {import('../WABinary').BinaryNode} result
 * @returns {{ success: boolean, reportId?: string, error?: string }}
 */
const parseSpamReportResponse = result => {
  if (!result) return { success: false, error: 'empty response' };

  if (result.attrs?.type === 'error') {
    const errNode = (0, _index.getBinaryNodeChild)(result, 'error');
    const code = errNode?.attrs?.code;
    const text = errNode?.content?.toString?.() || errNode?.attrs?.text;
    return { success: false, error: `spam IQ error${code ? ` ${code}` : ''}${text ? `: ${text}` : ''}` };
  }

  const reportNode = (0, _index.getBinaryNodeChild)(result, 'report');
  const reportId = reportNode?.attrs?.id || (0, _index.getBinaryNodeChildString)(reportNode, 'id');
  if (reportId) return { success: true, reportId: String(reportId) };

  // Accepted without explicit report id
  if (result.attrs?.type === 'result') return { success: true };

  return { success: false, error: 'unexpected spam IQ response' };
};
exports.parseSpamReportResponse = parseSpamReportResponse;