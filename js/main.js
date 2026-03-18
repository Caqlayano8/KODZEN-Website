/* =====================================================
   KODZEN TEKNOLOJİ — Main JS
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. AOS Init ── */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-cubic' });
  }

  /* ── 2. Navbar scroll ── */
  const navbar = document.getElementById('mainNavbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 3. Active nav link ── */
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  /* ── 4. Typed Text Effect ── */
  const typedEl = document.getElementById('typedText');
  if (typedEl) {
    const texts = [
      'Yazılım Geliştirme',
      'GIS & SCADA Sistemleri',
      'WhatsApp Otomasyonu',
      'Siber Güvenlik',
      'BT Danışmanlığı'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
      const current = texts[textIndex];
      if (isDeleting) {
        typedEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typedEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIndex === current.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 400;
      }

      setTimeout(type, typingSpeed);
    }

    setTimeout(type, 600);
  }

  /* ── 5. Skill bar animation ── */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (skillBars.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const target = bar.getAttribute('data-width') || '0';
          bar.style.width = target + '%';
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.1 });

    skillBars.forEach(bar => {
      bar.style.width = '0%';
      bar.style.transition = 'width 1.2s ease';
      observer.observe(bar);
    });
  }

  /* ── 6. Smooth scroll for anchors ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── 7. Live Chat Widget (WhatsApp) ── */
  const settings = (typeof KodzenData !== 'undefined') ? KodzenData.getSettings() : { whatsapp: '905458966096', liveChatMsg: 'Merhaba! Size nasıl yardımcı olabiliriz?' };
  const chatBtn = document.getElementById('liveChatBtn');
  if (chatBtn) {
    const waUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(settings.liveChatMsg)}`;
    chatBtn.href = waUrl;
    chatBtn.target = '_blank';
    chatBtn.rel = 'noopener noreferrer';
  }

  /* ── 8. Contact form handler ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value?.trim();
      const email = document.getElementById('contactEmail')?.value?.trim();
      const subject = document.getElementById('contactSubject')?.value?.trim();
      const message = document.getElementById('contactMessage')?.value?.trim();

      if (!name || !email || !subject || !message) {
        showFormAlert(contactForm, 'error', 'Lütfen tüm zorunlu alanları doldurun.');
        return;
      }

      if (typeof KodzenData !== 'undefined') {
        KodzenData.addMessage({ name, email, subject, message });
      }

      contactForm.reset();
      showFormAlert(contactForm, 'success', 'Mesajınız iletildi! En kısa sürede dönüş yapacağız.');
    });
  }

  /* ── 9. Demo form handler ── */
  const demoForm = document.getElementById('demoForm');
  if (demoForm) {
    demoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('demoName')?.value?.trim();
      const company = document.getElementById('demoCompany')?.value?.trim();
      const email = document.getElementById('demoEmail')?.value?.trim();
      const phone = document.getElementById('demoPhone')?.value?.trim();
      const product = document.getElementById('demoProduct')?.value;
      const message = document.getElementById('demoMessage')?.value?.trim();

      if (!name || !company || !email) {
        showFormAlert(demoForm, 'error', 'Lütfen Ad Soyad, Şirket ve E-posta alanlarını doldurun.');
        return;
      }

      if (typeof KodzenData !== 'undefined') {
        KodzenData.addDemoRequest({ name, company, email, phone, product, message });
      }

      demoForm.reset();
      showFormAlert(demoForm, 'success', 'Demo talebiniz alındı! 24 saat içinde sizinle iletişime geçeceğiz.');
    });
  }

  /* ── 10. Gallery rendering ── */
  const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid && typeof KodzenData !== 'undefined') {
    renderGallery('all');
  }

  /* ── 11. Mobile navbar auto-close ── */
  const navbarCollapse = document.getElementById('mainNav');
  if (navbarCollapse) {
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
      });
    });
  }

  /* ── 12. Visibility settings ── */
  (function applyVisibility() {
    let vis = {};
    try { vis = JSON.parse(localStorage.getItem('kodzen_visibility') || '{}'); } catch (e) {}

    // Gallery hidden by default
    if (vis.nav_galeri === undefined) vis.nav_galeri = false;
    if (vis.section_galeri === undefined) vis.section_galeri = false;

    // Apply nav visibility via data-nav attributes
    document.querySelectorAll('[data-nav]').forEach(el => {
      const key = 'nav_' + el.getAttribute('data-nav');
      el.style.display = (vis[key] === false) ? 'none' : '';
    });

    // Apply section visibility via data-section attributes
    document.querySelectorAll('[data-section]').forEach(el => {
      const key = 'section_' + el.getAttribute('data-section');
      el.style.display = (vis[key] === false) ? 'none' : '';
    });

    // Legacy: sections by id
    const SECTION_IDS = { section_hizmetler:'hizmetler', section_urunler:'urunler', section_sertifikalar:'sertifikalar', section_iletisim:'iletisim' };
    Object.entries(SECTION_IDS).forEach(([key, id]) => {
      if (vis[key] === false) { const el = document.getElementById(id); if (el) el.style.display = 'none'; }
    });

    // CTA banner
    if (vis.section_cta === false) {
      document.querySelectorAll('.cta-banner').forEach(el => el.style.display = 'none');
    }

    // Legacy: nav by href
    const navbarNav = document.querySelector('.navbar-nav');
    if (navbarNav && vis.nav_urunler === false) {
      navbarNav.querySelectorAll('.nav-item.dropdown').forEach(el => el.style.display = 'none');
    }
  })();
  /* ── Gallery Filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderGallery(this.dataset.filter || 'all');
    });
  });

});

/* ── Gallery Render Function ── */
function renderGallery(filter = 'all', limit = null) {
  const galleryGrid = document.getElementById('galleryGrid');
  if (!galleryGrid || typeof KodzenData === 'undefined') return;

  let items = KodzenData.getGallery();
  if (filter && filter !== 'all') {
    items = items.filter(item => item.category === filter);
  }
  if (limit) items = items.slice(0, limit);

  galleryGrid.innerHTML = '';

  if (items.length === 0) {
    galleryGrid.innerHTML = '<div class="text-center text-muted py-5"><i class="bi bi-images" style="font-size:2.5rem;color:var(--text-dim)"></i><p class="mt-3">Henüz galeri öğesi yok.</p></div>';
    return;
  }

  items.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    col.setAttribute('data-aos', 'fade-up');

    if (item.type === 'video') {
      col.innerHTML = `
        <div class="gallery-video-wrap" onclick="openVideoModal('${escapeHtml(item.url)}', '${escapeHtml(item.title)}')">
          <div class="gallery-video-thumb">
            <img src="https://img.youtube.com/vi/${getYoutubeId(item.url)}/hqdefault.jpg" 
                 onerror="this.src='https://via.placeholder.com/800x500/0d1117/00c4a0?text=Video'" 
                 style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" alt="${escapeHtml(item.title)}">
            <div class="play-btn"><i class="bi bi-play-fill"></i></div>
          </div>
          <div class="gallery-overlay">
            <span class="title">${escapeHtml(item.title)}</span>
            <span class="badge-teal ms-auto">Video</span>
          </div>
        </div>`;
    } else {
      col.innerHTML = `
        <div class="gallery-item" onclick="openImageModal('${escapeHtml(item.url)}', '${escapeHtml(item.title)}')">
          <img src="${escapeHtml(item.url)}" alt="${escapeHtml(item.title)}" loading="lazy">
          <div class="gallery-overlay">
            <span class="title">${escapeHtml(item.title)}</span>
            <i class="bi bi-arrows-fullscreen" style="color:#fff"></i>
          </div>
        </div>`;
    }

    galleryGrid.appendChild(col);
  });
}

/* ── Image Lightbox ── */
function openImageModal(url, title) {
  let modal = document.getElementById('imageLightboxModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'imageLightboxModal';
    modal.className = 'modal fade modal-dark';
    modal.tabIndex = -1;
    modal.innerHTML = `
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="lightboxTitle"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center">
            <img id="lightboxImg" src="" alt="" class="lightbox-img">
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }
  document.getElementById('lightboxTitle').textContent = title;
  document.getElementById('lightboxImg').src = url;
  document.getElementById('lightboxImg').alt = title;
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
}

