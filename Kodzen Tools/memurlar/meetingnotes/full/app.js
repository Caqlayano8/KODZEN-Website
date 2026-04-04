
(function(){
  const APP_ID = "meetingnotes";
  const APP_NAME = "Kodzen MeetingNotes";
  const APP_GROUP = "memurlar";
  const APP_SUMMARY = "Toplanti notlarini kaydetme.";
  const STORAGE_KEY = `kodzen_full_${APP_ID}_records`;

  const qs = (id) => document.getElementById(id);

  function safeRead(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  }
  function safeWrite(v){ localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); }

  function fmtDate(iso){
    try { return new Date(iso).toLocaleString('tr-TR'); }
    catch { return iso; }
  }

  function renderStats(items){
    qs('statTotal').textContent = String(items.length);
    qs('statDone').textContent = String(items.filter(x => x.status === 'Tamamlandi').length);
    qs('statActive').textContent = String(items.filter(x => x.status !== 'Tamamlandi').length);
  }

  function renderTable(){
    const body = qs('recordsBody');
    const items = safeRead();
    renderStats(items);
    body.innerHTML = items.map((it, idx) => `
      <tr>
        <td>${it.title}</td>
        <td>${it.owner}</td>
        <td>${it.status}</td>
        <td>${fmtDate(it.createdAt)}</td>
        <td><button data-del="${idx}">Sil</button></td>
      </tr>
    `).join('');

    body.querySelectorAll('button[data-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = Number(btn.getAttribute('data-del'));
        const arr = safeRead();
        arr.splice(i,1);
        safeWrite(arr);
        renderTable();
      });
    });
  }

  function addRecord(){
    const title = qs('fTitle').value.trim();
    const owner = qs('fOwner').value.trim();
    const status = qs('fStatus').value;
    const notes = qs('fNotes').value.trim();
    if(!title || !owner) return;
    const arr = safeRead();
    arr.push({ title, owner, status, notes, createdAt: new Date().toISOString() });
    safeWrite(arr);
    qs('fTitle').value='';
    qs('fOwner').value='';
    qs('fNotes').value='';
    renderTable();
  }

  function exportJson(){
    const data = safeRead();
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${APP_ID}-records.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 600);
  }

  function importJson(file){
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const parsed = JSON.parse(String(rd.result || '[]'));
        if(!Array.isArray(parsed)) throw new Error('invalid');
        safeWrite(parsed);
        renderTable();
      } catch {
        alert('Gecersiz JSON dosyasi.');
      }
    };
    rd.readAsText(file);
  }

  function fillInfo(){
    qs('appName').textContent = APP_NAME;
    qs('appGroup').textContent = APP_GROUP;
    qs('appSummary').textContent = APP_SUMMARY;
    qs('setupPs1').setAttribute('href', '../setup/setup.ps1');
    qs('setupBat').setAttribute('href', '../setup/setup.bat');
    qs('docTxt').setAttribute('href', '../docs/tanitim.txt');
    qs('metaJson').setAttribute('href', '../app.json');

    qs('diagBox').textContent = [
      `APP: ${APP_NAME}`,
      `GROUP: ${APP_GROUP}`,
      `KEY: ${STORAGE_KEY}`,
      `RECORDS: ${safeRead().length}`,
      `READY: true`
    ].join('\n');
  }

  function setupTabs(){
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const id = tab.getAttribute('data-tab');
        document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(x => x.classList.remove('active'));
        tab.classList.add('active');
        qs(`panel-${id}`).classList.add('active');
      });
    });
  }

  function boot(){
    fillInfo();
    setupTabs();
    qs('btnSave').addEventListener('click', addRecord);
    qs('btnExport').addEventListener('click', exportJson);
    qs('btnClearAll').addEventListener('click', () => { safeWrite([]); renderTable(); });
    qs('jsonFile').addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if(f) importJson(f);
      e.target.value = '';
    });
    renderTable();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
