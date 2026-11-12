// ===== Curseur viseur =====
const cur=document.getElementById('cur');
addEventListener('mousemove',e=>{cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';cur.classList.toggle('big',!!e.target.closest('a,button,input,textarea,canvas'))});
addEventListener('mousedown',()=>cur.classList.add('press'));
addEventListener('mouseup',()=>cur.classList.remove('press'));

// ===== Œil 3D =====
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const cv=document.getElementById('cv');
const renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
const scene=new THREE.Scene();
const cam=new THREE.PerspectiveCamera(40,1,.1,100);cam.position.z=11;
scene.add(new THREE.AmbientLight(0xffffff,.55));
const dl=new THREE.DirectionalLight(0xffffff,1.1);dl.position.set(3,4,6);scene.add(dl);
const white=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.55,metalness:.1});
const black=new THREE.MeshBasicMaterial({color:0x000000});

const eye=new THREE.Group();scene.add(eye);
const lid=new THREE.Group();eye.add(lid);

// Logo tracé à partir de l'image : les vrais contours, extrudés en 3D
const K=.0082,LY=6.5; // échelle et décalage vertical du centre de l'objectif
const D={"T":[[415,-99],[371,-146],[318,-189],[266,-222],[208,-250],[157,-268],[89,-284],[36,-290],[-30,-289],[-88,-280],[-148,-263],[-218,-234],[-276,-203],[-335,-165],[-404,-111],[-462,-56],[-497,-15],[-457,24],[-388,81],[-324,126],[-283,150],[-225,177],[-172,196],[-118,210],[-76,218],[-124,200],[-168,180],[-212,156],[-255,128],[-292,100],[-342,57],[-394,6],[-412,-15],[-384,-51],[-341,-95],[-297,-132],[-253,-163],[-216,-185],[-176,-205],[-106,-228],[-57,-238],[-6,-244],[57,-245],[89,-243],[142,-236],[191,-225],[263,-199],[334,-161],[374,-133]],"B":[[496,15],[454,-25],[406,-63],[347,-104],[288,-138],[238,-161],[172,-184],[128,-195],[65,-206],[149,-173],[197,-149],[231,-129],[275,-99],[333,-54],[410,15],[410,18],[383,52],[327,109],[278,149],[228,182],[180,207],[145,221],[67,241],[26,247],[-17,250],[-72,249],[-116,245],[-160,238],[-210,226],[-244,215],[-285,198],[-318,181],[-362,153],[-397,126],[-431,95],[-401,132],[-351,179],[-301,214],[-246,243],[-179,268],[-120,282],[-60,289],[15,288],[80,278],[133,264],[211,235],[277,202],[337,164],[395,119],[449,69]],"C":[[-13,-105],[-28,-102],[-43,-97],[-57,-90],[-73,-79],[-89,-63],[-102,-43],[-111,-20],[-114,-5],[-114,20],[-110,39],[-100,62],[-88,79],[-74,93],[-58,104],[-46,110],[-28,116],[-6,119],[14,118],[37,112],[56,103],[73,91],[90,73],[102,54],[110,33],[113,18],[113,-6],[112,-9],[103,-2],[93,3],[81,6],[70,6],[58,3],[52,24],[45,35],[35,45],[19,54],[8,57],[-11,57],[-22,54],[-37,45],[-48,33],[-52,26],[-56,14],[-57,-2],[-55,-12],[-51,-22],[-46,-30],[-34,-42],[-28,-46],[-13,-52],[0,-53],[2,-56],[4,-67],[11,-80],[20,-90],[35,-99],[30,-102],[14,-105]],"K":[[-187,-93],[-175,-94],[-173,-138],[-127,-138],[-126,-149],[-184,-150],[-187,-146]]};
const sh=(p,oy=0)=>{const s=new THREE.Shape();p.forEach((q,i)=>{const x=q[0]*K,y=-(q[1]-oy)*K;i?s.lineTo(x,y):s.moveTo(x,y)});s.closePath();return s};
const ext=(s,d,b)=>new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:!!b,bevelSize:b||0,bevelThickness:b||0,bevelSegments:2});
// Paupières : contour haut et contour bas (avec leurs lames intérieures)
[D.T,D.B].forEach(p=>lid.add(new THREE.Mesh(ext(sh(p),.3,.02),white)));
// Objectif : bague, disque échancré, reflet, viseur
const pupil=new THREE.Group();pupil.position.set(0,-LY*K,.1);eye.add(pupil);
const rs=new THREE.Shape();rs.absarc(0,0,149.4*K,0,6.2832);
const hp=new THREE.Path();hp.absarc(0,0,136.5*K,0,6.2832,true);rs.holes.push(hp);
pupil.add(new THREE.Mesh(ext(rs,.12,.015),white));
pupil.add(new THREE.Mesh(ext(sh(D.C,LY),.2,.02),white));
const gs=new THREE.Shape();gs.absarc(66*K,(LY+42)*K,22.2*K,0,6.2832);
const glint=new THREE.Mesh(ext(gs,.08,.01),white);glint.position.z=.2;pupil.add(glint);
const brk=new THREE.Group();pupil.add(brk);
[0,1].forEach(fx=>[0,1].forEach(fy=>{
 const p=D.K.map(([x,y])=>[fx?-x:x,fy?7-y:y]);
 brk.add(new THREE.Mesh(ext(sh(p,LY),.1),white));
}));
eye.position.z=0;
const eyeWidth=new THREE.Box3().setFromObject(eye).getSize(new THREE.Vector3()).x*1.18;
let cameraBaseZ=11;
// Particules flottantes (poussière lumineuse)
const NP=700,pa=new Float32Array(NP*3);for(let i=0;i<NP;i++){pa[i*3]=(Math.random()-.5)*30;pa[i*3+1]=(Math.random()-.5)*18;pa[i*3+2]=(Math.random()-.5)*22-4}
const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pa,3));
const pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0xffffff,size:.045,transparent:true,opacity:.55}));scene.add(pts);

