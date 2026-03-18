/**
 * KODZEN TEKNOLOJİ - Live Ticker Bar
 * Navbar'ın hemen ALTINDA - sticky
 */
(function () {
  'use strict';
  if (window.location.pathname.includes('/admin/')) return;
  if (document.getElementById('kzTickerBar')) return;

  var cfg = {};
  try { cfg = JSON.parse(localStorage.getItem('kodzen_ticker') || '{}'); } catch(e) {}
  if (cfg.visible === false) return;

  var speedMap = { 1: 180, 2: 130, 3: 90, 4: 60, 5: 40 };
  var duration = speedMap[cfg.speed] || 100;

  var ALL = [
    "OpenAI GPT-5 duyuruldu — AI dünyası sarsıldı 🤖",
    "Google Gemini Ultra, Türkçe desteğini güçlendirdi 🌍",
    "TÜBİTAK yerli yapay zeka çipine 500M₺ yatırım yaptı 🇹🇷",
    "Meta LLaMA 4 açık kaynak olarak yayınlandı 💻",
    "SCADA sistemleri siber saldırılara karşı yeni kalkan 🔐",
    "GIS teknolojileri akıllı şehir yönetimini dönüştürüyor 🗺️",
    "WhatsApp Business 2025'te 500M işletmeye ulaştı 📱",
    "Artvin'de dijital dönüşüm projeleri hız kazanıyor 🏔️",
    "Kuantum şifreleme standardı NIST tarafından onaylandı 🔬",
    "5G altyapısı Türkiye'nin 81 iline yayılıyor 📡",
    "Yapay zeka ile web tasarımı %70 hızlandı ✨",
    "Edge Computing IoT gecikmeyi 0.1ms'ye indiriyor ⚡",
    "Python 3.14 yapay zeka kütüphanelerini hızlandırdı 🐍",
    "Siber güvenlik ihlalleri 2025'te %60 artış gösterdi 🛡️",
    "KODZEN TEKNOLOJİ — Artvin'den dünyaya yazılım 🚀",
    "Web3 teknolojileri Türk KOBİ'lerde yaygınlaşıyor 🌐",
    "Docker ve Kubernetes kurumsal dönüşümü hızlandırıyor 🐳",
    "Enerji sektöründe AI odaklı bakım maliyetleri düşüyor ⚙️",
    "Mobil uygulama geliştirmede Flutter liderliği sürdürüyor 📲",
    "Veri analitiği pazarı 2025'de 650 milyar dolare ulaştı 📊"
  ];

  function build() {
    // Create ticker bar element
    var bar = document.createElement('div');
    bar.id = 'kzTickerBar';
    bar.style.cssText = 'width:100%;background:#080d17;border-bottom:1px solid rgba(0,196,160,.3);padding:.38rem 0;overflow:hidden;position:fixed;top:0;left:0;right:0;z-index:998;margin-top:0;transition:top .3s;';

    var inner = document.createElement('div');
    inner.style.cssText = 'padding:0 1rem;display:flex;align-items:center;gap:1rem;overflow:hidden;';

    // CANLI badge
    var badge = document.createElement('span');
    badge.style.cssText = 'background:linear-gradient(135deg,#00c4a0,#00a085);color:#000;font-size:.65rem;font-weight:800;padding:.15rem .5rem;border-radius:4px;white-space:nowrap;flex-shrink:0;letter-spacing:.7px;';
    badge.textContent = 'CANLI';
    inner.appendChild(badge);

    // Rates
    var rates = document.createElement('div');
    rates.id = 'kzRates';
    rates.style.cssText = 'display:flex;gap:.8rem;flex-shrink:0;font-size:.73rem;white-space:nowrap;font-family:monospace;';
    rates.innerHTML = '<span><span style="color:#64748b;font-size:.66rem;">USD/TRY</span> <b id="kzUSD" style="color:#00c4a0;">---</b></span>' +
      '<span><span style="color:#64748b;font-size:.66rem;">EUR/TRY</span> <b id="kzEUR" style="color:#00c4a0;">---</b></span>' +
      '<span><span style="color:#64748b;font-size:.66rem;">BTC</span> <b id="kzBTC" style="color:#f7931e;">---</b></span>' +
      '<span><span style="color:#64748b;font-size:.66rem;">☁ARTVİN</span> <b id="kzWTH" style="color:#60a5fa;">---</b></span>';
    inner.appendChild(rates);

    // Divider
    var div = document.createElement('span');
    div.style.cssText = 'color:rgba(255,255,255,.15);flex-shrink:0;';
    div.textContent = '│';
    inner.appendChild(div);

    // Scrolling news
    var wrap = document.createElement('div');
    wrap.style.cssText = 'flex:1;overflow:hidden;min-width:0;';
    var track = document.createElement('div');
    track.id = 'kzTickerTrack';
    track.style.cssText = 'display:inline-flex;gap:2.5rem;white-space:nowrap;font-size:.72rem;color:#64748b;';

    var dow = new Date().getDay();
    var picks = [];
    for (var i = 0; i < 14; i++) picks.push(ALL[(dow * 3 + i) % ALL.length]);
    picks.concat(picks).forEach(function(txt) {
      var sp = document.createElement('span');
      sp.style.marginRight = '2rem';
      sp.textContent = txt;
      track.appendChild(sp);
    });
    wrap.appendChild(track);
    inner.appendChild(wrap);
    bar.appendChild(inner);

    // CSS animation
    var st = document.createElement('style');
    st.textContent = '@keyframes kzTick{0%{transform:translateX(100vw)}100%{transform:translateX(-100%)}}' +
      '#kzTickerTrack{animation:kzTick ' + duration + 's linear infinite;}' +
      '#kzTickerTrack:hover{animation-play-state:paused}' +
      '#kzTickerTrack span::before{content:"▸ ";color:#00c4a0;font-size:.58rem;vertical-align:middle;}';
    document.head.appendChild(st);

    // Position ticker right below navbar dynamically
    document.body.appendChild(bar);
    function positionTicker() {
      var nav = document.getElementById('mainNavbar');
      if (nav) {
        var navH = nav.getBoundingClientRect().height || nav.offsetHeight;
        bar.style.top = navH + 'px';
      }
    }
    positionTicker();
    window.addEventListener('scroll', positionTicker);
    window.addEventListener('resize', positionTicker);
    // Add spacer so content is not hidden behind fixed ticker
    var spacer = document.getElementById('kzTickerSpacer');
    if (!spacer) {
      spacer = document.createElement('div');
      spacer.id = 'kzTickerSpacer';
      spacer.style.height = '34px';
      var nav2 = document.getElementById('mainNavbar');
      if (nav2 && nav2.parentNode) {
        nav2.parentNode.insertBefore(spacer, nav2.nextSibling);
      }
    }

    // Fetch data
    fetch('https://api.frankfurter.app/latest?from=USD&to=TRY,EUR')
      .then(function(r){return r.json();})
      .then(function(d){
        if (d.rates) {
          document.getElementById('kzUSD').textContent = d.rates.TRY.toFixed(2) + '₺';
          document.getElementById('kzEUR').textContent = (d.rates.TRY / d.rates.EUR).toFixed(2) + '₺';
        }
      }).catch(function(){
        document.getElementById('kzUSD').textContent = '~38₺';
        document.getElementById('kzEUR').textContent = '~42₺';
      });

    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
      .then(function(r){return r.json();})
      .then(function(d){
        if (d.bitcoin) document.getElementById('kzBTC').textContent = '$' + d.bitcoin.usd.toLocaleString('en');
      }).catch(function(){ document.getElementById('kzBTC').textContent = '~$96k'; });

    fetch('https://api.open-meteo.com/v1/forecast?latitude=41.18&longitude=41.82&current=temperature_2m,weathercode&timezone=Europe%2FIstanbul')
      .then(function(r){return r.json();})
      .then(function(d){
        if (d.current) {
          var t = Math.round(d.current.temperature_2m);
          var c = d.current.weathercode;
          var ic = c===0?'☀️':c<=2?'⛅':c<=49?'🌫️':c<=67?'🌧️':c<=77?'❄️':'⛈️';
          document.getElementById('kzWTH').textContent = ic + t + '°C';
        }
      }).catch(function(){ document.getElementById('kzWTH').textContent = '—'; });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();