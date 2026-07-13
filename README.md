# <p align="center">YakuzaXsilence/bails</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=35&duration=3000&pause=1000&color=00FFD1&center=true&vCenter=true&width=600&height=80&lines=YakuzaXsilence%2Fbails;WhatsApp+Modified+Library;Complete+Baileys+API" alt="Typing SVG" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/License-GPLv3-blue?style=for-the-badge&logo=gnu&logoColor=white" />
  <img src="https://img.shields.io/badge/Version-2.4.11-brightgreen?style=for-the-badge&logo=npm&logoColor=white" />
</p>

## <span style="color: #00FFD1; text-shadow: 0 0 10px #00FFD1, 0 0 20px #00FFD1, 0 0 40px #00FFD1;">⚡ Instalasi</span>

"dependencies": {
  "YakuzaXsilence/bails": "^2.0.0"
}
jimp sudah include — tidak perlu install jimp terpisah.

<span style="color: #FF6B6B; text-shadow: 0 0 10px #FF6B6B, 0 0 20px #FF6B6B, 0 0 40px #FF6B6B;">📦 Import</span>
javascript
const { default: makeWASocket, DisconnectReason } = require('YakuzaXsilence/bails');
<span style="color: #FFD93D; text-shadow: 0 0 10px #FFD93D, 0 0 20px #FFD93D, 0 0 40px #FFD93D;">🚀 Fitur</span>
Fix memory leak & CPU — mutex + offline batching + WeakMap cache

Anti-banned error 463 (Reachout Timelock)

Protokol WA terbaru: LID mapping, TC Tokens, App State sync

Newsletter v2, Album message, @all mention (mentionAll: true)

jimp auto-include

CommonJS — kompatibel require()

Shortcut Helpers
sendText, sendImage, sendVideo, sendAudio, sendDocument

sendPoll, sendQuiz, sendLocation, sendPtv

statusMention

Extended Messages
requestPaymentMessage, productMessage, albumMessage

eventMessage, pollResultMessage, orderMessage

groupStatus, groupLabel

interactiveMessage

<span style="color: #6BCB77; text-shadow: 0 0 10px #6BCB77, 0 0 20px #6BCB77, 0 0 40px #6BCB77;">💻 Contoh Penggunaan</span>
javascript
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
<span style="color: #A66CFF; text-shadow: 0 0 10px #A66CFF, 0 0 20px #A66CFF, 0 0 40px #A66CFF;">📋 Persyaratan</span>
Node.js >= 20

<p align="center"> <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=20&duration=3000&pause=1000&color=00FFD1&center=true&vCenter=true&width=500&height=40&lines=YakuzaXsilence%2Fbails;Made+with+%E2%9D%A4%EF%B8%8F;For+WhatsApp+Automation" alt="Footer Typing SVG" /> </p><p align="center"> <a href="https://github.com/YakuzaXsilence/bails"> <img src="https://img.shields.io/badge/GitHub-YakuzaXsilence%2Fbails-181717?style=for-the-badge&logo=github&logoColor=white" /> </a> </p> 
