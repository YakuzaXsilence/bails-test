# @ayunlove/bails

WhatsApp Modified By ayunlove — Complete Baileys API.

## Install

```json
"dependencies": {
  "@ayunlove/bails": "^2.0.0"
}
```

> **jimp sudah include** — tidak perlu install `jimp` terpisah.

## Import

```javascript
const { default: makeWASocket, DisconnectReason } = require('@ayunlove/bails');
```

## Fitur

- Fix memory leak & CPU — mutex + offline batching + WeakMap cache
- Anti-banned error 463 (Reachout Timelock)
- Protokol WA terbaru: LID mapping, TC Tokens, App State sync
- Newsletter v2, Album message, `@all` mention (`mentionAll: true`)
- **jimp auto-include**
- CommonJS — kompatibel `require()`

### Shortcut Helpers

- `sendText`, `sendImage`, `sendVideo`, `sendAudio`, `sendDocument`
- `sendPoll`, `sendQuiz`, `sendLocation`, `sendPtv`
- `statusMention`

### Extended Messages

- `requestPaymentMessage`, `productMessage`, `albumMessage`
- `eventMessage`, `pollResultMessage`, `orderMessage`
- `groupStatus`, `groupLabel`
- `interactiveMessage`

## Contoh

```javascript
await sock.sendText(jid, 'Hello');
await sock.sendImage(jid, { url: './foto.jpg' }, 'caption');

await sock.sendMessage(jid, {
  albumMessage: [
    { image: buffer1, caption: 'foto 1' },
    { image: { url: 'https://...' }, caption: 'foto 2' }
  ]
});

await sock.sendMessage(jid, {
  text: 'Halo semua!',
  mentionAll: true
});
```

## Requirements

- Node.js **>= 20**