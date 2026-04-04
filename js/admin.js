/* =====================================================
   KODZEN TEKNOLOJİ — Admin Panel JS
   ===================================================== */

let pendingRobotikImport = null;

document.addEventListener('DOMContentLoaded', function () {

  /* ── Auth Check ── */
  if (sessionStorage.getItem('kodzen_admin') !== '1') {
    window.location.href = 'login.html';
    return;
  }

  /* ── Init ── */
  loadDashboard();
  renderGalleryAdmin();
  renderDemoRequests();
  renderMessages();
  loadSettings();
  loadRobotikContent();

  /* ── Sidebar Navigation ── */
  document.querySelectorAll('.sidebar-nav-item[data-section]').forEach(item => {
    item.addEventListener('click', function () {
      const sectionId = this.dataset.section;
      showSection(sectionId);
    });
  });

  /* ── Logout ── */
  document.getElementById('logoutBtn')?.addEventListener('click', function () {
    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
      sessionStorage.removeItem('kodzen_admin');
      window.location.href = 'login.html';
    }
  });

  /* ── Gallery Add Form ── */
  document.getElementById('addGalleryForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('gTitle').value.trim();
    const type = document.getElementById('gType').value;
    const url = document.getElementById('gUrl').value.trim();
    const category = document.getElementById('gCategory').value;

    if (!title || !url || !type || !category) {
      showAdminAlert('addGalleryAlert', 'error', 'Tüm alanları doldurun.');
      return;
    }

    KodzenData.addGallery({ title, type, url, category });
    this.reset();
    renderGalleryAdmin();
    loadDashboard();
    showAdminAlert('addGalleryAlert', 'success', 'Galeri öğesi eklendi.');
  });

  /* ── Settings Form ── */
  document.getElementById('settingsForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const settings = {
      phone: document.getElementById('sPhone').value.trim(),
      whatsapp: document.getElementById('sWhatsapp').value.trim(),
      email: document.getElementById('sEmail').value.trim(),
      address: document.getElementById('sAddress').value.trim(),
      liveChatMsg: document.getElementById('sLiveChatMsg').value.trim()
    };
    KodzenData.updateSettings(settings);
    showAdminAlert('settingsAlert', 'success', 'Ayarlar kaydedildi.');
  });

  document.getElementById('robotikContentForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    saveRobotikContent();
  });

  document.getElementById('robotikResetBtn')?.addEventListener('click', function () {
    localStorage.removeItem('kodzen_robotik_content');
    loadRobotikContent();
    showAdminAlert('robotikAlert', 'success', 'Varsayılan Robotik içerikleri geri yüklendi.');
  });

  document.getElementById('addRoadmapItemBtn')?.addEventListener('click', function () {
    addRoadmapEditorRow();
  });

  document.getElementById('addProjectItemBtn')?.addEventListener('click', function () {
    addProjectEditorRow();
  });

  document.getElementById('robotikExportBtn')?.addEventListener('click', exportRobotikContentAsJson);

  document.getElementById('robotikImportBtn')?.addEventListener('click', function () {
    document.getElementById('robotikImportFile')?.click();
  });

  document.getElementById('robotikImportFile')?.addEventListener('change', importRobotikContentFromJson);
  document.getElementById('robotikImportApplyBtn')?.addEventListener('click', applyRobotikImportPreview);
  document.getElementById('robotikImportCancelBtn')?.addEventListener('click', clearRobotikImportPreview);

});

/* ── Show Section ── */
function showSection(sectionId) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav-item[data-section]').forEach(i => i.classList.remove('active'));

  const section = document.getElementById('section-' + sectionId);
  if (section) section.classList.add('active');

  const navItem = document.querySelector(`.sidebar-nav-item[data-section="${sectionId}"]`);
  if (navItem) navItem.classList.add('active');

  // Update topbar title
  const titles = {
    dashboard: 'Dashboard',
    gallery: 'Galeri Yönetimi',
    demos: 'Demo Talepleri',
    messages: 'Mesajlar',
    visibility: 'Sayfa & Bölüm Yönetimi',
    themes: 'Temalar',
    ticker: 'Haber Bandı',
    robotik: 'Robotik Kodlama',
    settings: 'Ayarlar'
  };
  const topbarTitle = document.getElementById('topbarTitle');
  if (topbarTitle) topbarTitle.textContent = titles[sectionId] || sectionId;
}

