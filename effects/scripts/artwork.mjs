import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const modules = process.env.PROFILE_NODE_MODULES || '/Users/feiniaole/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const sharp = require(path.join(modules, 'sharp'));
const root = path.resolve(import.meta.dirname, '../..');
const output = path.join(root, 'effects/public/media');
await fs.mkdir(output, { recursive: true });
const logo = await fs.readFile(path.join(root, 'assets/goat-logo.png'));
await fs.writeFile(path.join(output, 'goat-logo.png'), logo);
const image = `data:image/png;base64,${logo.toString('base64')}`;
const themes = {
  sage: ['#669379', '#C9D8AD', '#ffffff'],
  cream: ['#DCD9A9', '#F5EBCF', '#365847'],
  lilac: ['#A6ADC8', '#E3CEE2', '#365847'],
  rainbow: ['#9CD7C0', '#E7C7D4', '#365847'],
};
for (const [name, [left, right, ink]] of Object.entries(themes)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="900" viewBox="0 0 720 900">
  <defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="${left}"/><stop offset="1" stop-color="${right}"/></linearGradient></defs>
  <rect width="720" height="900" fill="url(#g)"/><g fill="none" stroke="${ink}" opacity=".22">
  <ellipse cx="360" cy="460" rx="270" ry="330"/><ellipse cx="360" cy="460" rx="310" ry="370"/>
  <ellipse cx="360" cy="460" rx="230" ry="290"/></g>
  <rect x="110" y="200" width="500" height="500" rx="78" fill="#ffffff" fill-opacity=".94"/>
  <image href="${image}" x="142" y="232" width="436" height="436"/>
  <text x="54" y="112" fill="${ink}" font-size="58" font-family="Arial,sans-serif" font-weight="600">${name.toUpperCase()}</text>
  <text x="54" y="824" fill="${ink}" font-size="38" font-family="Arial,sans-serif" font-weight="600">Shuwei-Goat</text></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(output, `goat-${name}.png`));
}
await fs.copyFile(path.join(root, 'effects/LICENSE.react-bits.md'), path.join(root, 'effects/public/LICENSE.react-bits.md'));
console.log('Prepared unchanged goat logo and four brand colour artworks.');
