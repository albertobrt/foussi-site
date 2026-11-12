// ===== Goutte d'eau : elle tombe pendant le scroll, le blanc devient de l'eau qui monte =====
const wt=document.getElementById('wt'),wc=document.getElementById('wc'),wx=wc.getContext('2d');
let W=0,H=0,waterFish=[],waterFishWidth=0,waterFishLastT=performance.now()/1000;
const wsize=()=>{const d=Math.min(devicePixelRatio,2);W=innerWidth;H=innerHeight;wc.width=W*d;wc.height=H*d;wx.setTransform(d,0,0,d,0,0)};
wsize();addEventListener('resize',wsize);
const eio=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
(function water(){
 const q=wt.getBoundingClientRect();
 if(q.bottom>0&&q.top<innerHeight){
  const P=Math.min(1,Math.max(0,-q.top/(wt.offsetHeight-innerHeight))),T=performance.now()/1000,dt=Math.min(.05,T-waterFishLastT);waterFishLastT=T;
  const PI=.4,cx=W/2,Y0=H*1.04,Y1=H*.8,rr=Math.max(12,Math.min(26,W*.022)),u=Math.min(1,P/PI),s=Math.max(0,P-PI);
  const lv=P<PI?Y0+(Y1-Y0)*Math.pow(u,1.4):Y1+(-H*.25-Y1)*eio(s/(1-PI));
  const A=P>=PI?Math.min(70,H*.09)*Math.exp(-s*9):0,g=Math.max(0,(u-.7)/.3);
  wx.clearRect(0,0,W,H);
  // eau : surface ondulée, creusée par l'impact, attirée par la goutte avant
  wx.beginPath();wx.moveTo(0,H+6);
  for(let x=0;x<=W;x+=6){
   const d=Math.abs(x-cx);
   let y=lv+Math.sin(x*.012+T*1.6)*3+Math.sin(x*.027-T*2.3)*1.6;
   if(P>=PI)y+=A*Math.cos(d*.03-s*70)*Math.exp(-d/(W*.32));else y-=g*g*24*Math.exp(-d/(W*.07));
   wx.lineTo(x,y);
  }
  wx.lineTo(W,H+6);wx.closePath();wx.fillStyle='#fff';wx.fill();
  if(waterFishWidth!==W){waterFishWidth=W;waterFish=Array.from({length:10},(_,i)=>({kind:'f',len:28+Math.random()*16,x:(i+.5)*W/10,y:0,vx:(Math.random()<.5?-1:1)*(20+Math.random()*18),al:.72,ph:Math.random()*6.28,fx:0,fy:0,depth:.18+(i%4)*.17}))}
  if(P>=PI){
   for(const fish of waterFish){
    fish.x+=fish.vx*dt;
    if(fish.vx>0&&fish.x>W+fish.len*2)fish.x=-fish.len*2;
    else if(fish.vx<0&&fish.x<-fish.len*2)fish.x=W+fish.len*2;
    fish.y=lv+(H-lv)*fish.depth+Math.sin(T+fish.ph)*8;
    creature(wx,fish,T);
   }
  }
  if(P<PI){ // la goutte, qui s'étire en tombant
   const yd=-H*.08+(Y1-rr+H*.08)*u*u,st=1+u*.9;
   wx.save();wx.shadowColor='rgba(255,255,255,.55)';wx.shadowBlur=22;wx.fillStyle='#fff';
   wx.beginPath();wx.moveTo(cx,yd-rr*2.6*st);
   wx.bezierCurveTo(cx+rr*.2,yd-rr*1.4,cx+rr,yd-rr*.9,cx+rr,yd);
   wx.arc(cx,yd,rr,0,Math.PI,false);
   wx.bezierCurveTo(cx-rr,yd-rr*.9,cx-rr*.2,yd-rr*1.4,cx,yd-rr*2.6*st);
   wx.fill();wx.restore();
  }else if(s<.35){
   // éclaboussures
   for(let i=0;i<7;i++){const v=2.4-Math.abs(i-3)*.25,up=H*(v*s-9*s*s);if(up>0){wx.beginPath();wx.arc(cx+(i-3)*s*W*.8,lv-up,rr*(.55-Math.abs(i-3)*.08),0,6.2832);wx.fillStyle='#fff';wx.fill()}}
   // ondes à la surface
   for(let k=0;k<3;k++){const sk=s-k*.025;if(sk<=0)continue;const rx=sk*W*1.7,al=.14*Math.max(0,1-sk*3);
    wx.beginPath();wx.ellipse(cx,lv+4,rx,rx*.09,0,0,6.2832);wx.strokeStyle='rgba(0,0,0,'+al+')';wx.lineWidth=1.5;wx.stroke()}
  }
 }
 requestAnimationFrame(water)})();

