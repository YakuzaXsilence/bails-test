Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;
var _index = require("../Defaults/index.js");
var _communities = require("./communities.js");
var _interop = require("./interop.js");
var _privacy = require("./privacy.js");
var _graphql = require("./graphql.js");
const makeWASocket = a => {
  const newConfig = {
    ..._index.DEFAULT_CONNECTION_CONFIG,
    ...a
  };
  const satu = (0, _communities.makeCommunitiesSocket)(newConfig);
  const dua = (0, _interop.makeInteropSocket)(satu);
  const tiga = (0, _privacy.makePrivacySocket)(dua);
  const empat = (0, _graphql.makeGraphQLSocket)(tiga);
  return empat;
};
var _default = exports.default = makeWASocket;