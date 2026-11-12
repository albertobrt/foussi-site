// ===== Fond animé : des boules de papier froissé deviennent des oiseaux en origami =====
(function(){
const cv=document.getElementById('bg'),cx=cv.getContext('2d'),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
let W=0,H=0,R=40,CY=0,GA=1,balls=[],mx=-999,my=-999,last=performance.now()/1000;
const rnd=(function(seed){return function(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646}})(7);
const ease=x=>x*x*(3-2*x),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const col=(l,a)=>'rgba('+(l*.93|0)+','+(l*.97|0)+','+(Math.min(255,l)|0)+','+a+')';
// Oiseau origami (profil, regarde à droite) : triangles [x1,y1,x2,y2,x3,y3] + luminosité
const BODY=[[[.52,-.02,.33,-.22,.30,.02],235],[[.33,-.22,.30,.02,.12,-.06],185],[[.12,-.06,.30,.02,.18,.16],150],[[.12,-.06,.18,.16,-.05,.2],115],[[.12,-.06,-.12,-.12,-.05,.2],170],[[-.12,-.12,-.05,.2,-.55,.02],135],[[-.05,.2,-.55,.02,-.42,.22],95]];
const WING=[[[.18,-.08,-.18,-.08,.28,-.62],245],[[-.18,-.08,-.34,-.58,.28,-.62],205]];
function tri(p,l,a,dx,f){
 cx.fillStyle=cx.strokeStyle=col(l,a);cx.beginPath();
 for(let i=0;i<3;i++){const x=p[i*2]+(dx||0),y=f==null?p[i*2+1]:-.08+(p[i*2+1]+.08)*f;i?cx.lineTo(x,y):cx.moveTo(x,y)}
 cx.closePath();cx.fill();cx.stroke();
}
function bird(x,y,s,rot,f,a){
 cx.save();cx.translate(x,y);cx.rotate(rot);cx.scale(s,s);cx.lineWidth=.014;cx.lineJoin='round';
 WING.forEach(w=>tri(w[0],w[1]*.55,a,-.07,f*.8+.1));
 BODY.forEach(b=>tri(b[0],b[1],a));
 WING.forEach(w=>tri(w[0],w[1],a,0,f));
 cx.restore();
}
// Boule de papier froissé : facettes irrégulières, éclairées en haut à gauche
function mkBall(r){
 const n=13,P=[],Q=[],T=[];
 for(let k=0;k<n;k++){const a=k/n*6.2832+(rnd()-.5)*.25,rr=r*(.82+rnd()*.28);P.push([Math.cos(a)*rr,Math.sin(a)*rr*.96]);const r2=rr*(.42+rnd()*.2),a2=a+(rnd()-.5)*.4;Q.push([Math.cos(a2)*r2-r*.06,Math.sin(a2)*r2-r*.06])}
 const C0=[-r*.05,-r*.05],lum=(a,b,c)=>{const mx_=(a[0]+b[0]+c[0])/3,my_=(a[1]+b[1]+c[1])/3;return clamp(105+(mx_*-.6+my_*-.8)/r*80+(rnd()-.5)*70,45,240)};
 for(let k=0;k<n;k++){const k2=(k+1)%n;[[P[k],P[k2],Q[k]],[P[k2],Q[k2],Q[k]],[Q[k],Q[k2],C0]].forEach(t=>T.push([t[0][0],t[0][1],t[1][0],t[1][1],t[2][0],t[2][1],lum(t[0],t[1],t[2])]))}
 return T;
}
function ball(b,x,y,s,a){
 cx.save();cx.translate(x,y);cx.scale(s,s);cx.lineWidth=.8;cx.lineJoin='round';
 b.tris.forEach(t=>{cx.fillStyle=cx.strokeStyle=col(t[6],a);cx.beginPath();cx.moveTo(t[0],t[1]);cx.lineTo(t[2],t[3]);cx.lineTo(t[4],t[5]);cx.closePath();cx.fill();cx.stroke()});
 cx.restore();
}
function init(){
 const wide=W>=900,n=wide?5:W<700?4:6;GA=W<700?.6:1;R=Math.max(24,Math.min(64,W*.05));CY=H-R*2.2-6;balls=[];
 for(let i=0;i<n;i++){const x=wide?W*(.56+.38*i/(n-1)):W*(.12+.76*i/(n-1));
  balls.push({x,tris:mkBall(R*(.92+rnd()*.16)),C:14+rnd()*5,t:i*1.3+.5,seed:rnd()*6.28,ex:x+(W-x)*.45+W*.12,s:1})}
}
function size(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);init()}
function frame(dt,T){
 cx.clearRect(0,0,W,H);
 const fy=CY+R*.98;
 balls.forEach(b=>{
  if(!reduce){const u0=b.t%b.C,near=Math.hypot(mx-b.x,my-CY)<R*1.7;b.t+=dt*((near&&u0<2.5)?6:1)}
  const u=reduce?(b.t<4?0:5.8):b.t%b.C;
  const breath=1+Math.sin(T*1.2+b.seed)*.012;
  // reflet au sol
  cx.save();cx.translate(0,2*fy);cx.scale(1,-1);ball(b,b.x,CY,breath,.1*GA);cx.restore();
  const bs=R*2.7;let showBird=false,bx=b.x,by=CY-R*.4,sc=0,rot=-.12,f=.2,al=.5;
  if(u>=2.5&&u<5){const e=ease((u-2.5)/2.5);showBird=true;sc=bs*(.25+.75*e);by=CY-R*.3-e*R*1.15;f=.15+.25*e;rot=-.12*e}
  else if(u>=5&&u<6.6){const e=ease((u-5)/1.6);showBird=true;sc=bs;by=CY-R*1.45-Math.sin(T*2)*2;f=.25+.65*e+Math.sin(T*3+b.seed)*.06;rot=-.18}
  else if(u>=6.6&&u<13){
   const tt=(u-6.6)/6.4,y0=CY-R*1.45,pos=k=>[b.x+(b.ex-b.x)*Math.pow(k,1.2)+Math.sin(k*6+b.seed)*R*.3*(1-k),y0-(y0+R*5)*Math.pow(k,.9)+Math.sin(k*9+b.seed)*R*.25*(1-k)];
   const p=pos(tt),q=pos(Math.min(1,tt+.02));showBird=true;bx=p[0];by=p[1];sc=bs*(1-.35*tt);rot=clamp(Math.atan2(q[1]-p[1],q[0]-p[0]),-.95,.3);f=Math.sin(T*9+b.seed)*.9+.1;al=.5*(1-clamp((tt-.8)/.2,0,1));
  }
  if(showBird)bird(bx,by,sc,rot,f,al*GA);
  ball(b,b.x,CY,breath,.55*GA);
 });
 cx.fillStyle='rgba(255,255,255,.12)';cx.fillRect(balls[0].x-R*1.4,fy,balls[balls.length-1].x-balls[0].x+R*2.8,1);
}
addEventListener('resize',size);addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
size();
if(reduce){frame(0,0)}
else(function loop(){const T=performance.now()/1000,dt=Math.min(.05,T-last)*(window.__speed||1);last=T;frame(dt,T);requestAnimationFrame(loop)})();
})();

// Titre : apparition mot par mot
const t=document.getElementById('t');
t.innerHTML=t.textContent.split(' ').map((w,i)=>`<span class="w"><span style="animation-delay:${.15+i*.1}s">${w}</span></span>`).join(' ');
// Formulaire : ouvre le mail du visiteur (à remplacer par Formspree si besoin)
document.getElementById('f').addEventListener('submit',e=>{
 e.preventDefault();const d=new FormData(e.target);
 location.href='mailto:contact@foussi.fr?subject='+encodeURIComponent('Projet – '+d.get('nom'))+'&body='+encodeURIComponent(d.get('projet')+'\n\n'+d.get('email'));
});
