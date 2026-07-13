"use strict";

const chalk = require("chalk");

console.clear();

const packageVersion = "2.4.11";

const startASCII = `
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║          ✦ YAKUZAXSILENCE BAILEYS ✦                  ║
  ║                                                       ║
  ║         WhatsApp Modified Library v${packageVersion}  ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
`;


const colors = {
  primary: chalk.hex("#8B5CF6"),
  secondary: chalk.hex("#EC4899"),
  accent: chalk.hex("#06B6D4"),
  muted: chalk.hex("#6B7280"),
  white: chalk.hex("#FFFFFF"),
  gold: chalk.hex("#F59E0B")
};

console.log(colors.primary(startASCII));

console.log(
  colors.muted("  ──────────────────────────────────────────────")
);
console.log(
  colors.secondary("  ▸") + colors.white(" Library  : ") + colors.accent("YakuzaXsilence/bails")
);
console.log(
  colors.secondary("  ▸") + colors.white(" Author   : ") + colors.gold("YakuzaXsilence")
);
console.log(
  colors.secondary("  ▸") + colors.white(" Instal   : ") + colors.muted("npm install YakuzaXsilence/bails")
);
console.log(
  colors.muted("  ──────────────────────────────────────────────\n")
);

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _exportNames = {
  makeWASocket: true
};
exports.default = void 0;
Object.defineProperty(exports, "makeWASocket", {
  enumerable: true,
  get: function () {
    return _index.default;
  }
});

var _index = _interopRequireDefault(require("./Socket/index.js"));

var _index2 = require("../WAProto/index.js");
Object.keys(_index2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _index2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index2[key];
    }
  });
});

var _index3 = require("./Utils/index.js");
Object.keys(_index3).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _index3[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index3[key];
    }
  });
});

var _index4 = require("./Types/index.js");
Object.keys(_index4).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _index4[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index4[key];
    }
  });
});

var _index5 = require("./Defaults/index.js");
Object.keys(_index5).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _index5[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index5[key];
    }
  });
});

var _index6 = require("./WABinary/index.js");
Object.keys(_index6).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _index6[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index6[key];
    }
  });
});

var _index7 = require("./WAM/index.js");
Object.keys(_index7).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _index7[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index7[key];
    }
  });
});

var _index8 = require("./WAUSync/index.js");
Object.keys(_index8).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _index8[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index8[key];
    }
  });
});

var _index9 = require("./Store/index.js");
Object.keys(_index9).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _index9[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index9[key];
    }
  });
});

function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}

exports.default = _index.default;
