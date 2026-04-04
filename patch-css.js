const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/globals.css');
let s = fs.readFileSync(file, 'utf8');

if (!s.includes('@keyframes vk-float')) {
  s += `\n\n/* Nature / ambient background float */\n@keyframes vk-float {\n  0%,\n  100% {\n    transform: translate3d(0, 0, 0);\n  }\n  50% {\n    transform: translate3d(0, -18px, 0);\n  }\n}\n`;
}

fs.writeFileSync(file, s);
