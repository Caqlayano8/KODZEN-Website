/* =====================================================
   KODZEN TEKNOLOJİ — Admin Panel JS
   ===================================================== */

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