function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cameraBaseZ=Math.max(11,eyeWidth/(2*Math.tan(THREE.MathUtils.degToRad(cam.fov/2))*cam.aspect));cam.position.z=cameraBaseZ;cam.updateProjectionMatrix()}
resize();addEventListener('resize',resize);

let mx=0,my=0,tx=0,ty=0,open=reduce?1:0,t0=performance.now(),scroll=0,flash=0;
let lastMove=-1e9,gNext=0,nextBlink=3000,blinkT=-1;
const aim=e=>{const p=e.touches?e.touches[0]:e;mx=p.clientX/innerWidth*2-1;my=p.clientY/innerHeight*2-1;lastMove=performance.now()};
addEventListener('mousemove',aim);
addEventListener('touchstart',aim,{passive:true});
addEventListener('touchmove',aim,{passive:true});
addEventListener('scroll',()=>{scroll=Math.min(1,scrollY/(innerHeight*.9))},{passive:true});
cv.addEventListener('click',()=>{flash=1});

const ht=document.getElementById('ht');
const flashEl=document.createElement('div');flashEl.style.cssText='position:fixed;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:70';document.body.appendChild(flashEl);
const ease=x=>1-Math.pow(1-x,3);

function loop(now){
 const el=(now-t0)/1000;
 if(!reduce)open=ease(Math.min(1,Math.max(0,(el-.6)/1.2)));
 if(!reduce&&open>=1&&blinkT<0&&now>nextBlink){blinkT=now;nextBlink=now+2500+Math.random()*3500}
 let bl=1;if(blinkT>=0){const q=(now-blinkT)/220;if(q>=1)blinkT=-1;else bl=1-Math.sin(q*Math.PI)*.92}
 lid.scale.y=(.04+.96*open)*bl;
 pupil.scale.setScalar(open>0.3?1:open/.3);
 // Coups d'œil automatiques quand personne ne bouge (téléphone surtout)
 const idle=!reduce&&now-lastMove>2500;
 if(idle&&now>gNext){if(Math.random()<.25){mx=0;my=0}else{mx=(Math.random()*2-1)*1.1;my=(Math.random()*2-1)*.8}gNext=now+700+Math.random()*1500}
 const sp=idle?.16:.06;
 tx+=(mx-tx)*sp;ty+=(my-ty)*sp;
 const auto=0;
 eye.rotation.y=(tx*.5)+auto;eye.rotation.x=ty*.3;
 eye.scale.setScalar(1+Math.sin(el*1.4)*.012);
 pts.rotation.y=el*.03+tx*.12;pts.rotation.x=ty*.06;pts.position.y=scroll*3;
 cam.position.x=tx*.35;cam.position.y=-ty*.2;
 pupil.position.x=tx*.35;pupil.position.y=-ty*.25-LY*K;
 // focus pull du viseur
 const f=1+Math.max(0,1.6-el)*.6;brk.scale.setScalar(Math.max(1,f));
 // zoom dans la pupille au scroll
 cam.position.z=cameraBaseZ-scroll*(cameraBaseZ-(innerWidth<700?1.4:1.2));
 ht.style.opacity=1-scroll*1.6;
 cv.style.opacity=scroll>.98?Math.max(0,1-(scrollY-innerHeight*.9)/(innerHeight*.5)):1;
 flash*=.9;flashEl.style.opacity=flash>.02?flash:0;
 renderer.render(scene,cam);requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
