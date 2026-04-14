(function () {
  function buildMainNav() {
    var nav = document.querySelector('#mainNavbar .navbar-nav.mx-auto');
    if (!nav) return;

    var path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var activeMap = {
      'index.html': 'index.html',
      'robotik-kodlama.html': 'robotik-kodlama.html',
      'teknoloji-blog.html': 'teknoloji-blog.html',
      'sosyal-medya-analiz.html': 'sosyal-medya-analiz.html',
      'webgelistirme.html': 'webgelistirme.html',
      'temalar.html': 'temalar.html',
      'siberguvenik.html': 'siberguvenik.html',
      'scada.html': 'scada.html',
      'fiyatlar.html': 'fiyatlar.html',
      'demo.html': 'demo.html',
      'kodzen-tools.html': 'kodzen-tools.html',
      'iletisim.html': 'iletisim.html',
      'ai-gis.html': 'urunler',
      'ckmesaj.html': 'urunler',
      'whatsypzck.html': 'urunler',
      'viralbotpro.html': 'urunler',
      'siparis.html': 'urunler'
    };

    var active = activeMap[path] || '';
    var isProducts = active === 'urunler';

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
      '<li class="nav-item"><a class="nav-link' + (active === 'sosyal-medya-analiz.html' ? ' active' : '') + '" href="sosyal-medya-analiz.html">Sosyal Media Analiz</a></li>',
      '<li class="nav-item"><a class="nav-link' + (active === 'webgelistirme.html' ? ' active' : '') + '" href="webgelistirme.html">Web Hizmetleri</a></li>',
      '<li class="nav-item"><a class="nav-link' + (active === 'temalar.html' ? ' active' : '') + '" href="temalar.html">Temalar</a></li>',
      '<li class="nav-item"><a class="nav-link' + (active === 'siberguvenik.html' ? ' active' : '') + '" href="siberguvenik.html">Siber Güvenlik</a></li>',
      '<li class="nav-item"><a class="nav-link' + (active === 'scada.html' ? ' active' : '') + '" href="scada.html">SCADA</a></li>',
      '<li class="nav-item"><a class="nav-link' + (active === 'fiyatlar.html' ? ' active' : '') + '" href="fiyatlar.html">Fiyatlar</a></li>',
      '<li class="nav-item"><a class="nav-link' + (active === 'demo.html' ? ' active' : '') + '" href="demo.html">Demo</a></li>',
      '<li class="nav-item"><a class="nav-link' + (active === 'kodzen-tools.html' ? ' active' : '') + '" href="kodzen-tools.html">Kodzen Tools</a></li>',
      '<li class="nav-item"><a class="nav-link' + (active === 'iletisim.html' ? ' active' : '') + '" href="iletisim.html">İletişim</a></li>'
    ].join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildMainNav);
  } else {
    buildMainNav();
  }
})();
