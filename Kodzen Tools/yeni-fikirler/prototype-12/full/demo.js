(()=>{
const KEY='kdz_prototype-12_rows';
const q=(id)=>document.getElementById(id);
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
const write=(a)=>localStorage.setItem(KEY,JSON.stringify(a));
function render(){
  const data=read();
  q('rows').innerHTML=data.map((x,i)=>`<tr><td>${x.title}</td><td>${x.f1}</td><td>${x.status}</td><td>${x.date}</td><td><button data-del="${i}">Sil</button></td></tr>`).join('');
  document.querySelectorAll('button[data-del]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.del);const a=read();a.splice(i,1);write(a);render();});
  q('k1').textContent=String(data.length);
  q('k2').textContent=String(data.filter(x=>x.status===q('doneVal').textContent).length);
  q('k3').textContent=String(data.reduce((s,x)=>s+(Number(x.f4)||0),0));
}
q('save').onclick=()=>{
  const title=q('title').value.trim(); if(!title) return;
  const row={title,f1:q('f1').value,f2:q('f2').value,f3:q('f3').value,f4:q('f4').value,status:q('status').value,date:new Date().toLocaleString('tr-TR')};
  const data=read(); data.push(row); write(data);
  ['title','f1','f2','f3','f4'].forEach(id=>q(id).value='');
  render();
};
q('wipe').onclick=()=>{write([]);render();};
render();
})();