/* ── Dashboard ── */
function loadDashboard() {
  const gallery = KodzenData.getGallery();
  const demos = KodzenData.getDemoRequests();
  const messages = KodzenData.getMessages();

  setEl('statGallery', gallery.length);
  setEl('statDemos', demos.length);
  setEl('statMessages', messages.length);

  // Recent demos
  const recentDemosTbody = document.getElementById('recentDemosTbody');
  if (recentDemosTbody) {
    if (demos.length === 0) {
      recentDemosTbody.innerHTML = '<tr><td colspan="5" class="text-center" style="color:var(--text-dim);padding:20px">Henüz demo talebi yok.</td></tr>';
    } else {
      recentDemosTbody.innerHTML = demos.slice(0, 5).map(d => `
        <tr>
          <td style="color:#fff;font-weight:600">${esc(d.name)}</td>
          <td>${esc(d.company)}</td>
          <td>${esc(d.email)}</td>
          <td>${productBadge(d.product)}</td>
          <td style="color:var(--text-dim);font-size:0.78rem">${esc(d.date || '')}</td>
        </tr>`).join('');
    }
  }

  // Recent messages
  const recentMsgsTbody = document.getElementById('recentMsgsTbody');
  if (recentMsgsTbody) {
    if (messages.length === 0) {
      recentMsgsTbody.innerHTML = '<tr><td colspan="4" class="text-center" style="color:var(--text-dim);padding:20px">Henüz mesaj yok.</td></tr>';
    } else {
      recentMsgsTbody.innerHTML = messages.slice(0, 5).map(m => `
        <tr>
          <td style="color:#fff;font-weight:600">${esc(m.name)}</td>
          <td>${esc(m.email)}</td>
          <td>${esc(m.subject)}</td>
          <td style="color:var(--text-dim);font-size:0.78rem">${esc(m.date || '')}</td>
        </tr>`).join('');
    }
  }
}

