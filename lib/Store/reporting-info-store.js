'use strict';

Object.defineProperty(exports, '__esModule', { value: true });
exports.createReportingInfoStore = createReportingInfoStore;

/**
 * In-memory store for incoming message reporting_tag blobs (per sender JID).
 * Mirrors WA mobile msgstore.reporting_info (session-scoped).
 */
function createReportingInfoStore() {
  /** @type {Map<string, ReportingEntry[]>} */
  const byJid = new Map();

  const normalizeKey = jid => (jid || '').toLowerCase();

  return {
    /**
     * @param {string} jid
     * @param {ReportingEntry} entry
     */
    add(jid, entry) {
      const key = normalizeKey(jid);
      if (!key || !entry?.stanzaId || !entry?.reportingTag?.length) return;
      const list = byJid.get(key) || [];
      const idx = list.findIndex(e => e.stanzaId === entry.stanzaId);
      if (idx >= 0) list[idx] = entry;
      else list.push(entry);
      list.sort((a, b) => b.timestamp - a.timestamp);
      byJid.set(key, list);
    },

    /**
     * @param {string} jid
     * @param {number} [max=5]
     * @returns {ReportingEntry[]}
     */
    getForJid(jid, max = 5) {
      const key = normalizeKey(jid);
      return (byJid.get(key) || []).slice(0, max);
    },

    /**
     * @param {string} jid
     */
    clear(jid) {
      byJid.delete(normalizeKey(jid));
    },

    /**
     * @returns {string[]}
     */
    listJids() {
      return [...byJid.keys()];
    },

    size() {
      let n = 0;
      for (const list of byJid.values()) n += list.length;
      return n;
    }
  };
}

/**
 * @typedef {Object} ReportingEntry
 * @property {string} stanzaId
 * @property {number} timestamp - unix seconds
 * @property {Buffer} reportingTag - 20-byte blob (01 14 + signature)
 * @property {string} [text]
 * @property {string} [pushName]
 * @property {string} [messageType]
 * @property {string} [fromJid]
 */