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