/* ── Gallery Admin ── */
function renderGalleryAdmin() {
  const tbody = document.getElementById('galleryAdminTbody');
  if (!tbody) return;
  const items = KodzenData.getGallery();

  if (items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="color:var(--text-dim);padding:20px">Galeri boş.</td></tr>';
    return;
  }

  tbody.innerHTML = items.map(item => `
    <tr>
      <td style="color:var(--text-dim)">#${item.id}</td>
      <td style="color:#fff;font-weight:600">${esc(item.title)}</td>
      <td>${item.type === 'video' ? '<span class="badge-purple">Video</span>' : '<span class="badge-teal">Resim</span>'}</td>
      <td>${categoryBadge(item.category)}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.78rem;font-family:monospace;color:var(--text-dim)" title="${esc(item.url)}">${esc(item.url)}</td>
      <td>
        <div class="d-flex gap-1">
          <button class="btn-icon" onclick="openEditGallery(${item.id})" title="Düzenle"><i class="bi bi-pencil"></i></button>
          <button class="btn-icon danger" onclick="deleteGalleryItem(${item.id})" title="Sil"><i class="bi bi-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

function deleteGalleryItem(id) {
  if (!confirm('Bu galeri öğesini silmek istediğinize emin misiniz?')) return;
  KodzenData.deleteGallery(id);
  renderGalleryAdmin();
  loadDashboard();
}

function openEditGallery(id) {
  const items = KodzenData.getGallery();
  const item = items.find(i => i.id === id);
  if (!item) return;

  document.getElementById('editGalleryId').value = item.id;
  document.getElementById('editGTitle').value = item.title;
  document.getElementById('editGType').value = item.type;
  document.getElementById('editGUrl').value = item.url;
  document.getElementById('editGCategory').value = item.category;

  const modal = new bootstrap.Modal(document.getElementById('editGalleryModal'));
  modal.show();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('editGalleryForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('editGalleryId').value);
    const updates = {
      title: document.getElementById('editGTitle').value.trim(),
      type: document.getElementById('editGType').value,
      url: document.getElementById('editGUrl').value.trim(),
      category: document.getElementById('editGCategory').value
    };
    KodzenData.updateGallery(id, updates);
    renderGalleryAdmin();
    loadDashboard();
    bootstrap.Modal.getInstance(document.getElementById('editGalleryModal')).hide();
  });
});

/* ── Demo Requests ── */
function renderDemoRequests() {
  const tbody = document.getElementById('demosTbody');
  if (!tbody) return;
  const items = KodzenData.getDemoRequests();

  if (items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="color:var(--text-dim);padding:24px">Henüz demo talebi bulunmuyor.</td></tr>';
    return;
  }

  tbody.innerHTML = items.map(d => `
    <tr>
      <td style="color:#fff;font-weight:600">${esc(d.name)}</td>
      <td>${esc(d.company)}</td>
      <td><a href="mailto:${esc(d.email)}" style="color:var(--primary)">${esc(d.email)}</a></td>
      <td>${esc(d.phone || '—')}</td>
      <td>${productBadge(d.product)}</td>
      <td style="color:var(--text-dim);font-size:0.78rem;white-space:nowrap">${esc(d.date || '')}</td>
      <td>
        <button class="btn-icon danger" onclick="deleteDemoReq(${d.id})" title="Sil"><i class="bi bi-trash"></i></button>
      </td>
    </tr>`).join('');

  setEl('demoCount', items.length);
}

function deleteDemoReq(id) {
  if (!confirm('Bu demo talebini silmek istediğinize emin misiniz?')) return;
  KodzenData.deleteDemoRequest(id);
  renderDemoRequests();
  loadDashboard();
}

/* ── Messages ── */
function renderMessages() {
  const tbody = document.getElementById('messagesTbody');
  if (!tbody) return;
  const items = KodzenData.getMessages();

  if (items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center" style="color:var(--text-dim);padding:24px">Henüz mesaj bulunmuyor.</td></tr>';
    return;
  }

  tbody.innerHTML = items.map(m => `
    <tr>
      <td style="color:#fff;font-weight:600">${esc(m.name)}</td>
      <td><a href="mailto:${esc(m.email)}" style="color:var(--primary)">${esc(m.email)}</a></td>
      <td>${esc(m.subject)}</td>
      <td style="color:var(--text-dim);font-size:0.78rem;white-space:nowrap">${esc(m.date || '')}</td>
      <td>
        <div class="d-flex gap-1">
          <button class="btn-icon" onclick="viewMessage(${m.id})" title="Görüntüle"><i class="bi bi-eye"></i></button>
          <button class="btn-icon danger" onclick="deleteMsg(${m.id})" title="Sil"><i class="bi bi-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');

  setEl('msgCount', items.length);
}

function viewMessage(id) {
  const messages = KodzenData.getMessages();
  const msg = messages.find(m => m.id === id);
  if (!msg) return;

  document.getElementById('viewMsgName').textContent = msg.name;
  document.getElementById('viewMsgEmail').textContent = msg.email;
  document.getElementById('viewMsgSubject').textContent = msg.subject;
  document.getElementById('viewMsgDate').textContent = msg.date || '';
  document.getElementById('viewMsgBody').textContent = msg.message;

  const modal = new bootstrap.Modal(document.getElementById('viewMessageModal'));
  modal.show();
}

function deleteMsg(id) {
  if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
  KodzenData.deleteMessage(id);
  renderMessages();
  loadDashboard();
}

/* ── Settings ── */
function loadSettings() {
  const s = KodzenData.getSettings();
  setVal('sPhone', s.phone);
  setVal('sWhatsapp', s.whatsapp);
  setVal('sEmail', s.email);
  setVal('sAddress', s.address);
  setVal('sLiveChatMsg', s.liveChatMsg);
}

function loadRobotikContent() {
  const defaults = getDefaultRobotikContent();

  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem('kodzen_robotik_content') || '{}');
  } catch (e) {
    saved = {};
  }

  const content = normalizeRobotikContent({ ...defaults, ...saved });
  setVal('rHeroBadge', content.heroBadge);
  setVal('rHeroTitle', content.heroTitle);
  setVal('rHeroDesc', content.heroDesc);
  setVal('rPrimaryBtn', content.primaryBtn);
  setVal('rSecondaryBtn', content.secondaryBtn);

  renderRoadmapEditor(content.roadmapItems);
  renderProjectEditor(content.projects);
}

