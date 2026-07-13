"use strict";

const fs = require("fs");
const path = require("path");

function findBridgePkg() {
  let dir = path.resolve(__dirname, "..");
  for (let i = 0; i < 10; i++) {
    const candidates = [
      path.join(dir, "node_modules", "whatsapp-rust-bridge", "package.json"),
      path.join(dir, "whatsapp-rust-bridge", "package.json")
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) return candidate;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const pkgPath = findBridgePkg();
if (!pkgPath) {
  process.exit(0);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

if (!pkg.exports?.["."]?.require) {
  pkg.exports = pkg.exports || {};
  pkg.exports["."] = pkg.exports["."] || {};
  pkg.exports["."].require = pkg.exports["."].import || "./dist/index.js";
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}