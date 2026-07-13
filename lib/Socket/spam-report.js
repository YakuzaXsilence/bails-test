'use strict';

Object.defineProperty(exports, '__esModule', { value: true });
exports.makeSpamReportSocket = void 0;

var _reportingInfoStore = require('../Store/reporting-info-store.js');
var _spamReportUtils = require('../Utils/spam-report-utils.js');
var _index = require('../WABinary/index.js');

/**
 * Adds full spam report support (account_info_report with message evidence).
 * @param {import('./business').BusinessSocket} sock
 * @param {import('../Types').SocketConfig} config
 */
const makeSpamReportSocket = (sock, config) => {
  const { query, signalRepository, logger } = sock;

  if (!config.reportingInfoStore) {
    config.reportingInfoStore = (0, _reportingInfoStore.createReportingInfoStore)();
  }
  const store = config.reportingInfoStore;

  /**
   * Report a user/contact as spam with message evidence + reporting_tag.
   *
   * @param {string} jid - phone JID or LID of reported user
   * @param {Object} [options]
   * @param {string} [options.spamFlow='account_info_report']
   * @param {import('../Utils/spam-report-utils').SpamReportMessageInput[]} [options.messages] - manual evidence; auto from store if omitted
   * @param {number} [options.maxMessages=5]
   * @returns {Promise<{ success: boolean, reportId?: string, error?: string, messageCount: number }>}
   */
  const reportSpam = async (jid, options = {}) => {
    const {
      spamFlow = _spamReportUtils.SPAM_FLOWS.ACCOUNT_INFO_REPORT,
      messages: manualMessages,
      maxMessages = 5
    } = options;

    const reportJid = await (0, _spamReportUtils.resolveReportJid)(jid, signalRepository?.lidMapping);

    let messages = manualMessages;
    if (!messages?.length) {
      const stored = store.getForJid(reportJid, maxMessages);
      if (!stored.length && reportJid !== jid) {
        messages = store.getForJid(jid, maxMessages);
      } else {
        messages = stored;
      }
    }

    if (!messages?.length) {
      throw new Error(`reportSpam: no reporting_tag stored for ${jid}. Receive messages from target first.`);
    }

    const normalized = messages.slice(0, maxMessages).map(m => ({
      stanzaId: m.stanzaId || m.id,
      timestamp: Number(m.timestamp || m.sendTimestamp || m.t),
      reportingTag: (0, _spamReportUtils.normalizeReportingTag)(m.reportingTag || m.tag),
      text: m.text ?? m.raw ?? '',
      pushName: m.pushName || m.reportedPushName || '',
      messageType: m.messageType || m.type || 'text',
      fromJid: m.fromJid || m.from || reportJid
    }));

    const iq = (0, _spamReportUtils.buildSpamReportIq)(reportJid, normalized, spamFlow);
    logger?.debug?.({ jid: reportJid, spamFlow, count: normalized.length }, 'sending spam report IQ');

    const result = await query(iq);
    const parsed = (0, _spamReportUtils.parseSpamReportResponse)(result);

    return { ...parsed, messageCount: normalized.length };
  };

  /**
   * Get stored reporting entries for a JID (from received messages).
   * @param {string} jid
   * @param {number} [max=5]
   */
  const getStoredReportingInfo = (jid, max = 5) => store.getForJid(jid, max);

  /** Clear stored reporting info for a JID. */
  const clearStoredReportingInfo = jid => store.clear(jid);

  return {
    ...sock,
    reportSpam,
    getStoredReportingInfo,
    clearStoredReportingInfo,
    reportingInfoStore: store
  };
};

exports.makeSpamReportSocket = makeSpamReportSocket;