function saveRobotikContent() {
  const content = buildRobotikContentPayload();
  localStorage.setItem('kodzen_robotik_content', JSON.stringify(content));
  showAdminAlert('robotikAlert', 'success', 'Robotik Kodlama içerikleri kaydedildi.');
}

function getDefaultRobotikContent() {
  return {
    heroBadge: 'Sıfırdan Profesyonel Seviyeye AI & Robotik Eğitim Platformu',
    heroTitle: 'Build the Future with AI & Robotics',
    heroDesc: 'Gerçek dünya projeleri, algoritma mantığı, sensör sistemleri ve üretken yapay zeka araçları ile öğrenciler, geliştiriciler ve teknoloji meraklıları için uçtan uca öğrenme yolu.',
    primaryBtn: 'Start Learning',
    secondaryBtn: 'View Roadmap',
    roadmapItems: [
      { title: 'Scratch ile blok kodlama', desc: 'Akış, mantık, döngü ve olay yapısını öğren.' },
      { title: 'Temel Python', desc: 'Değişkenler, koşullar, fonksiyonlar ve veri yapıları.' },
      { title: 'Arduino projeleri', desc: 'LED, sensör, servo motor ve robotik hareket mantığı.' },
      { title: 'AI temelleri', desc: 'Veri, model, tahmin, prompt ve basit bilgisayarlı görü.' },
      { title: 'Gerçek robot inşa et', desc: 'Algılayan, karar veren ve hareket eden prototip üret.' }
    ],
    projects: [
      {
        level: 'Başlangıç',
        tech: 'Arduino + IR Sensor',
        title: 'Çizgi İzleyen Robot',
        desc: 'Sensörlerden gelen veriyi okuyup siyah çizgiyi takip eden temel robot projesi.',
        btn: 'Start Project'
      },
      {
        level: 'Orta',
        tech: 'Python + Vision',
        title: 'Nesne Algılayan AI Uygulaması',
        desc: 'Kameradan görüntü alıp objeleri tanımlayan ve sonuçları ekranda gösteren proje.',
        btn: 'Start Project'
      },
      {
        level: 'İleri',
        tech: 'Speech + Automation',
        title: 'Sesli Asistan Robot',
        desc: 'Ses komutunu algılayıp eyleme dönüştüren, akıllı ev mantığına bağlanabilen asistan.',
        btn: 'Start Project'
      }
    ]
  };
}

function normalizeRobotikContent(content) {
  const defaults = getDefaultRobotikContent();
  const roadmapItems = Array.isArray(content.roadmapItems) ? content.roadmapItems : defaults.roadmapItems;
  const projects = Array.isArray(content.projects) ? content.projects : defaults.projects;

  return {
    heroBadge: content.heroBadge || defaults.heroBadge,
    heroTitle: content.heroTitle || defaults.heroTitle,
    heroDesc: content.heroDesc || defaults.heroDesc,
    primaryBtn: content.primaryBtn || defaults.primaryBtn,
    secondaryBtn: content.secondaryBtn || defaults.secondaryBtn,
    roadmapItems: roadmapItems
      .map(item => ({ title: String(item.title || '').trim(), desc: String(item.desc || '').trim() }))
      .filter(item => item.title && item.desc)
      .slice(0, 8),
    projects: projects
      .map(item => ({
        level: String(item.level || '').trim(),
        tech: String(item.tech || '').trim(),
        title: String(item.title || '').trim(),
        desc: String(item.desc || '').trim(),
        btn: String(item.btn || 'Start Project').trim() || 'Start Project'
      }))
      .filter(item => item.level && item.tech && item.title && item.desc)
      .slice(0, 6)
  };
}

function renderRoadmapEditor(items) {
  const container = document.getElementById('rRoadmapEditor');
  if (!container) return;
  container.innerHTML = '';
  (items || []).forEach(item => addRoadmapEditorRow(item));
  wireSortable(container, '.roadmap-row');
}

