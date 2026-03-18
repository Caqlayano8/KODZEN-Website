/**
 * KODZEN TEKNOLOJİ — Günlük Sayfa Geçiş & Intro Animasyonları
 * Her gün farklı açılış intros + farklı sayfa geçiş animasyonu
 * 
 * Paz(0): Matrix yağmur intro — fade-through-black geçiş
 * Pzt(1): Glitch efekti intro — slide-from-right geçiş
 * Sal(2): Parçacık patlaması — zoom-in geçiş
 * Çar(3): Işık süpürme (Light sweep) — slide-up geçiş
 * Per(4): Alev efekti — diagonal wipe geçiş
 * Cum(5): Altın parçacıklar — fade-scale geçiş
 * Cmt(6): Teal dalgası (varsayılan) — morphing geçiş
 */
(function () {
  'use strict';
  if (window.location.pathname.includes('/admin/')) return;

  const DOW = new Date().getDay();

  // ── Day config ──
  const DAY_CONFIG = {
    0: { name: 'cosmic-purple', color: '#a855f7', intro: 'matrix',    transition: 'fade-black'    },
    1: { name: 'matrix',        color: '#00ff41', intro: 'glitch',    transition: 'slide-right'   },
    2: { name: 'midnight-blue', color: '#3b82f6', intro: 'particles', transition: 'zoom'          },
    3: { name: 'light-pro',     color: '#0066cc', intro: 'sweep',     transition: 'slide-up'      },
    4: { name: 'crimson',       color: '#ef4444', intro: 'flame',     transition: 'diagonal'      },
    5: { name: 'cyber-gold',    color: '#f59e0b', intro: 'gold',      transition: 'fade-scale'    },
    6: { name: 'default',       color: '#00c4a0', intro: 'wave',      transition: 'morph'         },
  };

  const cfg = DAY_CONFIG[DOW];

  // ── Page exit transition styles ──
  const transitionCSS = {
    'fade-black':  `@keyframes kzExit{0%{opacity:1}100%{opacity:0;background:#000}}
                    @keyframes kzEnter{0%{opacity:0}100%{opacity:1}}`,
    'slide-right': `@keyframes kzExit{0%{transform:translateX(0);opacity:1}100%{transform:translateX(-60px);opacity:0}}
                    @keyframes kzEnter{0%{transform:translateX(60px);opacity:0}100%{transform:translateX(0);opacity:1}}`,
    'zoom':        `@keyframes kzExit{0%{transform:scale(1);opacity:1}100%{transform:scale(1.08);opacity:0}}
                    @keyframes kzEnter{0%{transform:scale(0.94);opacity:0}100%{transform:scale(1);opacity:1}}`,
    'slide-up':    `@keyframes kzExit{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-50px);opacity:0}}
                    @keyframes kzEnter{0%{transform:translateY(50px);opacity:0}100%{transform:translateY(0);opacity:1}}`,
    'diagonal':    `@keyframes kzExit{0%{clip-path:polygon(0 0,100% 0,100% 100%,0 100%);opacity:1}
                     100%{clip-path:polygon(100% 0,100% 0,100% 100%,100% 100%);opacity:0}}
                    @keyframes kzEnter{0%{clip-path:polygon(0 0,0 0,0 100%,0 100%);opacity:.3}
                     100%{clip-path:polygon(0 0,100% 0,100% 100%,0 100%);opacity:1}}`,
    'fade-scale':  `@keyframes kzExit{0%{transform:scale(1) rotate(0deg);opacity:1}
                     100%{transform:scale(.97) rotate(-.5deg);opacity:0}}
                    @keyframes kzEnter{0%{transform:scale(1.02) rotate(.5deg);opacity:0}
                     100%{transform:scale(1) rotate(0deg);opacity:1}}`,
    'morph':       `@keyframes kzExit{0%{opacity:1;filter:blur(0)}100%{opacity:0;filter:blur(8px)}}
                    @keyframes kzEnter{0%{opacity:0;filter:blur(8px)}100%{opacity:1;filter:blur(0)}}`,
  };

  // ── Inject page enter animation ──
  const css = `
    ${transitionCSS[cfg.transition] || transitionCSS['morph']}
    body.kz-page-enter { animation: kzEnter 0.5s cubic-bezier(.22,1,.36,1) both; }
    body.kz-page-exit  { animation: kzExit  0.35s ease-in both; pointer-events:none; }
    a[href]:not([href^="#"]):not([href^="javascript"]):not([target="_blank"]).kz-transition-handled {}
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── Apply enter animation on load ──
  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('kz-page-enter');
    setTimeout(() => document.body.classList.remove('kz-page-enter'), 600);
  });

  // ── Exit animation on internal link clicks ──
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript') || href.startsWith('mailto') || href.startsWith('tel')) return;
    if (a.target === '_blank') return;
    if (href.startsWith('http') && !href.includes('kodzen.io') && !href.includes(window.location.hostname)) return;

    e.preventDefault();
    document.body.classList.add('kz-page-exit');
    setTimeout(() => { window.location.href = href; }, 380);
  });

  // ── Day-specific INTRO ANIMATION ──
  function runIntro() {
    // Skip intro if already seen this session
    const introKey = 'kzIntro_' + DOW + '_' + new Date().toDateString();
    if (sessionStorage.getItem(introKey)) return;
    sessionStorage.setItem(introKey, '1');

    const intros = {
      // Matrix: falling green characters
      matrix: function () {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;pointer-events:none;';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const cols = Math.floor(canvas.width / 16);
        const drops = Array(cols).fill(1);
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789コドゼン人工知能';
        let frame = 0;
        const interval = setInterval(() => {
          ctx.fillStyle = 'rgba(0,0,0,0.05)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#00ff41';
          ctx.font = '14px monospace';
          drops.forEach((y, i) => {
            const ch = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(ch, i * 16, y * 16);
            if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
          });
          frame++;
          if (frame > 80) {
            clearInterval(interval);
            canvas.style.transition = 'opacity 1s';
            canvas.style.opacity = '0';
            setTimeout(() => canvas.remove(), 1000);
          }
        }, 33);
      },

      // Glitch: screen glitch effect
      glitch: function () {
        const overlay = document.createElement('div');
        overlay.style.cssText = `position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;pointer-events:none;
          background:${cfg.color};mix-blend-mode:multiply;`;
        document.body.appendChild(overlay);
        let flicker = 0;
        const gi = setInterval(() => {
          flicker++;
          const on = flicker % 2 === 0;
          overlay.style.opacity = on ? (Math.random() * 0.4 + 0.1).toString() : '0';
          overlay.style.transform = on ? `skewX(${(Math.random()-0.5)*2}deg) translateX(${(Math.random()-0.5)*8}px)` : '';
          if (flicker > 20) { clearInterval(gi); overlay.remove(); }
        }, 50);
      },

      // Particles: burst from center
      particles: function () {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;pointer-events:none;';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const cx = canvas.width / 2, cy = canvas.height / 2;
        const particles = Array.from({length: 60}, () => ({
          x: cx, y: cy,
          vx: (Math.random()-0.5)*12, vy: (Math.random()-0.5)*12,
          size: Math.random()*4+2, alpha: 1,
          color: ['#3b82f6','#60a5fa','#93c5fd','#fff'][Math.floor(Math.random()*4)]
        }));
        let frame = 0;
        function draw() {
          ctx.clearRect(0,0,canvas.width,canvas.height);
          particles.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.alpha -= 0.015; p.vy += 0.1;
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
            ctx.fill();
          });
          frame++;
          if (frame < 100) requestAnimationFrame(draw);
          else { canvas.style.transition='opacity .5s'; canvas.style.opacity='0'; setTimeout(()=>canvas.remove(),500); }
        }
        draw();
      },

      // Light sweep: white/blue sweep across screen
      sweep: function () {
        const overlay = document.createElement('div');
        overlay.style.cssText = `position:fixed;top:0;left:-100vw;width:60vw;height:100vh;z-index:99999;
          pointer-events:none;background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent);
          transition:transform 0.8s cubic-bezier(.4,0,.2,1);`;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => {
          overlay.style.transform = 'translateX(250vw)';
          setTimeout(() => overlay.remove(), 900);
        });
      },

      // Flame: orange/red glow from bottom
      flame: function () {
        const overlay = document.createElement('div');
        overlay.style.cssText = `position:fixed;bottom:-100%;left:0;width:100vw;height:100vh;z-index:99999;
          pointer-events:none;
          background:radial-gradient(ellipse at 50% 120%,rgba(239,68,68,.6) 0%,rgba(251,146,60,.3) 40%,transparent 70%);
          transition:all 0.6s cubic-bezier(.4,0,.2,1);`;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => {
          overlay.style.bottom = '0';
          overlay.style.opacity = '1';
          setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 600);
          }, 600);
        });
      },

      // Gold particles: sparkle rain
      gold: function () {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;pointer-events:none;';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        const sparks = Array.from({length:50},()=>({
          x: Math.random()*canvas.width, y: -10,
          vy: Math.random()*3+1, vx: (Math.random()-0.5)*1.5,
          size: Math.random()*3+1, alpha: 1,
        }));
        let frame = 0;
        function draw() {
          ctx.clearRect(0,0,canvas.width,canvas.height);
          sparks.forEach(p => {
            p.y += p.vy; p.x += p.vx; p.alpha = Math.max(0, 1 - p.y/canvas.height);
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = '#f59e0b';
            ctx.shadowBlur = 6; ctx.shadowColor = '#fbbf24';
            ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
          });
          frame++;
          if (frame < 90) requestAnimationFrame(draw);
          else { canvas.style.transition='opacity .5s'; canvas.style.opacity='0'; setTimeout(()=>canvas.remove(),500); }
        }
        draw();
      },

      // Wave: teal wave from left
      wave: function () {
        const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;pointer-events:none;';
        svg.setAttribute('viewBox','0 0 100 100');
        svg.setAttribute('preserveAspectRatio','none');
        svg.innerHTML = `<path id="kzWave" fill="${cfg.color}" opacity="0.25" d="M0,0 Q25,50 50,50 Q75,50 100,0 L100,100 L0,100 Z"/>`;
        document.body.appendChild(svg);
        const path = svg.querySelector('#kzWave');
        let t = 0;
        const anim = setInterval(() => {
          t += 0.05;
          const mid = 50 + Math.sin(t)*20;
          path.setAttribute('d', `M0,0 Q25,${mid} 50,50 Q75,${100-mid} 100,0 L100,100 L0,100 Z`);
          path.style.opacity = String(0.25 - t*0.01);
          if (t > 25) { clearInterval(anim); svg.remove(); }
        }, 30);
      }
    };

    // Run the day's intro (after short delay)
    setTimeout(() => {
      const introFn = intros[cfg.intro];
      if (introFn) introFn();
    }, 200);
  }

  // Run intro on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runIntro);
  } else {
    runIntro();
  }

})();
