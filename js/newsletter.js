(function () {
  var SUBS_KEY = 'kodzen_newsletter_subscribers';
  var PROFILE_KEY = 'kodzen_newsletter_profile';
  var TOPICS_KEY = 'kodzen_news_topics';

  function readJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function upsertSubscriber(email) {
    var subscribers = readJson(SUBS_KEY, []);
    var now = new Date().toISOString();
    var idx = subscribers.findIndex(function (s) {
      return (s.email || '').toLowerCase() === email.toLowerCase();
    });

    if (idx === -1) {
      subscribers.unshift({
        id: Date.now(),
        email: email,
        active: true,
        source: (window.location.pathname.split('/').pop() || 'index.html'),
        createdAt: now,
        updatedAt: now,
        lastSeenTopicTs: 0
      });
    } else {
      subscribers[idx].active = true;
      subscribers[idx].updatedAt = now;
      subscribers[idx].source = (window.location.pathname.split('/').pop() || 'index.html');
    }

    writeJson(SUBS_KEY, subscribers);
    writeJson(PROFILE_KEY, {
      email: email,
      updatedAt: now
    });
  }

  function ensureStyles() {
    if (document.getElementById('kzNewsletterStyle')) return;
    var style = document.createElement('style');
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
      '.kz-news-item a{color:#c78cff;font-size:.82rem;text-decoration:none}',
      '@media (max-width:768px){.kz-news-box{padding:20px}.kz-news-title{font-size:2rem}}'
    ].join('');
    document.head.appendChild(style);
  }

  function renderNewsletterBlock() {
    if (document.getElementById('kzNewsletterSection')) return;
    var host = document.createElement('section');
    host.id = 'kzNewsletterSection';
    host.className = 'kz-news-wrap';
    host.innerHTML = [
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

    document.body.appendChild(host);

    var form = document.getElementById('kzNewsletterForm');
    var msg = document.getElementById('kzNewsletterMsg');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailEl = document.getElementById('kzNewsletterEmail');
      var email = (emailEl.value || '').trim();
      if (!email) return;
      upsertSubscriber(email);
      msg.textContent = 'Başarılı: Bültene eklendiniz. Yeni konular yayınlandığında bildirim alacaksınız.';
      form.reset();
      renderNotificationCenter();
    });
  }

  function renderNotificationCenter() {
    var profile = readJson(PROFILE_KEY, null);
    var email = profile && profile.email ? profile.email : '';
    if (!email) return;

    var topics = readJson(TOPICS_KEY, []);
    var seenKey = 'kodzen_news_seen_' + btoa(unescape(encodeURIComponent(email))).replace(/=/g, '');
    var seenTs = parseInt(localStorage.getItem(seenKey) || '0', 10) || 0;
    var unread = topics.filter(function (t) { return (t.timestamp || 0) > seenTs; });

    var bell = document.getElementById('kzNewsBell');
    var panel = document.getElementById('kzNewsPanel');

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

    var countEl = document.getElementById('kzNewsCount');
    countEl.textContent = String(unread.length);
    countEl.style.display = unread.length ? 'flex' : 'none';

    panel.innerHTML = topics.length
      ? topics.slice().reverse().map(function (t) {
          return [
            '<div class="kz-news-item">',
            '  <h6>' + esc(t.title) + '</h6>',
            '  <p>' + esc(t.summary || '') + '</p>',
            '  <a href="' + esc(t.url || 'teknoloji-blog.html') + '">Konuyu Aç</a>',
            '</div>'
          ].join('');
        }).join('')
      : '<div class="kz-news-item"><h6>Henüz bildirim yok</h6><p>Yeni konular eklendikçe burada görünecek.</p></div>';

    bell.onclick = function () {
      var isOpen = panel.style.display === 'block';
      panel.style.display = isOpen ? 'none' : 'block';
      if (!isOpen && topics.length) {
        var latestTs = topics.reduce(function (m, t) { return Math.max(m, t.timestamp || 0); }, 0);
        localStorage.setItem(seenKey, String(latestTs));
        countEl.textContent = '0';
        countEl.style.display = 'none';
      }
    };
  }

  function init() {
    ensureStyles();
    renderNewsletterBlock();
    renderNotificationCenter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