function renderProjectEditor(items) {
  const container = document.getElementById('rProjectEditor');
  if (!container) return;
  container.innerHTML = '';
  (items || []).forEach(item => addProjectEditorRow(item));
  wireSortable(container, '.project-row');
}

function buildRobotikContentPayload() {
  return normalizeRobotikContent({
    heroBadge: document.getElementById('rHeroBadge')?.value.trim() || '',
    heroTitle: document.getElementById('rHeroTitle')?.value.trim() || '',
    heroDesc: document.getElementById('rHeroDesc')?.value.trim() || '',
    primaryBtn: document.getElementById('rPrimaryBtn')?.value.trim() || '',
    secondaryBtn: document.getElementById('rSecondaryBtn')?.value.trim() || '',
    roadmapItems: collectRoadmapItemsFromEditor(),
    projects: collectProjectsFromEditor()
  });
}

function addRoadmapEditorRow(item = { title: '', desc: '' }) {
  const container = document.getElementById('rRoadmapEditor');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'row g-2 align-items-end roadmap-row';
  row.draggable = true;
  row.innerHTML = `
    <div class="col-md-1 d-grid">
      <button type="button" class="btn-icon drag-roadmap-item" title="Sürükle"><i class="bi bi-grip-vertical"></i></button>
    </div>
    <div class="col-md-3">
      <input type="text" class="admin-form-control roadmap-title" placeholder="Başlık" value="${esc(item.title || '')}">
    </div>
    <div class="col-md-7">
      <input type="text" class="admin-form-control roadmap-desc" placeholder="Açıklama" value="${esc(item.desc || '')}">
    </div>
    <div class="col-md-1 d-grid">
      <button type="button" class="btn-icon danger remove-roadmap-item" title="Sil"><i class="bi bi-trash"></i></button>
    </div>`;

  row.querySelector('.remove-roadmap-item')?.addEventListener('click', function () {
    row.remove();
  });

  container.appendChild(row);
  wireSortable(container, '.roadmap-row');
}

function addProjectEditorRow(item = { level: '', tech: '', title: '', desc: '', btn: 'Start Project' }) {
  const container = document.getElementById('rProjectEditor');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'p-2 rounded project-row';
  row.draggable = true;
  row.style.background = 'rgba(255,255,255,.03)';
  row.style.border = '1px solid var(--border)';
  row.innerHTML = `
    <div class="row g-2">
      <div class="col-md-2"><input type="text" class="admin-form-control project-level" placeholder="Seviye" value="${esc(item.level || '')}"></div>
      <div class="col-md-4"><input type="text" class="admin-form-control project-tech" placeholder="Teknoloji" value="${esc(item.tech || '')}"></div>
      <div class="col-md-4"><input type="text" class="admin-form-control project-title" placeholder="Başlık" value="${esc(item.title || '')}"></div>
      <div class="col-md-2 d-flex gap-1">
        <button type="button" class="btn-icon drag-project-item" title="Sürükle"><i class="bi bi-grip-vertical"></i></button>
        <button type="button" class="btn-icon danger remove-project-item" title="Sil"><i class="bi bi-trash"></i></button>
      </div>
      <div class="col-md-9"><input type="text" class="admin-form-control project-desc" placeholder="Açıklama" value="${esc(item.desc || '')}"></div>
      <div class="col-md-3"><input type="text" class="admin-form-control project-btn" placeholder="Buton" value="${esc(item.btn || 'Start Project')}"></div>
    </div>`;

  row.querySelector('.remove-project-item')?.addEventListener('click', function () {
    row.remove();
  });

  container.appendChild(row);
  wireSortable(container, '.project-row');
}

function wireSortable(container, selector) {
  const rows = Array.from(container.querySelectorAll(selector));
  rows.forEach(row => {
    if (row.dataset.sortableBound === '1') return;
    row.dataset.sortableBound = '1';

    row.addEventListener('dragstart', function (e) {
      row.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', 'drag');
    });

    row.addEventListener('dragend', function () {
      row.classList.remove('dragging');
    });

    row.addEventListener('dragover', function (e) {
      e.preventDefault();
      const dragging = container.querySelector('.dragging');
      if (!dragging || dragging === row) return;
      const rect = row.getBoundingClientRect();
      const before = e.clientY < rect.top + rect.height / 2;
      if (before) {
        container.insertBefore(dragging, row);
      } else {
        container.insertBefore(dragging, row.nextSibling);
      }
    });
  });
}

