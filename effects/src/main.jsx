import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ProfileCard from './vendor/ProfileCard';
import GlassSurface from './vendor/GlassSurface';
import CircularGallery from './vendor/CircularGallery';
import './style.css';

const asset = name => `${import.meta.env.BASE_URL}media/${name}`;
const goat = asset('goat-logo.png');
const capture = new URLSearchParams(location.search).get('capture');
if (['profile', 'glass', 'gallery'].includes(capture)) document.documentElement.dataset.capture = capture;
const palettes = {
  mint: ['#669379', '#DCD9A9', '#9BD9C4'],
  cream: ['#B5AF7D', '#F0E8BF', '#DFBEA1'],
  lilac: ['#8F9FBE', '#E0CDE7', '#C5D2BC'],
};

function GlassScene() {
  const canvas = useRef(null);
  const stage = useRef(null);
  const [tint, setTint] = useState('mint');
  useEffect(() => {
    const context = canvas.current.getContext('2d');
    const image = new Image();
    image.src = goat;
    let frame;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const render = time => {
      const [left, right, orb] = palettes[tint];
      const gradient = context.createLinearGradient(0, 0, 1100, 620);
      gradient.addColorStop(0, left);
      gradient.addColorStop(1, right);
      context.fillStyle = gradient;
      context.fillRect(0, 0, 1100, 620);
      const t = reduced ? 0 : time / 1800;
      context.fillStyle = orb;
      context.beginPath();
      context.arc(320 + Math.sin(t) * 130, 280 + Math.cos(t) * 80, 190, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = '#ffffff80';
      context.lineWidth = 3;
      for (let n = 0; n < 6; n++) {
        context.beginPath();
        context.ellipse(770, 305, 135 + n * 35, 210 + n * 30, -.45, 0, Math.PI * 2);
        context.stroke();
      }
      if (image.complete && image.naturalWidth) context.drawImage(image, 655, 150, 290, 290);
      if (!reduced) frame = requestAnimationFrame(render);
    };
    image.onload = () => { if (reduced) render(0); };
    render(0);
    return () => cancelAnimationFrame(frame);
  }, [tint]);
  const move = event => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = stage.current.getBoundingClientRect();
    stage.current.style.setProperty('--lens-x', `${((event.clientX - box.left) / box.width - .5) * 160}px`);
    stage.current.style.setProperty('--lens-y', `${((event.clientY - box.top) / box.height - .5) * 90}px`);
  };
  return <>
    <div className="stage glass-stage" data-capture="glass" ref={stage} onPointerMove={move}>
      <canvas ref={canvas} width="1100" height="620" className="glass-backdrop" aria-hidden="true" />
      <div className="glass-lens">
        <GlassSurface width="100%" height={200} borderRadius={44} borderWidth={.14}
          backdrop={canvas} renderer="webgl" distortionScale={-130} displace={.6}
          backgroundOpacity={.06} saturation={1.1} redOffset={0} greenOffset={8} blueOffset={16}>
          <span className="glass-name">Shuwei-Goat</span>
        </GlassSurface>
      </div>
    </div>
    <div className="controls" aria-label="玻璃面板配色">
      {Object.entries({ mint: '薄荷', cream: '奶黄', lilac: '淡紫' }).map(([key, label]) =>
        <button key={key} aria-pressed={tint === key} onClick={() => setTint(key)}>{label}</button>)}
    </div>
  </>;
}

const galleryItems = ['sage', 'cream', 'lilac', 'rainbow'].map(name => ({
  image: asset(`goat-${name}.png`), text: name.toUpperCase(), alt: `彩虹羊 · ${name}`,
}));

function App() {
  const [theme, setTheme] = useState(() =>
    new URLSearchParams(location.search).get('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const [paused, setPaused] = useState(false);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  return <>
    <header>
      <a className="brand" href="https://github.com/Shuwei-Goat"><img src={goat} alt="" />Shuwei-Goat</a>
      <nav aria-label="效果导航"><a href="#profile">角色卡</a><a href="#glass">玻璃面板</a><a href="#gallery">环形画廊</a></nav>
      <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? '深色' : '浅色'}
      </button>
    </header>
    <main>
      <h1>React Bits</h1>
      <section id="profile">
        <h2>Profile Card <span>全息角色卡</span></h2>
        <div className="stage profile-stage" data-capture="profile">
          <div className="orbital orbital-one" /><div className="orbital orbital-two" />
          <ProfileCard avatarUrl={goat} name="Shuwei-Goat" title="" handle="" status="" contactText=""
            showUserInfo={false} theme="light" backdropColor="#DCD9A9" radius={24}
            holo={.85} glare={.65} tiltStrength={15} parallax={12} intro={!reduced} />
        </div>
      </section>
      <section id="glass">
        <h2>Glass Surface <span>折射玻璃</span></h2>
        <GlassScene />
      </section>
      <section id="gallery">
        <h2>Circular Gallery <span>环形画廊</span></h2>
        <div className="stage gallery-stage" data-capture="gallery">
          <CircularGallery items={galleryItems} bend={2.6} textColor={theme === 'light' ? '#314B40' : '#E7EACD'}
            font="600 24px Arial" borderRadius={.06} scrollSpeed={1.5} scrollEase={.05}
            itemSize={.8} itemAspect={.8} gap={.2} wave={.5} autoScroll={paused || reduced ? 0 : .6}
            intro={!reduced} showTitles={false} aria-label="彩虹羊配色画廊，使用左右方向键切换" />
        </div>
        <div className="controls"><button onClick={() => setPaused(!paused)} aria-pressed={paused}>
          {paused ? '播放' : '暂停'}
        </button></div>
      </section>
    </main>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