/* ── Video Modal ── */
function openVideoModal(url, title) {
  let modal = document.getElementById('videoEmbedModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'videoEmbedModal';
    modal.className = 'modal fade modal-dark';
    modal.tabIndex = -1;
    modal.innerHTML = `
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="videoModalTitle"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-0">
            <div class="ratio ratio-16x9">
              <iframe id="videoIframe" src="" allowfullscreen></iframe>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);

    modal.addEventListener('hidden.bs.modal', function () {
      document.getElementById('videoIframe').src = '';
    });
  }
  document.getElementById('videoModalTitle').textContent = title;
  document.getElementById('videoIframe').src = url;
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
}

/* ── Helpers ── */
function showFormAlert(form, type, message) {
  const existing = form.querySelector('.form-alert');
  if (existing) existing.remove();

  const alert = document.createElement('div');
  alert.className = `form-alert ${type === 'success' ? 'alert-success-dark' : 'alert-error-dark'} mt-3`;
  alert.innerHTML = `<i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i> ${message}`;
  form.appendChild(alert);

  if (type === 'success') {
    setTimeout(() => alert.remove(), 6000);
  }
}

function getYoutubeId(url) {
  const match = url.match(/(?:embed\/|v=|youtu\.be\/)([^?&\n]+)/);
  return match ? match[1] : '';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/* ── Copy/paste/right-click protection ── */
(function() {
  // Only block on non-admin pages
  if (window.location.pathname.includes('/admin/')) return;
  
  // Block right click
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });
  
  // Block copy/cut
  document.addEventListener('copy', function(e) {
    e.preventDefault();
    e.clipboardData && e.clipboardData.setData('text/plain', 'KODZEN TEKNOLOJİ — kodzen.io');
    return false;
  });
  document.addEventListener('cut', function(e) {
    e.preventDefault();
    return false;
  });
  
  // Block Ctrl+U (view source), Ctrl+S (save), Ctrl+Shift+I (devtools)
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 's')) {
      e.preventDefault();
      return false;
    }
  });
})();

/* ── Copy Protection ── */
document.addEventListener('copy-protection-init', function(){});
document.addEventListener('contextmenu', function(e){ if(!e.target.matches('input,textarea,[contenteditable]')) e.preventDefault(); });
document.addEventListener('keydown', function(e){
  var t = e.target;
  var isInput = t.matches && t.matches('input,textarea,[contenteditable]');
  if (!isInput && (e.key === 'c' && (e.ctrlKey||e.metaKey))) e.preventDefault();
  if (!isInput && (e.key === 'u' && (e.ctrlKey||e.metaKey))) e.preventDefault();
  if (e.key === 'F12') e.preventDefault();
});