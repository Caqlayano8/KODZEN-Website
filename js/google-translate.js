/**
 * KODZEN TEKNOLOJİ — Google Translate (Navbar)
 * Custom 🌐 button with reliable cookie + reload approach
 */
(function () {
  'use strict';
  if (window.location.pathname.toLowerCase().includes('/admin/')) return;

  var LANGS = [
    {code:'tr', label:'🇹🇷 Türkçe'},
    {code:'en', label:'🇬🇧 English'},
    {code:'de', label:'🇩🇪 Deutsch'},
    {code:'fr', label:'🇫🇷 Français'},
    {code:'ar', label:'🇸🇦 العربية'},
    {code:'ru', label:'🇷🇺 Русский'},
    {code:'es', label:'🇪🇸 Español'},
    {code:'zh-CN', label:'🇨🇳 中文'},
    {code:'ja', label:'🇯🇵 日本語'},
  ];

  // Read current language from googtrans cookie
  function getCurLang() {
    var m = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
    return m ? m[1] : 'tr';
  }

  // Google Translate init callback
  window.googleTranslateElementInit = function () {
    if (typeof google === 'undefined' || !google.translate) return;
    new google.translate.TranslateElement({
      pageLanguage: 'tr',
      autoDisplay: false,
      includedLanguages: 'tr,en,de,fr,ar,ru,es,zh-CN,ja',
    }, 'google_translate_element');
  };

  // Load GT script
  var sc = document.createElement('script');
  sc.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  sc.async = true; sc.defer = true;
  document.head.appendChild(sc);

  // Change language
  window.kzChangeLang = function (lang) {
    // Close dropdown
    var drop = document.getElementById('kzGTDrop');
    if (drop) drop.classList.remove('open');

    if (lang === 'tr') {
      // Remove translation cookies
      ['/', '/en', '/de', '/fr', '/ar', '/ru', '/es', '/zh-CN', '/ja'].forEach(function(p) {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=' + p;
      });
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.' + location.hostname + '; path=/';
    } else {
      var exp = new Date(); exp.setFullYear(exp.getFullYear() + 1);
      var expires = '; expires=' + exp.toUTCString() + '; path=/';
      document.cookie = 'googtrans=/tr/' + lang + expires;
      document.cookie = 'googtrans=/tr/' + lang + '; domain=.' + location.hostname + expires;
    }

    // Try via widget select first
    var sel = document.querySelector('.goog-te-combo');
    if (sel) {
      sel.value = lang === 'tr' ? '' : lang;
      sel.dispatchEvent(new Event('change'));
      // Update label
      var lbl = document.getElementById('kzGTLang');
      if (lbl) lbl.textContent = lang.toUpperCase().substring(0,2);
      return;
    }

    // Fallback: reload to apply cookie
    location.reload();
  };

  // Build custom dropdown
  document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('kzGTNavItem');
    if (!container) return;

    var curLang = getCurLang();
    var curLabel = curLang.toUpperCase().substring(0, 2);

    container.innerHTML =
      '<div class="kz-gt-wrap" id="kzGTWrap">' +
        '<button class="kz-gt-btn" id="kzGTBtn" title="Dil Seç">' +
          '🌐 <span id="kzGTLang">' + curLabel + '</span>' +
        '</button>' +
        '<ul class="kz-gt-drop" id="kzGTDrop">' +
          LANGS.map(function(l) {
            return '<li onclick="kzChangeLang(\'' + l.code + '\')">' + l.label + '</li>';
          }).join('') +
        '</ul>' +
        '<div id="google_translate_element" style="display:none;width:0;height:0;overflow:hidden"></div>' +
      '</div>';

    document.getElementById('kzGTBtn').addEventListener('click', function(e) {
      e.stopPropagation();
      document.getElementById('kzGTDrop').classList.toggle('open');
    });

    document.addEventListener('click', function(e) {
      var wrap = document.getElementById('kzGTWrap');
      if (wrap && !wrap.contains(e.target)) {
        var d = document.getElementById('kzGTDrop');
        if (d) d.classList.remove('open');
      }
    });
  });

  // Styles
  var st = document.createElement('style');
  st.textContent =
    '.goog-te-banner-frame,.skiptranslate>iframe{display:none!important}' +
    'body{top:0!important}' +
    '#goog-gt-tt,.goog-te-balloon-frame{display:none!important}' +
    '.goog-te-gadget img{display:none}' +
    '#kzGTNavItem{position:relative;display:flex;align-items:center}' +
    '.kz-gt-wrap{position:relative}' +
    '.kz-gt-btn{background:rgba(0,196,160,.12);border:1px solid rgba(0,196,160,.4);border-radius:8px;color:#00c4a0;font-size:.78rem;font-weight:600;padding:4px 10px;cursor:pointer;white-space:nowrap;display:flex;align-items:center;gap:4px;transition:.2s}' +
    '.kz-gt-btn:hover{background:rgba(0,196,160,.25)}' +
    '.kz-gt-drop{display:none;position:absolute;top:calc(100% + 6px);right:0;background:#0d1117;border:1px solid rgba(0,196,160,.3);border-radius:8px;list-style:none;padding:4px 0;margin:0;min-width:160px;z-index:99999;box-shadow:0 8px 24px rgba(0,0,0,.5)}' +
    '.kz-gt-drop.open{display:block}' +
    '.kz-gt-drop li{padding:7px 14px;cursor:pointer;font-size:.8rem;color:#e2e8f0;white-space:nowrap}' +
    '.kz-gt-drop li:hover{background:rgba(0,196,160,.12);color:#00c4a0}';
  document.head.appendChild(st);
})();