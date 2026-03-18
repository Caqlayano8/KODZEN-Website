/**
 * KODZEN TEKNOLOJİ - i18n Language Switcher
 * Supports 7 languages: TR, EN, DE, FR, AR, JA, RU
 * Updates kzLangSwitcher dropdown, stores preference in localStorage,
 * translates elements with data-i18n attributes.
 */
(function () {
  'use strict';

  // ── Translation dictionary ──
  var translations = {
    tr: {
      'nav.home':        'Ana Sayfa',
      'nav.products':    'Ürünler',
      'nav.webservices': 'Web Hizmetleri',
      'nav.cybersec':    'Siber Güvenlik',
      'nav.scada':       'SCADA',
      'nav.themes':      'Temalar',
      'nav.pricing':     'Fiyatlar',
      'nav.gallery':     'Galeri',
      'nav.demo':        'Demo',
      'nav.contact':     'İletişim',
      'btn.more':        'Daha Fazla',
      'btn.contact':     'İletişime Geç',
      'btn.view':        'İncele',
      'btn.order':       'Sipariş Ver',
      'btn.start':       'Başla',
      'footer.rights':   'Tüm hakları saklıdır.',
    },
    en: {
      'nav.home':        'Home',
      'nav.products':    'Products',
      'nav.webservices': 'Web Services',
      'nav.cybersec':    'Cyber Security',
      'nav.scada':       'SCADA',
      'nav.themes':      'Themes',
      'nav.pricing':     'Pricing',
      'nav.gallery':     'Gallery',
      'nav.demo':        'Demo',
      'nav.contact':     'Contact',
      'btn.more':        'Learn More',
      'btn.contact':     'Get in Touch',
      'btn.view':        'View',
      'btn.order':       'Order Now',
      'btn.start':       'Get Started',
      'footer.rights':   'All rights reserved.',
    },
    de: {
      'nav.home':        'Startseite',
      'nav.products':    'Produkte',
      'nav.webservices': 'Web-Dienste',
      'nav.cybersec':    'Cybersicherheit',
      'nav.scada':       'SCADA',
      'nav.themes':      'Themen',
      'nav.pricing':     'Preise',
      'nav.gallery':     'Galerie',
      'nav.demo':        'Demo',
      'nav.contact':     'Kontakt',
      'btn.more':        'Mehr erfahren',
      'btn.contact':     'Kontaktieren',
      'btn.view':        'Ansehen',
      'btn.order':       'Bestellen',
      'btn.start':       'Loslegen',
      'footer.rights':   'Alle Rechte vorbehalten.',
    },
    fr: {
      'nav.home':        'Accueil',
      'nav.products':    'Produits',
      'nav.webservices': 'Services Web',
      'nav.cybersec':    'Cybersécurité',
      'nav.scada':       'SCADA',
      'nav.themes':      'Thèmes',
      'nav.pricing':     'Tarifs',
      'nav.gallery':     'Galerie',
      'nav.demo':        'Démo',
      'nav.contact':     'Contact',
      'btn.more':        'En savoir plus',
      'btn.contact':     'Nous contacter',
      'btn.view':        'Voir',
      'btn.order':       'Commander',
      'btn.start':       'Commencer',
      'footer.rights':   'Tous droits réservés.',
    },
    ar: {
      'nav.home':        'الرئيسية',
      'nav.products':    'المنتجات',
      'nav.webservices': 'خدمات الويب',
      'nav.cybersec':    'الأمن السيبراني',
      'nav.scada':       'سكادا',
      'nav.themes':      'السمات',
      'nav.pricing':     'الأسعار',
      'nav.gallery':     'معرض',
      'nav.demo':        'عرض توضيحي',
      'nav.contact':     'التواصل',
      'btn.more':        'اعرف المزيد',
      'btn.contact':     'تواصل معنا',
      'btn.view':        'عرض',
      'btn.order':       'اطلب الآن',
      'btn.start':       'ابدأ الآن',
      'footer.rights':   'جميع الحقوق محفوظة.',
    },
    ja: {
      'nav.home':        'ホーム',
      'nav.products':    '製品',
      'nav.webservices': 'ウェブサービス',
      'nav.cybersec':    'サイバーセキュリティ',
      'nav.scada':       'SCADA',
      'nav.themes':      'テーマ',
      'nav.pricing':     '料金',
      'nav.gallery':     'ギャラリー',
      'nav.demo':        'デモ',
      'nav.contact':     'お問い合わせ',
      'btn.more':        '詳細を見る',
      'btn.contact':     'お問い合わせ',
      'btn.view':        '見る',
      'btn.order':       '注文する',
      'btn.start':       '始める',
      'footer.rights':   'All rights reserved.',
    },
    ru: {
      'nav.home':        'Главная',
      'nav.products':    'Продукты',
      'nav.webservices': 'Веб-услуги',
      'nav.cybersec':    'Кибербезопасность',
      'nav.scada':       'SCADA',
      'nav.themes':      'Темы',
      'nav.pricing':     'Цены',
      'nav.gallery':     'Галерея',
      'nav.demo':        'Демо',
      'nav.contact':     'Контакт',
      'btn.more':        'Узнать больше',
      'btn.contact':     'Связаться',
      'btn.view':        'Смотреть',
      'btn.order':       'Заказать',
      'btn.start':       'Начать',
      'footer.rights':   'Все права защищены.',
    }
  };

  var langMeta = {
    tr: { flag: '🇹🇷', label: 'TR', name: 'Türkçe',   dir: 'ltr' },
    en: { flag: '🇬🇧', label: 'EN', name: 'English',   dir: 'ltr' },
    de: { flag: '🇩🇪', label: 'DE', name: 'Deutsch',   dir: 'ltr' },
    fr: { flag: '🇫🇷', label: 'FR', name: 'Français',  dir: 'ltr' },
    ar: { flag: '🇸🇦', label: 'AR', name: 'العربية',   dir: 'rtl' },
    ja: { flag: '🇯🇵', label: 'JA', name: '日本語',    dir: 'ltr' },
    ru: { flag: '🇷🇺', label: 'RU', name: 'Русский',   dir: 'ltr' }
  };

  // ── Update language switcher dropdown to 7 languages ──
  function upgradeSwitcher() {
    var switcher = document.getElementById('kzLangSwitcher');
    if (!switcher) return;
    var ul = switcher.querySelector('ul.dropdown-menu');
    if (!ul) return;
    ul.innerHTML = '';
    var langOrder = ['tr', 'en', 'de', 'fr', 'ar', 'ja', 'ru'];
    langOrder.forEach(function (code) {
      var m = langMeta[code];
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.className = 'dropdown-item kz-lang-opt';
      a.href = '#';
      a.setAttribute('data-lang', code);
      a.innerHTML = '<span class="me-2">' + m.flag + '</span>' + m.name;
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  // ── Apply translations ──
  function applyLang(lang) {
    var dict = translations[lang] || translations['tr'];
    var m = langMeta[lang] || langMeta['tr'];

    // Update html lang + dir
    document.documentElement.lang = lang;
    document.body.dir = m.dir;
    if (m.dir === 'rtl') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }

    // Translate data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });

    // Show/hide lang-specific divs
    var allCodes = ['tr', 'en', 'de', 'fr', 'ar', 'ja', 'ru'];
    allCodes.forEach(function (code) {
      document.querySelectorAll('.lang-' + code).forEach(function (el) {
        el.style.display = (code === lang) ? '' : 'none';
      });
    });

    // Update switcher button
    var flag = document.getElementById('kzLangFlag');
    var label = document.getElementById('kzLangLabel');
    if (flag) flag.textContent = m.flag;
    if (label) label.textContent = m.label;

    // Store preference
    try { localStorage.setItem('kzLang', lang); } catch (e) {}
  }

  // ── Attach click handlers ──
  function attachHandlers() {
    document.querySelectorAll('.kz-lang-opt').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var lang = this.getAttribute('data-lang');
        if (lang) applyLang(lang);
      });
    });
  }

  // ── Init ──
  function init() {
    upgradeSwitcher();
    attachHandlers();
    // Restore saved language
    var saved = 'tr';
    try { saved = localStorage.getItem('kzLang') || 'tr'; } catch (e) {}
    if (saved !== 'tr') applyLang(saved);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
