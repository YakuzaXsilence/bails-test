"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LT_HASH_ANTI_TAMPERING = void 0;
var _whatsappRustBridge = require("whatsapp-rust-bridge");
/**
 * LT Hash is a summation based hash algorithm that maintains the integrity of a piece of data
 * over a series of mutations. You can add/remove mutations and it'll return a hash equal to
 * if the same series of mutations was made sequentially.
 */
const LT_HASH_ANTI_TAMPERING = exports.LT_HASH_ANTI_TAMPERING = new _whatsappRustBridge.LTHashAntiTampering();
//# sourceMappingURL=lt-hash.js.map