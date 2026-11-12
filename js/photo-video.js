// ===== Tunnel 3D : tu voles à travers les prises au scroll =====
// Pour mettre tes vraies photos : ajoute src:'fichier ou data-uri' à une entrée (t:'photo'). Les vidéos utilisent media/centralisation.mp4.
const MEDIA=[
 {t:'photo',lab:'Événement',scene:'stade',seed:11},
 {t:'video',lab:'Vidéo'},
 {t:'photo',lab:'Portrait',scene:'portrait',seed:11},
 {t:'photo',lab:'Lifestyle',scene:'bokeh',seed:11},
 {t:'photo',lab:'Paysage',scene:'horizon',seed:11},
 {t:'video',lab:'Vidéo'},
 {t:'photo',lab:'Événement',scene:'bokeh',seed:23},
 {t:'photo',lab:'Sport',scene:'stade',seed:37}
];
(function(){
 const vfw=document.getElementById('vfw'),ring=document.getElementById('ring'),rail=document.getElementById('vrail'),rw=document.getElementById('rw'),N=MEDIA.length,STEP=620;
 const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const W=640,H=400;
 let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
 const rg=(x,y,r,a,b)=>{const g=cx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,a);g.addColorStop(1,b);return g};
 const SC={
  stade(){cx.fillStyle='#050505';cx.fillRect(0,0,W,H);
   cx.fillStyle=rg(W/2,H*.9,W*.7,'#3a3a3a','#050505');cx.fillRect(0,0,W,H);
   [[.12,.22],[.3,.14],[.7,.14],[.88,.22]].forEach(([x,y])=>{cx.fillStyle=rg(W*x,H*y,230,'rgba(255,255,255,.95)','rgba(255,255,255,0)');cx.fillRect(0,0,W,H);
    cx.fillStyle='#000';cx.fillRect(W*x-3,H*y,6,H);for(let i=0;i<6;i++){cx.fillStyle='#fff';cx.fillRect(W*x-26+(i%3)*18,H*y-18+Math.floor(i/3)*14,10,8)}});
   cx.save();cx.beginPath();cx.moveTo(W*.18,H*.62);cx.lineTo(W*.82,H*.62);cx.lineTo(W*1.05,H);cx.lineTo(-W*.05,H);cx.closePath();cx.fillStyle='#161616';cx.fill();cx.strokeStyle='rgba(255,255,255,.55)';cx.lineWidth=3;cx.stroke();
   cx.beginPath();cx.moveTo(W*.5,H*.62);cx.lineTo(W*.5,H);cx.stroke();cx.beginPath();cx.ellipse(W*.5,H*.8,W*.11,H*.07,0,0,7);cx.stroke();cx.restore();
   for(let i=0;i<260;i++){cx.fillStyle=`rgba(255,255,255,${.1+rnd()*.35})`;const y=H*.5+rnd()*H*.12;cx.fillRect(rnd()*W,y,6+rnd()*14,3+rnd()*5)}
   cx.fillStyle='#000';[[.46,.8,1],[.55,.74,.8],[.38,.7,.65]].forEach(([x,y,k])=>{cx.beginPath();cx.ellipse(W*x,H*y,14*k,34*k,0,0,7);cx.fill();cx.beginPath();cx.arc(W*x,H*y-42*k,10*k,0,7);cx.fill()})},
  portrait(){cx.fillStyle='#050505';cx.fillRect(0,0,W,H);cx.fillStyle=rg(W*.7,H*.35,H*.9,'#2d2d2d','#050505');cx.fillRect(0,0,W,H);
   cx.fillStyle='#080808';cx.beginPath();cx.ellipse(W*.5,H*.42,118,150,0,0,7);cx.fill();
   cx.beginPath();cx.moveTo(W*.2,H);cx.bezierCurveTo(W*.22,H*.72,W*.36,H*.66,W*.5,H*.66);cx.bezierCurveTo(W*.64,H*.66,W*.78,H*.72,W*.8,H);cx.fill();
   cx.fillRect(W*.5-38,H*.55,76,H*.14);
   const g=cx.createLinearGradient(W*.35,0,W*.7,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.7,'rgba(255,255,255,.1)');g.addColorStop(1,'rgba(255,255,255,.95)');
   cx.strokeStyle=g;cx.lineWidth=5;cx.beginPath();cx.ellipse(W*.5,H*.42,118,150,0,-1.2,1.1);cx.stroke();
   cx.beginPath();cx.moveTo(W*.64,H*.7);cx.bezierCurveTo(W*.7,H*.7,W*.77,H*.74,W*.8,H);cx.stroke()},
  bokeh(){cx.fillStyle=cx.createLinearGradient(0,0,0,H);cx.fillStyle.addColorStop&&0;const g=cx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#0a0a0a');g.addColorStop(1,'#2a2a2a');cx.fillStyle=g;cx.fillRect(0,0,W,H);
   for(let i=0;i<70;i++){const r=20+rnd()*85,x=rnd()*W,y=rnd()*H,a=.05+rnd()*.28;cx.fillStyle=rg(x,y,r,`rgba(255,255,255,${a*1.2})`,`rgba(255,255,255,${a*.5})`);cx.beginPath();cx.arc(x,y,r,0,7);cx.fill();cx.strokeStyle=`rgba(255,255,255,${a*1.5})`;cx.lineWidth=2;cx.stroke()}
   cx.fillStyle='#000';cx.beginPath();cx.moveTo(W*.4,H);cx.bezierCurveTo(W*.4,H*.6,W*.45,H*.5,W*.5,H*.5);cx.bezierCurveTo(W*.55,H*.5,W*.6,H*.6,W*.6,H);cx.fill();cx.beginPath();cx.arc(W*.5,H*.4,52,0,7);cx.fill()},
  horizon(){const g=cx.createLinearGradient(0,0,0,H*.62);g.addColorStop(0,'#050505');g.addColorStop(1,'#bdbdbd');cx.fillStyle=g;cx.fillRect(0,0,W,H);
   cx.fillStyle=rg(W*.62,H*.52,330,'rgba(255,255,255,1)','rgba(255,255,255,0)');cx.fillRect(0,0,W,H);cx.fillStyle='#fff';cx.beginPath();cx.arc(W*.62,H*.5,46,0,7);cx.fill();
   [['#8a8a8a',.52,70],['#4a4a4a',.58,90],['#1a1a1a',.64,110]].forEach(([c,y,a],k)=>{cx.fillStyle=c;cx.beginPath();cx.moveTo(0,H);cx.lineTo(0,H*y);for(let x=0;x<=W;x+=40)cx.lineTo(x,H*y-Math.abs(Math.sin(x*.004+k*2.1))*a-rnd()*14);cx.lineTo(W,H);cx.fill()});
   const w=cx.createLinearGradient(0,H*.7,0,H);w.addColorStop(0,'#111');w.addColorStop(1,'#050505');cx.fillStyle=w;cx.fillRect(0,H*.7,W,H*.3);
   for(let i=0;i<40;i++){cx.fillStyle=`rgba(255,255,255,${.05+rnd()*.3})`;cx.fillRect(W*.62-70+rnd()*140,H*.7+i*5,20+rnd()*90,2)}}
 };


 const frames=[],vids=[];
 MEDIA.forEach((m,i)=>{
  const f=document.createElement('div');f.className='fr';
  if(m.t==='video'){const v=document.createElement('video');v.src='media/centralisation.mp4';v.muted=true;v.loop=true;v.playsInline=true;v.preload='metadata';f.appendChild(v);vids[i]=v}
  else{const c=document.createElement('canvas');c.width=W;c.height=H;f.appendChild(c);const x=c.getContext('2d');cx=x;seed=m.seed||11;
   if(m.src){const im=new Image();im.onload=()=>x.drawImage(im,0,0,W,H);im.src=m.src}else SC[m.scene]()}
  f.insertAdjacentHTML('beforeend','<i class="c tl"></i><i class="c tr"></i><i class="c bl"></i><i class="c br"></i><span class="no mono">'+String(i+1).padStart(2,'0')+' · '+m.lab+'</span>');
  ring.appendChild(f);frames.push(f);
 });
 // poussière lumineuse en 3D
 seed=5;const dust=[];
 for(let k=0;k<70;k++){const d=document.createElement('i');d.className='dust';const x=(rnd()-.5)*2600,y=(rnd()-.5)*1400,z=-rnd()*(N-1)*STEP-200;d.style.transform=`translate3d(${x}px,${y}px,${z}px)`;d.style.opacity=(.25+rnd()*.6).toFixed(2);ring.appendChild(d)}
 rail.innerHTML=MEDIA.map(()=>'<b></b>').join('');const bars=[...rail.children];
 const XS=[],YS=[];
 function layout(){const mob=innerWidth<700,w=rw.clientWidth,h=rw.clientHeight;
  frames.forEach((f,i)=>{XS[i]=(i%2?1:-1)*w*(mob?.09:.2);YS[i]=Math.sin(i*1.7)*h*.07;
   f.style.transform=`translate3d(${XS[i]}px,${YS[i]}px,${-i*STEP}px) rotateY(${(i%2?-1:1)*-(mob?7:13)}deg)`})}
 let cur=-1,u=0,tu=0,mx=0,my=0,smx=0,smy=0;
 function setOn(i){if(i===cur)return;cur=i;frames.forEach((f,k)=>f.classList.toggle('on',k===i));bars.forEach((b,k)=>b.classList.toggle('on',k===i));
  vids.forEach((v,k)=>{if(!v)return;if(k===i){v.play().catch(()=>{})}else{try{v.pause()}catch(e){}}});
  document.getElementById('rlab').textContent=MEDIA[i].lab;document.getElementById('rn').textContent=String(i+1).padStart(2,'0')+'/'+String(N).padStart(2,'0')}
 function upd(){const r=vfw.getBoundingClientRect(),tot=r.height-innerHeight;const p=Math.min(1,Math.max(0,-r.top/tot));
  const t=p*(N-1),k=Math.min(N-2,Math.floor(t)),f=t-k;tu=k+f*f*(3-2*f)}
 addEventListener('mousemove',e=>{mx=e.clientX/innerWidth*2-1;my=e.clientY/innerHeight*2-1},{passive:true});
 const cl=(v,a,b)=>Math.max(a,Math.min(b,v)),mob=()=>innerWidth<700;
 function loop(){u+=(tu-u)*(calm?1:.09);smx+=(mx-smx)*.06;smy+=(my-smy)*.06;
  const i0=Math.min(N-2,Math.floor(u)),fr=u-i0,e=fr*fr*(3-2*fr);
  const cX=XS[i0]+(XS[i0+1]-XS[i0])*e,cY=YS[i0]+(YS[i0+1]-YS[i0])*e;
  ring.style.transform=`rotateX(${(-smy*3).toFixed(2)}deg) rotateY(${(smx*4).toFixed(2)}deg) translate3d(${(-cX).toFixed(1)}px,${(-cY).toFixed(1)}px,${(u*STEP).toFixed(1)}px)`;
  frames.forEach((f,i)=>{const d=(u-i)*STEP;let op;
   if(d<0)op=Math.pow(cl(1+d/(3.3*STEP),0,1),1.6);else op=cl(1-d/(.8*STEP),0,1);
   if(op<.01){if(f.style.display!=='none')f.style.display='none';return}
   if(f.style.display==='none')f.style.display='';
   const br=.3+.7*cl(1-Math.abs(d)/STEP,0,1),bl=mob()?0:cl((Math.abs(d)-.3*STEP)/STEP*4,0,5);
   f.style.opacity=op.toFixed(3);f.style.filter=`brightness(${br.toFixed(2)})`+(bl>.15?` blur(${bl.toFixed(1)}px)`:'')});
  setOn(Math.round(u));requestAnimationFrame(loop)}
 layout();addEventListener('resize',()=>{layout();upd()});if(document.fonts)document.fonts.ready.then(layout);
 addEventListener('scroll',upd,{passive:true});upd();u=tu;setOn(0);loop();
})();
