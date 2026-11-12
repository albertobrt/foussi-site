// ===== Réalisations : une par une, pilotées par le scroll =====
const META={
 'Lovely Angel Events':{d:'Un site élégant pour une entreprise de décoration et d’événementiel : univers doré, navigation par services et demande de devis.',t:['Décoration','Événementiel','Sur mesure']},
 'Montreuil FC':{d:'Le site d’un club de football : prochain match avec compte à rebours, boutique et adhésion au club.',t:['Club de foot','Compte à rebours','Sur mesure']},
 'Foussi.fr':{d:'Mon propre site : un œil en 3D dans une galaxie, des animations au scroll et une mer en bas de page.',t:['3D','Animations','Portfolio']}
};
const wr=document.getElementById('web'),stage=document.getElementById('stage'),cnt=document.getElementById('cnt'),prog=document.getElementById('prog'),NB=PROJETS.length;
let ptx=0,pty=0;
const sls=PROJETS.map((p,i)=>{
 const m=META[p.nom]||{d:p.type,t:[]},a=document.createElement('a');a.className='sl';a.href=p.url;a.target='_blank';a.rel='noopener';
 a.innerHTML=`<div class="bg" aria-hidden="true">${p.nom}</div>
 <div class="info"><div class="mono" data-j="0">${String(i+1).padStart(2,'0')} / ${String(NB).padStart(2,'0')}</div>
  <h3><span class="m"><span data-j="1">${p.nom}</span></span></h3>
  <div class="meta">${m.t.map(t=>`<span class="chip mono" data-j="2">${t}</span>`).join('')}</div>
  <p class="desc" data-j="3">${m.d}</p><span class="btn" data-j="4">Voir le site ↗</span></div>
 <div class="vis"><div class="win"><div class="bar"><i></i><i></i><i></i><span class="url">${new URL(p.url).hostname}</span></div><div class="scr"><img src="${p.img}" alt="Capture du site ${p.nom}"></div></div><div class="phn"><img src="${p.ph||p.img}" alt="Version mobile de ${p.nom}" style="object-fit:${p.phfit||'cover'}"></div></div>`;
 a._b=a.querySelector('.bg');a._w=a.querySelector('.win');a._s=a.querySelector('.scr');a._i=a.querySelector('.scr img');a._p=a.querySelector('.phn');a._r=[...a.querySelectorAll('[data-j]')];
 stage.appendChild(a);return a});
const rail=document.createElement('div');rail.id='rail';
rail.innerHTML=PROJETS.map((p,i)=>`<button class="mono" data-k="${i}">0${i+1}<span class="rn"> ${p.nom}</span><i></i></button>`).join('');stage.appendChild(rail);
rail.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const span=wr.offsetHeight-innerHeight,top=wr.getBoundingClientRect().top+scrollY;scrollTo({top:top+(+b.dataset.k+.5)/NB*span,behavior:'smooth'})});
wr.style.height=(NB+1)*100+'vh';
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
function slides(){
 const r=wr.getBoundingClientRect(),span=wr.offsetHeight-innerHeight;
 const p=Math.min(NB-.001,Math.max(0,-r.top/span*NB)),pre=sm(0,1,Math.min(1,Math.max(0,1-r.top/(innerHeight*.9)))),act=Math.floor(p);
 cnt.textContent='02 / Réalisations web — '+String(act+1).padStart(2,'0')+' / '+String(NB).padStart(2,'0');
 [...rail.children].forEach((b,k)=>{b.classList.toggle('on',k===act);b.lastElementChild.style.width=(k<act?100:k===act?(p-act)*100:0)+'%'});
 sls.forEach((a,k)=>{
  const x=p-k,en=k===0?pre:sm(0,.3,x),ex=k===NB-1?0:sm(.7,1,x),o=Math.max(0,Math.min(1,en*(1-ex)));
  a.style.opacity=o;a.style.pointerEvents=o>.6?'auto':'none';
  a._w.style.transform=`translateY(${(1-en)*14-ex*8}vh) rotateX(${(1-en)*22-pty*5}deg) rotateY(${(1-en)*-14+ex*14+ptx*6}deg) scale(${.84+.16*en-.07*ex})`;
  a._s.style.clipPath=`inset(${(1-sm(.12,.6,en))*100}% 0 ${ex*100}% 0)`;
  a._i.style.transform=`scale(1.14) translateY(${(x-.5)*-5}%)`;
  a._p.style.transform=`translate(${(1-en)*12}vw,${(1-en)*30}vh)`;
  a._b.style.transform=`translateX(${(x-.5)*-24}vw) translateY(-50%)`;
  a._r.forEach(el=>{const j=+el.dataset.j,t=sm(.06+j*.09,.4+j*.09,en);
   if(el.parentNode.classList.contains('m'))el.style.transform=`translateY(${(1-t)*110-ex*110}%)`;
   else{el.style.opacity=t*(1-ex);el.style.transform=`translateY(${(1-t)*26-ex*18}px)`}});
 });
}
addEventListener('scroll',()=>{prog.style.width=scrollY/(document.documentElement.scrollHeight-innerHeight)*100+'%';slides()},{passive:true});
addEventListener('mousemove',e=>{ptx=e.clientX/innerWidth*2-1;pty=e.clientY/innerHeight*2-1;slides()},{passive:true});
addEventListener('resize',slides);slides();
