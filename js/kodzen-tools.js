(function () {
  var apps = [
    { id: 'classplanner', name: 'Kodzen ClassPlanner', group: 'Egitimciler', summary: 'Ders plani olusturma ve paylasma.' },
    { id: 'quizmaker', name: 'Kodzen QuizMaker', group: 'Egitimciler', summary: 'Hizli quiz hazirlama ve ogrenciye gonderme.' },
    { id: 'attendance', name: 'Kodzen Attendance', group: 'Egitimciler', summary: 'Ogrenci yoklama takibi.' },
    { id: 'gradebook', name: 'Kodzen GradeBook', group: 'Egitimciler', summary: 'Not defteri ve otomatik ortalama hesaplama.' },
    { id: 'lecturetimer', name: 'Kodzen LectureTimer', group: 'Egitimciler', summary: 'Ders suresini yonetme ve mola hatirlatici.' },

    { id: 'docmanager', name: 'Kodzen DocManager', group: 'Memurlar', summary: 'Evrak duzenleme ve arsivleme.' },
    { id: 'meetingnotes', name: 'Kodzen MeetingNotes', group: 'Memurlar', summary: 'Toplanti notlarini kaydetme.' },
    { id: 'taskdesk', name: 'Kodzen TaskDesk', group: 'Memurlar', summary: 'Gunluk gorev takibi.' },
    { id: 'securemail', name: 'Kodzen SecureMail', group: 'Memurlar', summary: 'Guvenli e-posta istemcisi.' },
    { id: 'workflow', name: 'Kodzen Workflow', group: 'Memurlar', summary: 'Is akisi yonetimi.' },

    { id: 'familybudget', name: 'Kodzen FamilyBudget', group: 'Aileler', summary: 'Aile butcesi takibi.' },
    { id: 'mealplanner', name: 'Kodzen MealPlanner', group: 'Aileler', summary: 'Haftalik yemek plani.' },
    { id: 'choremanager', name: 'Kodzen ChoreManager', group: 'Aileler', summary: 'Ev isleri gorev dagilimi.' },
    { id: 'familycalendar', name: 'Kodzen FamilyCalendar', group: 'Aileler', summary: 'Ortak aile takvimi.' },
    { id: 'kidstracker', name: 'Kodzen KidsTracker', group: 'Aileler', summary: 'Cocuklarin gunluk aktivitelerini takip.' },

    { id: 'batterysaver', name: 'Kodzen BatterySaver', group: 'Android', summary: 'Pil optimizasyonu.' },
    { id: 'cleaner', name: 'Kodzen Cleaner', group: 'Android', summary: 'Gereksiz dosya temizleyici.' },
    { id: 'applocker', name: 'Kodzen AppLocker', group: 'Android', summary: 'Uygulama kilitleme.' },
    { id: 'callrecorder', name: 'Kodzen CallRecorder', group: 'Android', summary: 'Arama kaydedici.' },
    { id: 'healthmonitor', name: 'Kodzen HealthMonitor', group: 'Android', summary: 'Adim sayaci ve saglik takibi.' },

    { id: 'hrdesk', name: 'Kodzen HRDesk', group: 'Is Yerleri', summary: 'Insan kaynaklari yonetimi.' },
    { id: 'payroll', name: 'Kodzen Payroll', group: 'Is Yerleri', summary: 'Maas ve bordro sistemi.' },
    { id: 'inventory', name: 'Kodzen Inventory', group: 'Is Yerleri', summary: 'Stok takibi.' },
    { id: 'crm', name: 'Kodzen CRM', group: 'Is Yerleri', summary: 'Musteri iliskileri yonetimi.' },
    { id: 'projectflow', name: 'Kodzen ProjectFlow', group: 'Is Yerleri', summary: 'Proje yonetimi.' },
    { id: 'timetracker', name: 'Kodzen TimeTracker', group: 'Is Yerleri', summary: 'Calisma saatlerini takip.' },
    { id: 'meetingscheduler', name: 'Kodzen MeetingScheduler', group: 'Is Yerleri', summary: 'Toplanti planlama.' },
    { id: 'invoicepro', name: 'Kodzen InvoicePro', group: 'Is Yerleri', summary: 'Fatura olusturma.' },
    { id: 'supportdesk', name: 'Kodzen SupportDesk', group: 'Is Yerleri', summary: 'Musteri destek sistemi.' },
    { id: 'analytics', name: 'Kodzen Analytics', group: 'Is Yerleri', summary: 'Is performans analizi.' },
    { id: 'traininghub', name: 'Kodzen TrainingHub', group: 'Is Yerleri', summary: 'Calisan egitim platformu.' },
    { id: 'securitycheck', name: 'Kodzen SecurityCheck', group: 'Is Yerleri', summary: 'Is yeri guvenlik kontrolu.' },
    { id: 'visitorlog', name: 'Kodzen VisitorLog', group: 'Is Yerleri', summary: 'Ziyaretci kayit sistemi.' },
    { id: 'assetmanager', name: 'Kodzen AssetManager', group: 'Is Yerleri', summary: 'Sirket varlik takibi.' },
    { id: 'collaboration', name: 'Kodzen Collaboration', group: 'Is Yerleri', summary: 'Calisanlar arasi dosya paylasimi.' },

    { id: 'vulnscanner', name: 'Kodzen Vulnerability Scanner', group: 'Siber Guvenlik', summary: 'Web uygulamasi aciklarini tarar.' },
    { id: 'loganalyzer', name: 'Kodzen LogAnalyzer', group: 'Siber Guvenlik', summary: 'Sistem loglarini analiz eder.' },
    { id: 'phishalert', name: 'Kodzen PhishAlert', group: 'Siber Guvenlik', summary: 'Phishing kontrolu yapar.' },
    { id: 'cryptosafe', name: 'Kodzen CryptoSafe', group: 'Siber Guvenlik', summary: 'Dosya/metin sifreleme.' },
    { id: 'secureaudit', name: 'Kodzen SecureAudit', group: 'Siber Guvenlik', summary: 'Guvenlik checklist raporu.' },

    { id: 'devtracker', name: 'Kodzen DevTracker', group: 'Yazilimcilar', summary: 'Proje ve bug takibi.' },
    { id: 'codereview-assistant', name: 'Kodzen CodeReview Assistant', group: 'Yazilimcilar', summary: 'Kod analizi ve oneriler.' },
    { id: 'regexbuilder', name: 'Kodzen RegexBuilder', group: 'Yazilimcilar', summary: 'Regex olusturma ve test.' },
    { id: 'apimockserver', name: 'Kodzen API MockServer', group: 'Yazilimcilar', summary: 'Sahte API endpoint olusturma.' },
    { id: 'profiler', name: 'Kodzen Performance Profiler', group: 'Yazilimcilar', summary: 'Kod performans olcumu.' }
  ];

  // 60 hedefi icin katalogu 15 prototip uygulama ile tamamla.
  for (var p = 1; p <= 15; p++) {
    apps.push({
      id: 'prototype-' + p,
      name: 'Kodzen Prototype ' + p,
      group: 'Yeni Fikirler',
      summary: 'Erken asama urun fikri. Hizli PoC, demo ve kullanici geri bildirimi odaklidir.'
    });
  }

  function qs(id) {
    return document.getElementById(id);
  }

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function groupToFolder(group) {
    var map = {
      'Egitimciler': 'egitimciler',
      'Memurlar': 'memurlar',
      'Aileler': 'aileler',
      'Android': 'android',
      'Is Yerleri': 'is-yerleri',
      'Siber Guvenlik': 'siber-guvenlik',
      'Yazilimcilar': 'yazilimcilar',
      'Yeni Fikirler': 'yeni-fikirler'
    };
    return map[group] || 'genel';
  }

  function appPaths(app) {
    var base = 'Kodzen Tools/' + groupToFolder(app.group) + '/' + app.id + '/';
    return {
      demo: encodeURI(base + 'demo/index.html'),
      setup: encodeURI(base + 'setup/setup.ps1'),
      docs: encodeURI(base + 'docs/tanitim.txt')
    };
  }

  var activeId = apps[0].id;
  var activeTab = 'intro';

  function getActiveApp() {
    for (var i = 0; i < apps.length; i++) {
      if (apps[i].id === activeId) return apps[i];
    }
    return apps[0];
  }

  function renderList(filter) {
    var list = qs('toolsList');
    if (!list) return;

    var q = (filter || '').trim().toLowerCase();
    var html = [];

    for (var i = 0; i < apps.length; i++) {
      var app = apps[i];
      var hay = (app.name + ' ' + app.group + ' ' + app.summary).toLowerCase();
      if (q && hay.indexOf(q) === -1) continue;

      html.push(
        '<button class="tool-item' + (app.id === activeId ? ' active' : '') + '" data-id="' + esc(app.id) + '">' +
          '<span class="tool-title">' + esc(app.name) + '</span>' +
          '<span class="tool-cat">' + esc(app.group) + '</span>' +
        '</button>'
      );
    }

    list.innerHTML = html.join('');

    var btns = list.querySelectorAll('.tool-item');
    for (var b = 0; b < btns.length; b++) {
      btns[b].addEventListener('click', function () {
        activeId = this.getAttribute('data-id');
        renderList(qs('toolSearch').value);
        renderDetail();
      });
    }
  }

  function renderDetail() {
    var app = getActiveApp();
    var title = qs('toolDetailTitle');
    var badge = qs('toolDetailBadge');
    var content = qs('toolDetailContent');

    if (!title || !badge || !content) return;

    title.textContent = app.name;
    badge.textContent = app.group;

    var body = '';
    var paths = appPaths(app);
    if (activeTab === 'intro') {
      body =
        '<h5>Tanitim</h5>' +
        '<p>' + esc(app.summary) + '</p>' +
        '<ul class="intro-list">' +
          '<li>Hedef grup: ' + esc(app.group) + '</li>' +
          '<li>Surec: Tanitim, canli demo, kurulum ve onboarding adimlari.</li>' +
          '<li>Sonraki adim: Paket secimi ve ihtiyaca gore ozellestirme.</li>' +
        '</ul>' +
        '<div class="d-flex flex-wrap gap-2 mt-3">' +
          '<a class="btn-primary-kodzen" href="' + esc(paths.docs) + '" target="_blank"><i class="bi bi-journal-text"></i> Tanitim Dosyasi</a>' +
        '</div>';
    } else if (activeTab === 'demo') {
      body =
        '<h5>Demo Bolumu</h5>' +
        '<p>' + esc(app.name) + ' icin canli demo ortamina gecip tum ozellikleri deneyebilirsiniz.</p>' +
        '<a class="btn-primary-kodzen" href="' + esc(paths.demo) + '" target="_blank"><i class="bi bi-play-circle"></i> Demo Ac</a>';
    } else {
      body =
        '<h5>Download Bolumu</h5>' +
        '<p>Paket, dokumantasyon ve surum notlari ayni yerde sunulur.</p>' +
        '<div class="d-flex flex-wrap gap-2">' +
          '<a class="btn-primary-kodzen" href="' + esc(paths.setup) + '" target="_blank"><i class="bi bi-download"></i> Setup (PS1)</a>' +
          '<a class="btn-primary-kodzen" href="' + esc(paths.docs) + '" target="_blank"><i class="bi bi-file-earmark-text"></i> Kurulum Notlari</a>' +
        '</div>';
    }

    content.innerHTML = body;

    var tabs = document.querySelectorAll('.detail-tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle('active', tabs[i].getAttribute('data-tab') === activeTab);
    }
  }

  function initTabs() {
    var tabs = document.querySelectorAll('.detail-tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function () {
        activeTab = this.getAttribute('data-tab');
        renderDetail();
      });
    }
  }

  function initSearch() {
    var input = qs('toolSearch');
    if (!input) return;
    input.addEventListener('input', function () {
      renderList(this.value);
    });
  }

  function initCount() {
    var c = qs('toolCount');
    if (c) c.textContent = String(apps.length);
  }

  function boot() {
    initCount();
    initTabs();
    initSearch();
    renderList('');
    renderDetail();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
