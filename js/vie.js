// ===== Vie : horloge Paris, titres masqués, boutons magnétiques =====
const clk=document.getElementById('clk'),tick=()=>{clk.textContent=new Date().toLocaleTimeString('fr-FR',{timeZone:'Europe/Paris'})};tick();setInterval(tick,1000);
document.querySelectorAll('h2').forEach(h=>{h.innerHTML=h.textContent.split(' ').map((w,i)=>`<span class="w"><span style="transition-delay:${i*.08}s">${w}</span></span>`).join(' ')});
document.querySelectorAll('.btn').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`});b.addEventListener('mouseleave',()=>b.style.transform='')});
const stm=document.getElementById('stm');stm.innerHTML=stm.textContent.split(' ').map(w=>`<span>${w}</span>`).join(' ');
const sw=[...stm.querySelectorAll('span')],bands=[...document.querySelectorAll('.band .row')];let fxLast=scrollY;const ftEl=document.getElementById('ft');
(function fx(){
 const y=scrollY,sk=Math.max(-12,Math.min(12,(y-fxLast)*.25));fxLast=y;
 bands.forEach(r=>{r.style.transform=`translateX(${+r.dataset.d*y*.35}px) skewX(${-sk*.6}deg)`});
 const r=stm.getBoundingClientRect(),p=(innerHeight*.85-r.top)/(innerHeight*.5+r.height);
 sw.forEach((w,i)=>w.classList.toggle('on',i/sw.length<p));
 requestAnimationFrame(fx)})();

// ===== Écran de chargement =====
let p=0;const pc=document.getElementById('pct');
const iv=setInterval(()=>{p+=Math.ceil(Math.random()*14);if(p>=100){p=100;clearInterval(iv);setTimeout(()=>{document.getElementById('loader').classList.add('done');t0=performance.now()},250)}pc.textContent=String(p).padStart(2,'0')},70);
