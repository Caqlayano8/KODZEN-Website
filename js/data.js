/* =====================================================
   KODZEN TEKNOLOJİ — Data Manager (LocalStorage)
   ===================================================== */

const STORAGE_KEY = 'kodzen_data';

const DEFAULT_DATA = {
  gallery: [
    { id: 1, type: 'image', title: 'AI-GIS Harita Görünümü', url: 'https://via.placeholder.com/800x500/0d1117/00c4a0?text=AI-GIS+Map', category: 'ai-gis' },
    { id: 2, type: 'image', title: 'WhatsYpzck Admin Panel', url: 'https://via.placeholder.com/800x500/0d1117/00c4a0?text=WhatsYpzck+Admin', category: 'whatsypzck' },
    { id: 3, type: 'image', title: 'CKmesaj Arayüzü', url: 'https://via.placeholder.com/800x500/0d1117/00c4a0?text=CKmesaj+UI', category: 'ckmesaj' },
    { id: 4, type: 'video', title: 'AI-GIS Demo Videosu', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', category: 'ai-gis' },
  ],
  demoRequests: [],
  messages: [],
  products: [
    { id: 'ai-gis', name: 'AI-GIS Infrastructure System', visible: true },
    { id: 'ckmesaj', name: 'CKmesaj', visible: true },
    { id: 'whatsypzck', name: 'WhatsYpzck', visible: true }
  ],
  settings: {
    phone: '05458966096',
    whatsapp: '905458966096',
    email: 'kurtoqluo8@gmail.com',
    address: 'Artvin, Türkiye',
    liveChatMsg: 'Merhaba! Size nasıl yardımcı olabiliriz?'
  }
};

const KodzenData = {

  /* ── Core ── */
  getData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA));
      const data = JSON.parse(raw);
      // Merge with defaults to ensure all keys exist
      return {
        gallery: data.gallery ?? DEFAULT_DATA.gallery,
        demoRequests: data.demoRequests ?? [],
        messages: data.messages ?? [],
        products: data.products ?? DEFAULT_DATA.products,
        settings: { ...DEFAULT_DATA.settings, ...(data.settings ?? {}) }
      };
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  },

  saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('KodzenData: save error', e);
      return false;
    }
  },

  /* ── Gallery ── */
  getGallery() {
    return this.getData().gallery || [];
  },

  addGallery(item) {
    const data = this.getData();
    const maxId = data.gallery.reduce((m, g) => Math.max(m, g.id || 0), 0);
    const newItem = { ...item, id: maxId + 1 };
    data.gallery.push(newItem);
    this.saveData(data);
    return newItem;
  },

  updateGallery(id, updates) {
    const data = this.getData();
    const idx = data.gallery.findIndex(g => g.id === id);
    if (idx === -1) return false;
    data.gallery[idx] = { ...data.gallery[idx], ...updates };
    this.saveData(data);
    return true;
  },

  deleteGallery(id) {
    const data = this.getData();
    data.gallery = data.gallery.filter(g => g.id !== id);
    this.saveData(data);
    return true;
  },

  /* ── Demo Requests ── */
  getDemoRequests() {
    return this.getData().demoRequests || [];
  },

  addDemoRequest(req) {
    const data = this.getData();
    const maxId = data.demoRequests.reduce((m, r) => Math.max(m, r.id || 0), 0);
    const newReq = {
      ...req,
      id: maxId + 1,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    data.demoRequests.unshift(newReq);
    this.saveData(data);
    return newReq;
  },

  deleteDemoRequest(id) {
    const data = this.getData();
    data.demoRequests = data.demoRequests.filter(r => r.id !== id);
    this.saveData(data);
    return true;
  },

  /* ── Messages ── */
  getMessages() {
    return this.getData().messages || [];
  },

  addMessage(msg) {
    const data = this.getData();
    const maxId = data.messages.reduce((m, r) => Math.max(m, r.id || 0), 0);
    const newMsg = {
      ...msg,
      id: maxId + 1,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    data.messages.unshift(newMsg);
    this.saveData(data);
    return newMsg;
  },

  deleteMessage(id) {
    const data = this.getData();
    data.messages = data.messages.filter(m => m.id !== id);
    this.saveData(data);
    return true;
  },

  /* ── Settings ── */
  getSettings() {
    return this.getData().settings;
  },

  updateSettings(settings) {
    const data = this.getData();
    data.settings = { ...data.settings, ...settings };
    this.saveData(data);
    return true;
  }
};

// Make globally available
window.KodzenData = KodzenData;
