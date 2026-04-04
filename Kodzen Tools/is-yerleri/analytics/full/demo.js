(function(){
const KEY='kodzen_full_analytics_records';
const q=(id)=>document.getElementById(id);
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
const write=(v)=>localStorage.setItem(KEY,JSON.stringify(v));
function render(){
  const items=read();
  q('count').textContent=String(items.length);
  q('tbody').innerHTML=items.map((x,i)=>`<tr><td>${x.title}</td><td>${x.owner}</td><td>${x.status}</td><td><button data-i="${i}">Sil</button></td></tr>`).join('');
  document.querySelectorAll('button[data-i]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.i);const arr=read();arr.splice(i,1);write(arr);render();});
}
q('save').onclick=()=>{const t=q('title').value.trim();const o=q('owner').value.trim();const s=q('status').value;if(!t||!o)return;const arr=read();arr.push({title:t,owner:o,status:s,createdAt:new Date().toISOString()});write(arr);q('title').value='';q('owner').value='';render();};
q('clearAll').onclick=()=>{write([]);render();};
render();
})();