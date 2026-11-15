/* Public KODZEN assistant routing key; contains no administrative credentials. */
(() => {
  'use strict';
  if (window.krtzenKodzenLoaded || /\/admin\//.test(location.pathname)) return;
  window.krtzenKodzenLoaded = true;
  const origin = 'https://krtzen.130.61.210.62.sslip.io';
  const talk = origin + '/public/talk.html#2586bb6af0e7f4a3b3d556982a5d065856e60a422b6aaa90';
  const intake = origin + '/public/company-request.html';
  const ready = () => {
    document.querySelectorAll('[data-krtzen-talk]').forEach(a => { a.href = talk; a.target = '_blank'; a.rel = 'noopener'; });
    document.querySelectorAll('[data-krtzen-intake]').forEach(a => { a.href = intake; a.target = '_blank'; a.rel = 'noopener'; });
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = '/css/krtzen-integration.css'; document.head.append(css);
    // One support control replaces the previous contact-only widget.
    document.getElementById('kodzen-support-widget')?.remove();
    const support = document.createElement('div'); support.id = 'krtzen-site-support';
    support.innerHTML = `<details><summary>KODZEN asistanı <span aria-hidden="true">↗</span></summary><div><strong>Size nasıl yardımcı olalım?</strong><p>KODZEN hizmetlerini yazılı veya sesli sorun. Mikrofon yalnızca onayınızla açılır.</p><a href="${talk}" target="_blank" rel="noopener">Asistanla konuş / yaz</a><a href="${intake}" target="_blank" rel="noopener">Şirketim için demo iste</a><a href="https://wa.me/905458966096" target="_blank" rel="noopener">WhatsApp ile bize ulaş</a><small>AI yanıtları hata içerebilir. Hassas bilgi paylaşmayın.</small></div></details>`;
    document.body.append(support);
    const home = /\/(index\.html)?$/.test(location.pathname);
    if (home && !document.getElementById('krtzen-home-promo')) {
      const promo = document.createElement('aside'); promo.id = 'krtzen-home-promo';
      promo.innerHTML = '<span><b>Yeni: KRTZEN</b> · WhatsApp, sesli asistan ve müşteri takibi tek yerde.</span><a href="/krtzen.html">Ürünü keşfet →</a>';
      document.querySelector('nav')?.insertAdjacentElement('afterend', promo);
    }
    if (/\/krtzen\.html$/.test(location.pathname)) return;
    const storageKey = 'kodzen.krtzen.intro.v1';
    const read = () => { try { return localStorage.getItem(storageKey); } catch { try { return sessionStorage.getItem(storageKey); } catch { return null; } } };
    if (read()) return;
    let retries = 0;
    const show = () => {
      // Existing introduction and project dialogs finish before this invitation.
      const intro = document.getElementById('introScreen');
      if ((intro && getComputedStyle(intro).display !== 'none') || document.querySelector('dialog[open], .modal.show, #kzProjeModal.open')) {
        if (++retries < 60) setTimeout(show, 1000);
        return;
      }
      if (read()) return;
      const dialog = document.createElement('dialog'); dialog.id = 'krtzen-first-visit'; dialog.setAttribute('aria-labelledby', 'krtzen-invite-title');
      dialog.innerHTML = '<button class="krtzen-dismiss" autofocus aria-label="Tanıtımı kapat">×</button><p class="krtzen-eyebrow">KODZEN’DEN · KONTROLLÜ PİLOT</p><h2 id="krtzen-invite-title">Müşteri yazsın.<br>Takibi sizde kalsın.</h2><p>KRTZEN ile WhatsApp mesajlarını, talepleri ve sektörünüze göre yapılandırılan AI asistanını bir araya getirin.</p><div class="krtzen-invite-tags"><span>WhatsApp</span><span>Sesli asistan</span><span>Şirket bazında yönetim</span></div><a class="krtzen-invite-cta" href="/krtzen.html">KRTZEN’i keşfet →</a><button class="krtzen-later">Siteye devam et</button><small>Demo talebinizi inceler, şirketinize özel kurulumu biz hazırlarız.</small>';
      document.body.append(dialog);
      const prior = document.activeElement;
      const previousOverflow = document.body.style.overflow;
      const close = () => dialog.close();
      dialog.querySelector('.krtzen-dismiss').onclick = close;
      dialog.querySelector('.krtzen-later').onclick = close;
      dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close(); } });
      dialog.addEventListener('close', () => { document.body.style.overflow = previousOverflow; prior?.focus(); dialog.remove(); });
      dialog.showModal(); document.body.style.overflow = 'hidden';
      try { localStorage.setItem(storageKey, 'seen'); } catch { try { sessionStorage.setItem(storageKey, 'seen'); } catch { /* Browser storage disabled. */ } }
    };
    setTimeout(show, home ? 5200 : 1800);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, {once:true}); else ready();
})();
