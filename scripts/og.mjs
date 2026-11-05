// Renders public/og.png (1200x630 social preview) from an SVG. Run: npm run og
import sharp from 'sharp';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#3dff9a"/><stop offset="1" stop-color="#00d1ff"/></linearGradient></defs>
  <rect width="1200" height="630" fill="#07090a"/>
  <rect x="60" y="60" width="1080" height="510" rx="18" fill="#0e1513" stroke="#1d2b27" stroke-width="2"/>
  <rect x="60" y="60" width="1080" height="56" rx="18" fill="#0c1110"/>
  <circle cx="100" cy="88" r="9" fill="#ff5f6d"/><circle cx="130" cy="88" r="9" fill="#ffcc4d"/><circle cx="160" cy="88" r="9" fill="#3dff9a"/>
  <text x="190" y="95" font-family="monospace" font-size="20" fill="#6f857c">~/portfolio</text>
  <text x="110" y="220" font-family="monospace" font-size="30" fill="#6f857c">lfps@portfolio:~$ whoami</text>
  <text x="110" y="330" font-family="monospace" font-weight="700" font-size="96" fill="url(#g)">Lfps</text>
  <text x="110" y="400" font-family="monospace" font-size="38" fill="#c9d6cf">Software Development Student</text>
  <text x="110" y="490" font-family="monospace" font-size="26" fill="#3dff9a">luizfps120hz.github.io</text>
  <rect x="690" y="372" width="20" height="36" fill="#3dff9a"/>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile('public/og.png');
console.log('public/og.png written');
