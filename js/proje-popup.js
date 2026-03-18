/**
 * KODZEN TEKNOLOJİ — Proje Talebi Floating Popup
 * Animated "?" button + modal for project requests
 */
(function () {
  'use strict';

  // Don't run on admin pages
  const path = window.location.pathname.toLowerCase();
  if (path.includes('/admin/')) return;

  /* ── Styles ── */
  const style = document.createElement('style');
  style.textContent = `
    /* Floating Button */
    #kzProjeBtn {
      position: fixed;
      bottom: 96px;
      right: 28px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00c4a0, #00a085);
      color: #fff;
      border: none;
      cursor: pointer;
      z-index: 9990;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      box-shadow: 0 4px 20px rgba(0,196,160,.45);
      transition: transform .3s, box-shadow .3s;
      font-family: inherit;
      outline: none;
    }
    #kzProjeBtn:hover {
      transform: scale(1.12) translateY(-2px);
      box-shadow: 0 8px 30px rgba(0,196,160,.6);
    }
    /* Pulse rings */
    #kzProjeBtn .kz-pulse {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: rgba(0,196,160,.4);
      animation: kzPulseAnim 2s ease-out infinite;
    }
    #kzProjeBtn .kz-pulse:nth-child(2) { animation-delay: .6s; }
    #kzProjeBtn .kz-pulse:nth-child(3) { animation-delay: 1.2s; }
    @keyframes kzPulseAnim {
      0%   { transform: scale(1); opacity: .6; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    /* Shape morph animation for the "?" icon */
    #kzProjeBtn .kz-icon {
      position: relative;
      z-index: 1;
      animation: kzMorph 4s ease-in-out infinite;
      display: inline-block;
    }
    @keyframes kzMorph {
      0%,100% { transform: scale(1) rotate(0deg); }
      25%      { transform: scale(1.15) rotate(-8deg); }
      50%      { transform: scale(0.9) rotate(5deg); }
      75%      { transform: scale(1.1) rotate(-3deg); }
    }
    /* Tooltip label */
    #kzProjeBtn .kz-tooltip {
      position: absolute;
      right: 68px;
      top: 50%;
      transform: translateY(-50%);
      background: #0d1117;
      color: #00c4a0;
      border: 1px solid rgba(0,196,160,.3);
      padding: .35rem .8rem;
      border-radius: 8px;
      font-size: .78rem;
      font-weight: 600;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity .3s;
    }
    #kzProjeBtn:hover .kz-tooltip { opacity: 1; }

    /* Modal Overlay */
    #kzProjeModal {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.7);
      backdrop-filter: blur(6px);
      z-index: 9995;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      opacity: 0;
      pointer-events: none;
      transition: opacity .3s;
    }
    #kzProjeModal.open {
      opacity: 1;
      pointer-events: all;
    }
    /* Modal Box */
    #kzProjeModalBox {
      background: #0d1117;
      border: 1px solid rgba(0,196,160,.3);
      border-radius: 24px;
      max-width: 440px;
      width: 100%;
      padding: 2.5rem 2rem 2rem;
      text-align: center;
      position: relative;
      transform: scale(.88) translateY(20px);
      transition: transform .35s cubic-bezier(.34,1.56,.64,1), opacity .3s;
      box-shadow: 0 30px 80px rgba(0,0,0,.6), 0 0 60px rgba(0,196,160,.08);
    }
    #kzProjeModal.open #kzProjeModalBox {
      transform: scale(1) translateY(0);
    }
    #kzProjeModalBox .kz-rocket {
      font-size: 3.5rem;
      animation: kzRocket 1.5s ease-in-out infinite alternate;
      display: inline-block;
    }
    @keyframes kzRocket {
      from { transform: translateY(0) rotate(-5deg); }
      to   { transform: translateY(-8px) rotate(5deg); }
    }
    #kzProjeModalBox h3 {
      color: #e2e8f0;
      font-size: 1.35rem;
      font-weight: 700;
      margin: 1rem 0 .5rem;
      line-height: 1.3;
    }
    #kzProjeModalBox h3 span { color: #00c4a0; }
    #kzProjeModalBox p {
      color: #94a3b8;
      font-size: .9rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    /* Close button */
    #kzProjeModalClose {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(255,255,255,.05);
      border: none;
      color: #94a3b8;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background .2s, color .2s;
    }
    #kzProjeModalClose:hover {
      background: rgba(255,255,255,.1);
      color: #e2e8f0;
    }
    /* Action Buttons */
    .kz-modal-btns {
      display: flex;
      flex-direction: column;
      gap: .75rem;
    }
    .kz-btn-primary {
      display: block;
      background: linear-gradient(135deg, #00c4a0, #00a085);
      color: #fff;
      text-decoration: none;
      padding: .85rem 1.5rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: .95rem;
      transition: transform .2s, box-shadow .2s;
      border: none;
      cursor: pointer;
    }
    .kz-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,196,160,.4);
      color: #fff;
      text-decoration: none;
    }
    .kz-btn-secondary {
      background: transparent;
      border: 1px solid rgba(255,255,255,.1);
      color: #94a3b8;
      padding: .65rem 1.5rem;
      border-radius: 12px;
      font-size: .85rem;
      cursor: pointer;
      transition: background .2s, color .2s;
    }
    .kz-btn-secondary:hover {
      background: rgba(255,255,255,.05);
      color: #e2e8f0;
    }
    /* Feature pills */
    .kz-features {
      display: flex;
      flex-wrap: wrap;
      gap: .4rem;
      justify-content: center;
      margin-bottom: 1.5rem;
    }
    .kz-pill {
      background: rgba(0,196,160,.1);
      color: #00c4a0;
      border: 1px solid rgba(0,196,160,.2);
      border-radius: 20px;
      padding: .25rem .7rem;
      font-size: .72rem;
      font-weight: 600;
    }
    /* Already on page indicator */
    #kzProjeBtn.active-page {
      background: linear-gradient(135deg, #00a085, #008065);
    }
  `;
  document.head.appendChild(style);

  /* ── Button HTML ── */
  const btn = document.createElement('button');
  btn.id = 'kzProjeBtn';
  btn.setAttribute('aria-label', 'Proje Talebi Oluştur');
  btn.title = 'Proje Talebi';
  // If already on proje-talebi page, add class
  if (path.includes('proje-talebi')) btn.classList.add('active-page');
  btn.innerHTML = `
    <span class="kz-pulse"></span>
    <span class="kz-pulse"></span>
    <span class="kz-pulse"></span>
    <span class="kz-icon">?</span>
    <span class="kz-tooltip">Proje Talebi</span>
  `;

  /* ── Modal HTML ── */
  const modal = document.createElement('div');
  modal.id = 'kzProjeModal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'kzModalTitle');
  modal.innerHTML = `
    <div id="kzProjeModalBox">
      <button id="kzProjeModalClose" aria-label="Kapat">✕</button>
      <div class="kz-rocket">🚀</div>
      <h3 id="kzModalTitle">Kendi Projenizi<br><span>Yaptırmak İster misiniz?</span></h3>
      <p>Hayalinizi yazıya dökün,<br>biz gerçeğe dönüştürelim!</p>
      <div class="kz-features">
        <span class="kz-pill">🌐 Web Sitesi</span>
        <span class="kz-pill">🤖 Yapay Zeka</span>
        <span class="kz-pill">📱 Mobil Uygulama</span>
        <span class="kz-pill">🗺️ GIS/SCADA</span>
        <span class="kz-pill">💬 WhatsApp Bot</span>
      </div>
      <div class="kz-modal-btns">
        <a href="proje-talebi.html" class="kz-btn-primary">
          ✍️ Hemen Talep Oluştur
        </a>
        <button class="kz-btn-secondary" id="kzModalDismiss">Şimdi Değil</button>
      </div>
    </div>
  `;

  /* ── Append to DOM ── */
  document.body.appendChild(btn);
  document.body.appendChild(modal);

  /* ── Auto-show logic (first visit ever = immediate, otherwise skip) ── */
  const STORAGE_KEY = 'kzProjePopupSeen';
  const hasSeen = localStorage.getItem(STORAGE_KEY);
  if (!hasSeen && !path.includes('proje-talebi')) {
    setTimeout(openModal, 1200); // show quickly on first visit
  }

  /* ── Event handlers ── */
  btn.addEventListener('click', function () {
    if (path.includes('proje-talebi')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      openModal();
    }
  });

  document.getElementById('kzProjeModalClose').addEventListener('click', closeModal);
  document.getElementById('kzModalDismiss').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    localStorage.setItem(STORAGE_KEY, '1');
    // Focus trap
    setTimeout(() => {
      const closeBtn = document.getElementById('kzProjeModalClose');
      if (closeBtn) closeBtn.focus();
    }, 100);
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

})();