// ===== La mer : requins et poissons qui nagent dans l'eau blanche =====
const ftn=document.getElementById('ft'),sea=document.getElementById('sea'),sx=sea.getContext('2d');
let SW=0,SH=0,smx=-999,smy=-999,seaItems=null,bubs=[],lastT=performance.now()/1000;
const seaSize=()=>{const d=Math.min(devicePixelRatio,2);SW=ftn.clientWidth;SH=ftn.clientHeight;sea.width=SW*d;sea.height=SH*d;sx.setTransform(d,0,0,d,0,0)};
ftn.addEventListener('mousemove',e=>{const r=ftn.getBoundingClientRect();smx=e.clientX-r.left;smy=e.clientY-r.top});
ftn.addEventListener('mouseleave',()=>{smx=-999});
function seaInit(){
 const it=(kind,len,x,y,vx,al)=>({kind,len,x,by:y,y,vx,al,ph:Math.random()*6.28,fx:0,fy:0});
 const L=Math.min(SW*.32,400);seaItems=[];
 seaItems.push(it('s',L,SW*.2,SH*.3,-42,.55),it('s',L*.6,SW*.7,SH*.68,58,.4));
 for(let g=0;g<3;g++){const dir=g%2?1:-1,bx=Math.random()*SW;
  for(let i=0;i<6;i++)seaItems.push(it('f',26+Math.random()*16-g*3,bx-dir*i*40,SH*(.16+g*.3)+Math.sin(i*2)*34,dir*(70+g*28),.7-g*.12))}
 bubs=Array.from({length:26},()=>({x:Math.random()*SW,y:Math.random()*SH,r:2+Math.random()*5,v:18+Math.random()*34,ph:Math.random()*6.28}));
}
function creature(c,o,T){
 const len=o.len,sh=o.kind==='s',th=len*(sh?.11:.2),N=18,amp=len*(sh?.05:.075),ph=T*(sh?1.7:6)+o.ph,dir=o.vx>0?-1:1;
 const off=t=>amp*Math.sin(ph-t*3.4)*t,hh=t=>th*Math.sin(Math.PI*Math.pow(t,sh?.7:.62));
 c.save();c.translate(o.x+o.fx,o.y+o.fy);c.scale(dir,1);c.fillStyle='#000';c.globalAlpha=o.al;
 c.beginPath();c.moveTo(0,0);
 for(let i=1;i<=N;i++){const t=i/N;c.lineTo(t*len,off(t)-hh(t))}
 for(let i=N;i>=0;i--){const t=i/N;c.lineTo(t*len,off(t)+hh(t))}
 c.closePath();c.fill();
 const tx=len,ty=off(1),tl=len*(sh?.28:.3),wg=Math.sin(ph-3.4)*tl*.35;
 c.beginPath();c.moveTo(tx-3,ty);
 if(sh){c.lineTo(tx+tl*.85,ty-tl+wg);c.lineTo(tx+tl*.4,ty+wg*.5);c.lineTo(tx+tl*.5,ty+tl*.45+wg)}
 else{c.lineTo(tx+tl,ty-tl*.6+wg);c.lineTo(tx+tl*.75,ty+wg*.4);c.lineTo(tx+tl,ty+tl*.6+wg)}
 c.closePath();c.fill();
 const t0=sh?.36:.34;
 c.beginPath();c.moveTo(len*t0,off(t0)-hh(t0)+1);c.lineTo(len*(t0+.14),off(t0+.1)-hh(t0)-th*(sh?1.5:.8));c.lineTo(len*(t0+.22),off(t0+.22)-hh(t0+.22)+1);c.fill();
 if(sh){c.beginPath();c.moveTo(len*.3,off(.3)+hh(.3)-2);c.lineTo(len*.43,off(.42)+hh(.3)+th*1.3);c.lineTo(len*.43,off(.42)+hh(.42)-2);c.fill()}
 c.globalAlpha=1;c.fillStyle='#fff';c.beginPath();c.arc(len*.14,off(.14)-hh(.14)*.2,Math.max(1.6,th*.15),0,6.2832);c.fill();
 c.restore();
}
(function seaLoop(){
 const q=ftn.getBoundingClientRect(),T=performance.now()/1000,dt=Math.min(.05,T-lastT);lastT=T;
 if(q.bottom>0&&q.top<innerHeight){
  if(sea.width!==Math.round(ftn.clientWidth*Math.min(devicePixelRatio,2))||SH!==ftn.clientHeight){seaSize();seaItems=null}
  if(!seaItems)seaInit();
  sx.clearRect(0,0,SW,SH);
  for(const b of bubs){b.y-=b.v*dt;b.x+=Math.sin(T+b.ph)*10*dt;if(b.y<-10){b.y=SH+10;b.x=Math.random()*SW}
   sx.beginPath();sx.arc(b.x,b.y,b.r,0,6.2832);sx.strokeStyle='rgba(0,0,0,.28)';sx.lineWidth=1.2;sx.stroke()}
  for(const o of seaItems){
   o.x+=o.vx*dt;o.y=o.by+Math.sin(T*.6+o.ph)*(o.kind==='s'?18:12);
   const m=o.len*1.9;if(o.vx>0&&o.x>SW+m)o.x=-m;else if(o.vx<0&&o.x<-m)o.x=SW+m;
   const dx=o.x+o.fx-smx,dy=o.y+o.fy-smy,d=Math.hypot(dx,dy);
   if(d<140&&d>1){const f=(140-d)/140*300*dt;o.fx+=dx/d*f;o.fy+=dy/d*f}
   o.fx*=.985;o.fy*=.985;creature(sx,o,T);
  }
 }
 requestAnimationFrame(seaLoop)})();
