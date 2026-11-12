// ===== Vidéo « Vision centrée client » : lecture quand visible =====
const pv=document.getElementById('pv');
if(pv)new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const p=pv.play();if(p&&p.catch)p.catch(()=>{})}else pv.pause()}),{threshold:.25}).observe(pv);

// ===== Ce que je fais : cartes qui s'empilent, visuels animés =====
const svI=(id,src)=>{const e=document.getElementById(id);if(e)e.src=src};
svI('sa',IMG_LAE);svI('sb',IMG_MFC);svI('p1','img/photo-1.jpg');svI('p2','img/photo-2.jpg');svI('p3','img/photo-3.jpg');
const burl=document.getElementById('burl'),bsa=document.getElementById('sa');setInterval(()=>{let t=0;try{const a=bsa.getAnimations()[0];t=a?(a.currentTime%8000):0}catch(e){}burl.textContent=t<4000?'lovelyangel.fr':'montreuil-fc.fr'},100);
const vv=document.getElementById('vv'),tcE=document.getElementById('tc'),pad=n=>String(n).padStart(2,'0');
if(vv){new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const p=vv.play();if(p&&p.catch)p.catch(()=>{})}else vv.pause()}),{threshold:.3}).observe(vv);
 vv.addEventListener('timeupdate',()=>{const t=vv.currentTime;tcE.textContent=pad(Math.floor(t/60))+':'+pad(Math.floor(t%60))+':'+pad(Math.floor(t%1*25))})}
const pics=document.getElementById('pics');
new IntersectionObserver(es=>es.forEach(e=>pics.classList.toggle('on',e.isIntersecting)),{threshold:.55}).observe(pics);
const scs=[...document.querySelectorAll('.sc')];
function stack(){scs.forEach((c,i)=>{const n=scs[i+1];if(!n){return}const q=n.getBoundingClientRect().top,p=Math.min(1,Math.max(0,(innerHeight*.9-q)/(innerHeight*.6)));c.style.transform=`scale(${1-.05*p})`;c.style.filter=`brightness(${1-.45*p})`})}
addEventListener('scroll',stack,{passive:true});addEventListener('resize',stack);stack();
