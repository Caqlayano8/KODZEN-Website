/* =====================================================
   KODZEN TEKNOLOJİ — Tema Sistemi JavaScript
   - Haftanın gününe göre otomatik tema
   - localStorage ile admin override desteği
   ===================================================== */
(function () {
  // Gün → Tema eşleşmesi (0=Pazar, 1=Pazartesi, ..., 6=Cumartesi)
  const DAILY_THEMES = {
    0: 'cosmic-purple',   // Pazar    — Kozmik Mor
    1: 'matrix',          // Pazartesi — Matrix Yeşil
    2: 'midnight-blue',   // Salı     — Gece Mavisi
    3: 'light-pro',       // Çarşamba  — Kurumsal Açık
    4: 'crimson',         // Perşembe  — Kızıl Enerji
    5: 'cyber-gold',      // Cuma      — Siber Altın
    6: 'default'          // Cumartesi — KODZEN Teal (varsayılan)
  };

  const THEME_META = {
    'default':        { name: 'KODZEN Teal',      color: '#00c4a0', dark: true,  day: 'Cumartesi' },
    'matrix':         { name: 'Matrix Yeşil',      color: '#00ff41', dark: true,  day: 'Pazartesi' },
    'midnight-blue':  { name: 'Gece Mavisi',       color: '#3b82f6', dark: true,  day: 'Salı'      },
    'light-pro':      { name: 'Kurumsal Açık',     color: '#0066cc', dark: false, day: 'Çarşamba'  },
    'crimson':        { name: 'Kızıl Enerji',      color: '#ef4444', dark: true,  day: 'Perşembe'  },
    'cyber-gold':     { name: 'Siber Altın',       color: '#f59e0b', dark: true,  day: 'Cuma'      },
    'cosmic-purple':  { name: 'Kozmik Mor',        color: '#a855f7', dark: true,  day: 'Pazar'     }
  };

  function getAutoTheme() {
    const day = new Date().getDay();
    return DAILY_THEMES[day] || 'default';
  }

  function applyTheme(themeName) {
    const html = document.documentElement;
    if (!themeName || themeName === 'default') {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', themeName);
    }
    // Store active theme globally for admin panel
    window.KODZEN_THEME = {
      active: themeName || 'default',
      meta: THEME_META,
      dailyThemes: DAILY_THEMES,
      setTheme: setTheme,
      resetToAuto: resetToAuto,
      getAutoTheme: getAutoTheme
    };
  }

  function setTheme(themeName) {
    if (themeName === 'auto') {
      resetToAuto();
      return;
    }
    localStorage.setItem('kodzen_theme', themeName);
    localStorage.setItem('kodzen_theme_override', 'true');
    applyTheme(themeName);
  }

  function resetToAuto() {
    localStorage.removeItem('kodzen_theme');
    localStorage.removeItem('kodzen_theme_override');
    applyTheme(getAutoTheme());
  }

  // ── Apply on load (before render to avoid flash) ──
  const override = localStorage.getItem('kodzen_theme_override') === 'true';
  const stored   = localStorage.getItem('kodzen_theme');
  const theme    = override && stored ? stored : getAutoTheme();
  applyTheme(theme);

  // Expose globally
  window.KODZEN_THEME = {
    active: theme,
    meta: THEME_META,
    dailyThemes: DAILY_THEMES,
    setTheme: setTheme,
    resetToAuto: resetToAuto,
    getAutoTheme: getAutoTheme
  };
})();