function collectRoadmapItemsFromEditor() {
  return Array.from(document.querySelectorAll('#rRoadmapEditor .row')).map(row => ({
    title: row.querySelector('.roadmap-title')?.value.trim() || '',
    desc: row.querySelector('.roadmap-desc')?.value.trim() || ''
  })).filter(item => item.title && item.desc);
}

function collectProjectsFromEditor() {
  return Array.from(document.querySelectorAll('#rProjectEditor .p-2')).map(row => ({
    level: row.querySelector('.project-level')?.value.trim() || '',
    tech: row.querySelector('.project-tech')?.value.trim() || '',
    title: row.querySelector('.project-title')?.value.trim() || '',
    desc: row.querySelector('.project-desc')?.value.trim() || '',
    btn: row.querySelector('.project-btn')?.value.trim() || 'Start Project'
  })).filter(item => item.level && item.tech && item.title && item.desc);
}

function exportRobotikContentAsJson() {
  const payload = buildRobotikContentPayload();
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'robotik-content.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showAdminAlert('robotikAlert', 'success', 'Robotik içerik JSON dosyası dışa aktarıldı.');
}

function importRobotikContentFromJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    try {
      const parsed = JSON.parse(String(reader.result || '{}'));
      const normalized = normalizeRobotikContent(parsed);
      pendingRobotikImport = normalized;
      showRobotikImportPreview(normalized);
      showAdminAlert('robotikAlert', 'success', 'JSON dosyası okundu. Önizlemeyi kontrol edip uygula butonuna basın.');
    } catch (e) {
      showAdminAlert('robotikAlert', 'error', 'JSON dosyası okunamadı. Geçerli bir dosya seçin.');
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file, 'utf-8');
}

function showRobotikImportPreview(data) {
  const wrap = document.getElementById('robotikImportPreviewWrap');
  const text = document.getElementById('robotikImportPreviewText');
  if (!wrap || !text) return;
  text.textContent = JSON.stringify(data, null, 2);
  wrap.style.display = 'block';
}

function clearRobotikImportPreview() {
  pendingRobotikImport = null;
  const wrap = document.getElementById('robotikImportPreviewWrap');
  const text = document.getElementById('robotikImportPreviewText');
  if (text) text.textContent = '';
  if (wrap) wrap.style.display = 'none';
}

function applyRobotikImportPreview() {
  if (!pendingRobotikImport) {
    showAdminAlert('robotikAlert', 'error', 'Uygulanacak bir önizleme bulunamadı.');
    return;
  }
  localStorage.setItem('kodzen_robotik_content', JSON.stringify(pendingRobotikImport));
  loadRobotikContent();
  clearRobotikImportPreview();
  showAdminAlert('robotikAlert', 'success', 'Önizleme verisi başarıyla uygulandı.');
}

/* ── Helpers ── */
function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function productBadge(p) {
  if (!p) return '<span class="badge-gray">—</span>';
  if (p.toLowerCase().includes('gis')) return `<span class="badge-teal">${esc(p)}</span>`;
  if (p.toLowerCase().includes('whats')) return `<span class="badge-blue">${esc(p)}</span>`;
  if (p.toLowerCase().includes('ck')) return `<span class="badge-purple">${esc(p)}</span>`;
  return `<span class="badge-orange">${esc(p)}</span>`;
}

function categoryBadge(c) {
  const map = { 'ai-gis': 'badge-teal', 'whatsypzck': 'badge-blue', 'ckmesaj': 'badge-purple', 'genel': 'badge-gray' };
  return `<span class="${map[c] || 'badge-gray'}">${esc(c)}</span>`;
}

function showAdminAlert(containerId, type, message) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.className = `admin-alert ${type}`;
  el.innerHTML = `<i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i> ${message}`;
  el.style.display = 'flex';
  if (type === 'success') {
    setTimeout(() => { el.style.display = 'none'; }, 4000);
  }
}
