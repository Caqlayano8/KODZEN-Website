// KODZEN TEKNOLOJİ — Page Transition Engine
(function() {
  const THEMES = {
    'index.html':         { label: 'Ana Sayfa',       code: ['$ cd /home', '✔ Dashboard yüklendi'],      color: '#00c4a0' },
    'ai-gis.html':        { label: 'AI-GIS System',   code: ['import gis', '✔ Harita hazır'],             color: '#60a5fa' },
    'ckmesaj.html':       { label: 'CKmesaj',         code: ['socket.connect()', '✔ Realtime aktif'],     color: '#a78bfa' },
    'whatsypzck.html':    { label: 'WhatsYpzck',      code: ['bot.init(ai="GPT")', '✔ AI online'],        color: '#34d399' },
    'galeri.html':        { label: 'Galeri',           code: ['render.gallery()', '✔ Medya yüklendi'],    color: '#fbbf24' },
    'demo.html':          { label: 'Demo',             code: ['demo.start()', '✔ Form hazır'],            color: '#f472b6' },
    'iletisim.html':      { label: 'İletişim',         code: ['contact.open()', '✔ Kanal açık'],          color: '#00c4a0' },
    'webgelistirme.html': { label: 'Web Hizmetleri',  code: ['web.build(ai=True)', '✔ SEO aktif'],       color: '#38bdf8' },
    'fiyatlar.html':      { label: 'Fiyatlar',         code: ['pricing.load()', '✔ Planlar yüklendi'],   color: '#fb923c' },
    'siberguvenik.html':  { label: 'Siber Güvenlik',  code: ['sec.scan()', '✔ Kalkan aktif'],            color: '#f43f5e' },
  };

  // Inject styles
  const s = document.createElement('style');
  s.textContent = `
  :root{--ptc:#00c4a0}
  #kodzenPT{position:fixed;inset:0;z-index:999999;background:#080c14;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .2s ease}
  #kodzenPT.on{opacity:1;pointer-events:all}
  .pt-bg{position:absolute;inset:0;background-image:linear-gradient(rgba(0,196,160,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,196,160,.04) 1px,transparent 1px);background-size:50px 50px}
  .pt-scan{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--ptc),transparent);animation:ptsc 1s linear infinite;opacity:.6}
  @keyframes ptsc{0%{top:0}100%{top:100%}}
  #ptCvs{position:absolute;inset:0;pointer-events:none}
  .pt-inner{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:14px;width:min(480px,90vw)}
  .pt-term{width:100%;background:rgba(22,29,46,.96);border:1px solid rgba(0,196,160,.2);border-radius:12px;overflow:hidden}
  .pt-th{display:flex;align-items:center;gap:6px;padding:9px 14px;background:rgba(0,0,0,.3);border-bottom:1px solid rgba(255,255,255,.05)}
  .pt-dot{width:10px;height:10px;border-radius:50%}
  .pt-ttl{font-family:'JetBrains Mono',monospace;font-size:.7rem;color:#4b5563;margin-left:8px}
  .pt-tb{padding:12px 16px;font-family:'JetBrains Mono',monospace;font-size:.8rem;color:#e2e8f0;min-height:65px}
  .pt-line{opacity:0;animation:ptli .2s ease forwards;line-height:1.7}
  @keyframes ptli{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:none}}
  .pt-logo{font-family:'JetBrains Mono',monospace;font-size:clamp(1.4rem,4vw,2.2rem);font-weight:900;color:#fff;letter-spacing:3px}
  .pt-dest{font-size:.72rem;letter-spacing:4px;text-transform:uppercase;color:var(--ptc);font-weight:700}
  .pt-bw{width:100%;height:3px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden}
  .pt-bf{height:100%;width:0;background:linear-gradient(90deg,var(--ptc),#00ffe7);border-radius:3px;box-shadow:0 0 8px var(--ptc);transition:width .04s linear}
  `;
  document.head.appendChild(s);

  // Build overlay
  const el = document.createElement('div');
  el.id = 'kodzenPT';
  el.innerHTML = `<div class="pt-bg"></div><div class="pt-scan"></div><canvas id="ptCvs"></canvas>
  <div class="pt-inner">
    <div class="pt-term">
      <div class="pt-th"><div class="pt-dot" style="background:#ff5f57"></div><div class="pt-dot" style="background:#febc2e"></div><div class="pt-dot" style="background:#28c840"></div><span class="pt-ttl">kodzen_router.sh</span></div>
      <div class="pt-tb" id="ptTB"></div>
    </div>
    <div class="pt-logo">KODZEN <span id="ptBr" style="color:var(--ptc)">{🧠}</span></div>
    <div class="pt-dest" id="ptDest">Yükleniyor...</div>
    <div class="pt-bw"><div class="pt-bf" id="ptBF"></div></div>
  </div>`;
  document.body.appendChild(el);

  let raf;
  function particles(color) {
    const cv = document.getElementById('ptCvs');
    const cx = cv.getContext('2d');
    cv.width = innerWidth; cv.height = innerHeight;
    const pp = Array.from({length:50},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.5+.3,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,a:Math.random()*.35+.1}));
    if(raf) cancelAnimationFrame(raf);
    (function draw(){cx.clearRect(0,0,cv.width,cv.height);pp.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>cv.width)p.vx*=-1;if(p.y<0||p.y>cv.height)p.vy*=-1;cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);cx.fillStyle=color;cx.globalAlpha=p.a;cx.fill();cx.globalAlpha=1});raf=requestAnimationFrame(draw)})();
  }

  function go(href, theme) {
    const t = theme || {label:href.split('/').pop(),code:['Yükleniyor...'],color:'#00c4a0'};
    document.documentElement.style.setProperty('--ptc', t.color);
    document.getElementById('ptDest').textContent = '→ ' + t.label;
    const tb = document.getElementById('ptTB'); tb.innerHTML='';
    const lines = [`<span style="color:${t.color}">›</span> $ goto ${href.split('/').pop()}`, ...t.code.map(l=>`<span style="color:#94a3b8">${l}</span>`), `<span style="color:#28c840">✔</span> Hazır`];
    lines.forEach((ln,i)=>setTimeout(()=>{const d=document.createElement('div');d.className='pt-line';d.innerHTML=ln;tb.appendChild(d)},i*170));
    el.classList.add('on');
    particles(t.color);
    const bf=document.getElementById('ptBF'); bf.style.width='0';
    let w=0;const iv=setInterval(()=>{w=Math.min(100,w+100/(780/14));bf.style.width=w+'%';if(w>=100)clearInterval(iv)},14);
    setTimeout(()=>{cancelAnimationFrame(raf);window.location.href=href},820);
  }

  document.addEventListener('click',function(e){
    const a=e.target.closest('a');
    if(!a) return;
    const h=a.getAttribute('href');
    if(!h||h.startsWith('http')||h.startsWith('#')||h.startsWith('tel:')||h.startsWith('mailto:')||h.includes('admin/')) return;
    const key=h.split('/').pop()||'index.html';
    e.preventDefault();
    go(h, THEMES[key]);
  });
})();
