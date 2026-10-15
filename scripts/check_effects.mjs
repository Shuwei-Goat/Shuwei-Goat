import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const modules = process.env.PROFILE_NODE_MODULES || '/Users/feiniaole/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const { chromium } = require(path.join(modules, 'playwright'));
const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'output/playwright');
const artwork = path.join(root, 'assets/design');
const url = process.env.EFFECTS_URL || 'http://127.0.0.1:8766/docs/';
await fs.mkdir(output, { recursive: true });
await fs.mkdir(artwork, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const report = [];
try {
  for (const width of [1100, 390]) for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${url}?theme=${theme}`);
    await page.waitForFunction(() => document.querySelector('.profile-card') && document.images.length > 0 && [...document.images].every(image => image.complete));
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const check = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      broken: [...document.images].filter(image => !image.naturalWidth).map(image => image.getAttribute('src')),
      gallery: Boolean(document.querySelector('.circular-gallery canvas')?.width),
      glass: Boolean(document.querySelector('.glass-surface--webgl, .glass-surface--svg, .glass-surface--fallback')),
    }));
    await page.getByRole('button', { name: '暂停', exact: true }).click();
    await page.getByRole('button', { name: '淡紫', exact: true }).click();
    if (await page.getByRole('button', { name: '淡紫', exact: true }).getAttribute('aria-pressed') !== 'true') errors.push('Palette control failed');
    await page.locator('#profile').scrollIntoViewIfNeeded();
    const card = page.locator('.profile-card');
    const box = await card.boundingBox();
    await page.mouse.move(box.x + box.width * .8, box.y + box.height * .25);
    await page.waitForTimeout(400);
    const rotated = await card.evaluate(node => node.style.getPropertyValue('--pc-rotate-y'));
    check.tiltResponded = Number.parseFloat(rotated) !== 0;
    await page.screenshot({ path: path.join(output, `effects-${width}-${theme}.png`), fullPage: true });
    report.push({ width, theme, errors, ...check });
    await context.close();
  }
  const reduced = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(url);
  await reducedPage.waitForSelector('.profile-card');
  const reducedTilt = await reducedPage.locator('.profile-card').evaluate(node => node.style.getPropertyValue('--pc-rotate-y'));
  if (Number.parseFloat(reducedTilt) !== 0) throw new Error('Reduced-motion tilt should be zero');
  await reduced.close();

  if (!process.argv.includes('--check-only')) for (const name of ['profile', 'glass', 'gallery']) {
    const context = await browser.newContext({ viewport: { width: 900, height: 520 }, colorScheme: 'light' });
    const page = await context.newPage();
    await page.goto(`${url}?theme=light&capture=${name}`);
    await page.waitForTimeout(1300);
    const frames = path.join(output, `frames-${name}`);
    await fs.mkdir(frames, { recursive: true });
    for (let i = 0; i < 48; i++) {
      const t = i / 47 * Math.PI * 2;
      if (name === 'profile') await page.mouse.move(450 + Math.sin(t) * 120, 250 + Math.cos(t) * 155);
      if (name === 'glass') await page.mouse.move(450 + Math.sin(t) * 350, 260 + Math.cos(t) * 160);
      await page.waitForTimeout(60);
      await page.screenshot({ path: path.join(frames, `${String(i).padStart(3, '0')}.png`) });
    }
    await fs.copyFile(path.join(frames, '012.png'), path.join(artwork, `react-${name}.png`));
    const result = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '12', '-i', path.join(frames, '%03d.png'),
      '-filter_complex', 'split[s0][s1];[s0]palettegen=max_colors=192:stats_mode=diff[p];[s1][p]paletteuse=dither=sierra2_4a',
      '-loop', '0', path.join(artwork, `react-${name}.gif`)], { encoding: 'utf8' });
    if (result.status !== 0) throw new Error(result.stderr || 'GIF conversion failed');
    await context.close();
    console.log(`Recorded actual React Bits ${name} component.`);
  }
} finally {
  await browser.close();
}
await fs.writeFile(path.join(root, 'evidence/design-effects/visual-check.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (report.some(item => item.errors.length || item.overflow || item.broken.length || !item.gallery || !item.glass || !item.tiltResponded)) process.exitCode = 1;
