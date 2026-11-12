// Titre : apparition mot par mot
const t=document.getElementById('t');
t.innerHTML=t.textContent.split(' ').map((w,i)=>`<span class="w"><span style="animation-delay:${.15+i*.1}s">${w}</span></span>`).join(' ');
