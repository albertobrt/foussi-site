// ===== Apparition au scroll =====
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

// ===== Pied de page : mot géant ajusté à la largeur =====
const wm=document.getElementById('wm');
const fit=()=>{wm.style.fontSize='100px';wm.style.fontSize=(100*wm.parentElement.clientWidth/wm.scrollWidth)+'px'};
fit();addEventListener('resize',fit);if(document.fonts)document.fonts.ready.then(fit);
