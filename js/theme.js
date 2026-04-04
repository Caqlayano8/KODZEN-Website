/**
 * KODZEN TEKNOLOJİ — Tema Sistemi
 * Haftanın gününe göre otomatik tema seçimi.
 * Admin panelinden localStorage ile override edilebilir.
 */
(function () {
  // 0=Paz, 1=Pzt, 2=Sal, 3=Çar, 4=Per, 5=Cum, 6=Cmt
  const DAY_THEMES = [
    'cosmic-purple',   // Pazar  — Kozmik Mor (yapay zeka, uzay)
    'matrix',          // Pazartesi — Matrix Yeşil (kod, terminal)
    'midnight-blue',   // Salı  — Gece Mavisi (kurumsal derin)
    'light-pro',       // Çarşamba — Kurumsal Açık (temiz, profesyonel)
    'crimson',         // Perşembe — Kızıl Enerji (güç, dinamizm)
    'cyber-gold',      // Cuma  — Siber Altın (premium)
    'default',         // Cumartesi — KODZEN Teal (ana tema)
  ];

  const THEME_NAMES = {
    'default':        'KODZEN Teal',
    'matrix':         'Matrix Yeşil',
    'midnight-blue':  'Gece Mavisi',
    'light-pro':      'Kurumsal Açık',
    'crimson':        'Kızıl Enerji',
    'cyber-gold':     'Siber Altın',
    'cosmic-purple':  'Kozmik Mor',
  };

  const THEME_COLORS = {
    'default':        '#00c4a0',
    'matrix':         '#00ff41',
    'midnight-blue':  '#3b82f6',
    'light-pro':      '#0066cc',
    'crimson':        '#ef4444',
    'cyber-gold':     '#f59e0b',
    'cosmic-purple':  '#a855f7',
  };

  const day = new Date().getDay();
  const override = localStorage.getItem('kodzen_theme_override');
  const activeTheme = override || DAY_THEMES[day];

  // Apply theme immediately (before render to avoid flash)
  if (activeTheme && activeTheme !== 'default') {
    document.documentElement.setAttribute('data-theme', activeTheme);
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  // Expose globally for admin panel
  window.KODZEN_THEMES = {
    DAY_THEMES,
    THEME_NAMES,
    THEME_COLORS,
    active: activeTheme,
    day,

    setTheme: function (theme) {
      if (theme === 'auto') {
        localStorage.removeItem('kodzen_theme_override');
        const autoTheme = DAY_THEMES[new Date().getDay()];
        if (autoTheme && autoTheme !== 'default') {
          document.documentElement.setAttribute('data-theme', autoTheme);
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
        window.KODZEN_THEMES.active = autoTheme;
      } else {
        localStorage.setItem('kodzen_theme_override', theme);
        if (theme && theme !== 'default') {
          document.documentElement.setAttribute('data-theme', theme);
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
        window.KODZEN_THEMES.active = theme;
      }
    },

    getActiveThemeName: function () {
      const t = window.KODZEN_THEMES.active;
      return THEME_NAMES[t] || 'KODZEN Teal';
    },

    isOverridden: function () {
      return !!localStorage.getItem('kodzen_theme_override');
    }
  };
})();

(function () {
  const SUBS_KEY = 'kodzen_newsletter_subscribers';
  const PROFILE_KEY = 'kodzen_newsletter_profile';
  const TOPICS_KEY = 'kodzen_news_topics';

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function currentPage() {
    return (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  }

  function patchString(value) {
    if (!value) return value;
    const charMap = [
      ['Ã¼', 'ü'], ['Ãœ', 'Ü'], ['Ã¶', 'ö'], ['Ã–', 'Ö'],
      ['ÄŸ', 'ğ'], ['Äž', 'Ğ'], ['ÅŸ', 'ş'], ['Åž', 'Ş'],
      ['Ä±', 'ı'], ['Ä°', 'İ'], ['Ã§', 'ç'], ['Ã‡', 'Ç'],
      ['â€”', '—'], ['â€“', '–'], ['â€˜', '‘'], ['â€™', '’'],
      ['â€œ', '“'], ['â€', '”']
    ];
    const phraseMap = [
      ['ï¿½rï¿½nler', 'Ürünler'], ['ï¿½letiï¿½im', 'İletişim'], ['Siparï¿½m', 'Siparım'],
      ['Tï¿½rkiye', 'Türkiye'], ['Gï¿½venlik', 'Güvenlik'], ['Yazï¿½lï¿½m', 'Yazılım'],
      ['ï¿½ï¿½zï¿½mleri', 'Çözümleri'], ['Doï¿½rulama', 'Doğrulama'], ['TEKNOLOJï¿½', 'TEKNOLOJİ'],
      ['ï¿½cretsiz', 'ücretsiz'], ['gï¿½nlï¿½k', 'günlük'], ['Keï¿½fet', 'Keşfet'],
      ['Yï¿½l', 'Yıl'], ['ï¿½rï¿½n', 'Ürün'], ['Gï¿½rï¿½ntï¿½leri', 'Görüntüleri']
    ];

    let next = value;
    charMap.forEach(([bad, good]) => { next = next.split(bad).join(good); });
    phraseMap.forEach(([bad, good]) => { next = next.split(bad).join(good); });
    return next;
  }

  function repairMojibake() {
    document.title = patchString(document.title);

    document.querySelectorAll('meta[content]').forEach(meta => {
      meta.setAttribute('content', patchString(meta.getAttribute('content')));
    });

    const walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      const fixed = patchString(node.nodeValue);
      if (fixed !== node.nodeValue) node.nodeValue = fixed;
      node = walker.nextNode();
    }

    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
      const ph = el.getAttribute('placeholder');
      el.setAttribute('placeholder', patchString(ph));
    });
  }

  function buildNavbar() {
    const nav = document.querySelector('#mainNavbar .navbar-nav.mx-auto');
    if (!nav) return;

    const path = currentPage();
    const activeMap = {
      'index.html': 'index.html',
      'robotik-kodlama.html': 'robotik-kodlama.html',
      'teknoloji-blog.html': 'teknoloji-blog.html',
      'webgelistirme.html': 'webgelistirme.html',
      'siberguvenik.html': 'siberguvenik.html',
      'scada.html': 'scada.html',
      'fiyatlar.html': 'fiyatlar.html',
      'demo.html': 'demo.html',
      'iletisim.html': 'iletisim.html',
      'ai-gis.html': 'urunler',
      'ckmesaj.html': 'urunler',
      'whatsypzck.html': 'urunler',
      'viralbotpro.html': 'urunler',
      'siparis.html': 'urunler'
    };

    const active = activeMap[path] || '';
    const isProducts = active === 'urunler';

    nav.innerHTML = [
      '<li class="nav-item"><a class="nav-link' + (active === 'index.html' ? ' active' : '') + '" href="index.html">Ana Sayfa</a></li>',
      '<li class="nav-item dropdown">',
      '  <a class="nav-link dropdown-toggle' + (isProducts ? ' active' : '') + '" href="#" data-bs-toggle="dropdown">Ürünler</a>',
      '  <ul class="dropdown-menu">',
      '    <li><a class="dropdown-item' + (path === 'ai-gis.html' ? ' active' : '') + '" href="ai-gis.html"><i class="bi bi-map me-2 text-primary-kodzen"></i>AI-GIS Infrastructure</a></li>',
      '    <li><a class="dropdown-item' + (path === 'ckmesaj.html' ? ' active' : '') + '" href="ckmesaj.html"><i class="bi bi-chat-dots me-2 text-primary-kodzen"></i>CKmesaj</a></li>',
      '    <li><a class="dropdown-item' + (path === 'whatsypzck.html' ? ' active' : '') + '" href="whatsypzck.html"><i class="bi bi-whatsapp me-2 text-primary-kodzen"></i>WhatsYpzck</a></li>',
      '    <li><a class="dropdown-item' + (path === 'viralbotpro.html' ? ' active' : '') + '" href="viralbotpro.html"><i class="bi bi-play-circle me-2 text-primary-kodzen"></i>ViralBot Pro</a></li>',
      '    <li><a class="dropdown-item' + (path === 'siparis.html' ? ' active' : '') + '" href="siparis.html"><i class="bi bi-bag-heart me-2" style="color:#f7931e"></i>Siparım — Yemek Platformu</a></li>',
      '  </ul>',
      '</li>',
      '<li class="nav-item"><a class="nav-link' + (active === 'robotik-kodlama.html' ? ' active' : '') + '" href="robotik-kodlama.html">Robotik Kodlama</a></li>',
      '<li class="nav-item"><a class="nav-link' + (active === 'teknoloji-blog.html' ? ' active' : '') + '" href="teknoloji-blog.html">Teknoloji Blog</a></li>',
      '<li class="nav-item"><a class="nav-link' + (active === 'webgelistirme.html' ? ' active' : '') + '" href="webgelistirme.html">Web Hizmetleri</a></li>',
      '<li class="nav-item"><a class="nav-link' + (active === 'siberguvenik.html' ? ' active' : '') + '" href="siberguvenik.html">Siber Güvenlik</a></li>',
      '<li class="nav-item"><a class="nav-link' + (active === 'scada.html' ? ' active' : '') + '" href="scada.html">SCADA</a></li>',
      '<li class="nav-item"><a class="nav-link' + (active === 'fiyatlar.html' ? ' active' : '') + '" href="fiyatlar.html">Fiyatlar</a></li>',
      '<li class="nav-item"><a class="nav-link' + (active === 'demo.html' ? ' active' : '') + '" href="demo.html">Demo</a></li>',
      '<li class="nav-item"><a class="nav-link' + (active === 'iletisim.html' ? ' active' : '') + '" href="iletisim.html">İletişim</a></li>'
    ].join('');
  }

  function ensureNewsletterStyles() {
    if (document.getElementById('kzNewsletterStyle')) return;
    const style = document.createElement('style');
    style.id = 'kzNewsletterStyle';
    style.textContent = [
      '.kz-news-wrap{margin:56px auto 28px;max-width:1180px;padding:0 12px}',
      '.kz-news-box{border:1px solid rgba(189,140,255,.28);border-radius:18px;padding:28px;background:linear-gradient(145deg,rgba(8,8,27,.95),rgba(14,6,34,.9));box-shadow:0 18px 52px rgba(10,2,22,.42)}',
      '.kz-news-badge{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(200,142,255,.35);border-radius:999px;padding:8px 14px;font-size:.78rem;color:#d7a8ff;background:rgba(130,50,190,.12);margin-bottom:14px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}',
      '.kz-news-title{font-size:clamp(1.6rem,4vw,3rem);font-weight:900;line-height:1.15;color:#f4ecff;margin:0 0 10px}',
      '.kz-news-title span{color:#d878ff}',
      '.kz-news-desc{color:#c6bddd;font-size:1.05rem;margin:0 0 12px}',
      '.kz-news-form{display:flex;flex-wrap:wrap;gap:10px;align-items:center}',
      '.kz-news-input{min-width:260px;flex:1;background:rgba(7,6,20,.8);border:1px solid rgba(158,119,255,.45);color:#efe9ff;border-radius:10px;padding:11px 12px;font-size:1rem}',
      '.kz-news-btn{border:1px solid rgba(193,140,255,.52);background:linear-gradient(135deg,#8d32f0,#b151ff);color:#fff;border-radius:10px;padding:10px 16px;font-weight:700}',
      '.kz-news-note{font-size:.83rem;color:#b7abd2;margin-top:8px}',
      '.kz-news-bell{position:fixed;right:14px;bottom:18px;z-index:1090;width:48px;height:48px;border-radius:50%;border:1px solid rgba(210,162,255,.55);background:linear-gradient(145deg,#2a0d4d,#581f8c);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 14px 35px rgba(43,7,84,.5);cursor:pointer}',
      '.kz-news-count{position:absolute;top:-4px;right:-3px;background:#ff4d9d;color:#fff;border-radius:999px;min-width:20px;height:20px;font-size:.72rem;display:flex;align-items:center;justify-content:center;padding:0 5px;font-weight:700}',
      '.kz-news-panel{position:fixed;right:14px;bottom:74px;z-index:1090;width:min(420px,calc(100vw - 28px));max-height:58vh;overflow:auto;border:1px solid rgba(210,162,255,.45);border-radius:14px;background:rgba(11,6,26,.97);padding:12px;display:none}',
      '.kz-news-item{border:1px solid rgba(163,126,236,.3);border-radius:10px;padding:10px;margin-bottom:8px;background:rgba(255,255,255,.02)}',
      '.kz-news-item:last-child{margin-bottom:0}',
      '.kz-news-item h6{margin:0 0 4px;color:#f4ecff;font-size:.95rem}',
      '.kz-news-item p{margin:0 0 6px;color:#cabde6;font-size:.84rem}',
      '.kz-news-item a{color:#c78cff;font-size:.82rem;text-decoration:none}'
    ].join('');
    document.head.appendChild(style);
  }

  function upsertSubscriber(email) {
    const subscribers = readJson(SUBS_KEY, []);
    const now = new Date().toISOString();
    const idx = subscribers.findIndex(s => (s.email || '').toLowerCase() === email.toLowerCase());

    if (idx === -1) {
      subscribers.unshift({
        id: Date.now(),
        email,
        active: true,
        source: currentPage(),
        createdAt: now,
        updatedAt: now,
        lastSeenTopicTs: 0
      });
    } else {
      subscribers[idx].active = true;
      subscribers[idx].updatedAt = now;
      subscribers[idx].source = currentPage();
    }

    writeJson(SUBS_KEY, subscribers);
    writeJson(PROFILE_KEY, { email, updatedAt: now });
  }

  function renderNewsletterSection() {
    if (document.getElementById('kzNewsletterSection')) return;
    const section = document.createElement('section');
    section.id = 'kzNewsletterSection';
    section.className = 'kz-news-wrap';
    section.innerHTML = [
      '<div class="kz-news-box">',
      '  <div class="kz-news-badge"><i class="bi bi-envelope"></i> Topluluğa Katıl</div>',
      '  <h2 class="kz-news-title">Yeni modüller ve projeler için <span>haberdar ol</span></h2>',
      '  <p class="kz-news-desc">GitHub, iletişim ve bülten üzerinden yeni eğitim içeriklerini takip edebilirsin.</p>',
      '  <form id="kzNewsletterForm" class="kz-news-form">',
      '    <input id="kzNewsletterEmail" class="kz-news-input" type="email" placeholder="E-posta adresiniz" required>',
      '    <button class="kz-news-btn" type="submit">Bültene Katıl</button>',
      '  </form>',
      '  <div id="kzNewsletterMsg" class="kz-news-note">Yeni konu yayınlandığında sitede bildirim göreceksiniz.</div>',
      '</div>'
    ].join('');

    document.body.appendChild(section);

    const form = document.getElementById('kzNewsletterForm');
    const msg = document.getElementById('kzNewsletterMsg');
    form?.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = (document.getElementById('kzNewsletterEmail')?.value || '').trim();
      if (!email) return;
      upsertSubscriber(email);
      msg.textContent = 'Başarılı: Bültene eklendiniz. Yeni konularda bildirim alacaksınız.';
      form.reset();
      renderNotificationCenter();
    });
  }

  function renderNotificationCenter() {
    const profile = readJson(PROFILE_KEY, null);
    const email = profile?.email || '';
    if (!email) return;

    const topics = readJson(TOPICS_KEY, []);
    const seenKey = 'kodzen_news_seen_' + encodeURIComponent(email);
    const seenTs = parseInt(localStorage.getItem(seenKey) || '0', 10) || 0;
    const unread = topics.filter(t => (t.timestamp || 0) > seenTs);

    let bell = document.getElementById('kzNewsBell');
    let panel = document.getElementById('kzNewsPanel');

    if (!bell) {
      bell = document.createElement('button');
      bell.id = 'kzNewsBell';
      bell.className = 'kz-news-bell';
      bell.type = 'button';
      bell.innerHTML = '<i class="bi bi-bell-fill"></i><span id="kzNewsCount" class="kz-news-count">0</span>';
      document.body.appendChild(bell);
    }

    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'kzNewsPanel';
      panel.className = 'kz-news-panel';
      document.body.appendChild(panel);
    }

    const countEl = document.getElementById('kzNewsCount');
    countEl.textContent = String(unread.length);
    countEl.style.display = unread.length ? 'flex' : 'none';

    panel.innerHTML = topics.length
      ? topics.slice().reverse().map(t => `
          <div class="kz-news-item">
            <h6>${(t.title || '').replace(/</g, '&lt;')}</h6>
            <p>${(t.summary || '').replace(/</g, '&lt;')}</p>
            <a href="${t.url || 'teknoloji-blog.html'}">Konuyu Aç</a>
          </div>`).join('')
      : '<div class="kz-news-item"><h6>Henüz bildirim yok</h6><p>Yeni konular eklendikçe burada görünecek.</p></div>';

    bell.onclick = function () {
      const isOpen = panel.style.display === 'block';
      panel.style.display = isOpen ? 'none' : 'block';
      if (!isOpen && topics.length) {
        const latestTs = topics.reduce((m, t) => Math.max(m, t.timestamp || 0), 0);
        localStorage.setItem(seenKey, String(latestTs));
        countEl.textContent = '0';
        countEl.style.display = 'none';
      }
    };
  }

  function initSiteEnhancements() {
    repairMojibake();
    buildNavbar();
    ensureNewsletterStyles();
    renderNewsletterSection();
    renderNotificationCenter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiteEnhancements);
  } else {
    initSiteEnhancements();
  }
})();
