// Œil 3D du logo Foussi Vision (Three.js r128, script classique)
// Modèle reconstruit à partir des courbes exactes du logo ; animation reprise de foussi-site.
// Paupières qui s'ouvrent et clignent, pupille qui suit la souris, coups d'œil, viseur.
(function () {
  const hero = document.querySelector('.hero');
  const cadre = document.querySelector('.hero__scene');
  const cv = document.querySelector('.hero__canvas');
  if (!hero || !cadre || !cv || !window.THREE) return;
  try { demarrer(); } catch (e) { console.warn('Œil 3D indisponible :', e); }

  function demarrer() {
    const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(40, 1, .1, 100); cam.position.z = 11;

    // Lumières : une principale, une douce de l'autre côté, un ciel/sol pour modeler les biseaux
    scene.add(new THREE.HemisphereLight(0xffffff, 0x3a3a3a, .6));
    const cle = new THREE.DirectionalLight(0xffffff, 1.0); cle.position.set(3, 4, 6); scene.add(cle);
    const douce = new THREE.DirectionalLight(0xffffff, .35); douce.position.set(-5, -2, 4); scene.add(douce);
    const pointe = new THREE.PointLight(0xffffff, .7, 25); scene.add(pointe);   // reflet qui suit le regard

    // Matières : blanc céramique verni, verre noir pour le fond de l'objectif
    const white = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: .38, metalness: 0, clearcoat: .7, clearcoatRoughness: .2 });
    const verre = new THREE.MeshPhysicalMaterial({ color: 0x060606, roughness: .12, metalness: 0, clearcoat: 1, clearcoatRoughness: .05 });

    const racine = new THREE.Group(); scene.add(racine);   // placement dans le cadre
    const eye = new THREE.Group(); racine.add(eye);
    const lid = new THREE.Group(); eye.add(lid);

    // --- Paupières : courbes de Bézier exactes du logo (pixels du logo 1254 × 1254)
    const K = .0082, CX = 627, CY = 646.5, LY = 6.5;   // l'objectif est centré en (627, 653)
    function chemin(d) {
      const s = new THREE.Shape(), t = d.match(/[MCL]|-?[\d.]+/g); let cmd = '', i = 0;
      const px = () => { const x = (parseFloat(t[i++]) - CX) * K, y = -(parseFloat(t[i++]) - CY) * K; return [x, y]; };
      while (i < t.length) {
        if (/[MCL]/.test(t[i])) cmd = t[i++];
        if (cmd === 'M') { s.moveTo(...px()); cmd = 'L'; }
        else if (cmd === 'L') s.lineTo(...px());
        else if (cmd === 'C') { const a = px(), b = px(), c = px(); s.bezierCurveTo(a[0], a[1], b[0], b[1], c[0], c[1]); }
      }
      return s;
    }
    const ext = (s, d, b, seg) => new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: !!b, bevelSize: b || 0, bevelThickness: b || 0, bevelSegments: 4, curveSegments: seg || 24 });
    ['M 600.500 357.136 C 509.234 364.991, 411.040 402.709, 312.911 467.601 C 246.534 511.497, 176.906 573.118, 133.576 626.313 L 129.656 631.125 141.578 643.153 C 174.747 676.617, 233.133 724.670, 279.500 756.665 C 347.380 803.506, 416.983 834.530, 497 853.613 C 516.625 858.293, 550.737 865.036, 554.345 864.947 C 555.530 864.918, 549.075 862.278, 540 859.080 C 501.371 845.466, 477.254 834.982, 443.500 817.130 C 381.409 784.292, 322.178 739.289, 257.164 675.554 C 242.290 660.973, 216 632.756, 216 631.373 C 216 628.744, 244.324 595.033, 261.790 576.874 C 324.925 511.233, 412.855 453.248, 484.332 430.121 C 561.078 405.289, 645.952 396.730, 727.500 405.598 C 838.604 417.680, 932.523 457.465, 1020.978 529.917 C 1026.741 534.638, 1034.514 541.377, 1038.252 544.893 C 1041.989 548.410, 1045.255 551.078, 1045.510 550.823 C 1045.765 550.569, 1040.868 544.542, 1034.630 537.430 C 985.563 481.497, 914.494 430.132, 845.398 400.663 C 790.435 377.222, 732.651 362.463, 676.409 357.502 C 658.109 355.887, 617.289 355.691, 600.500 357.136', 'M 687 439.388 C 687 439.689, 690.919 441.131, 695.708 442.592 C 732.397 453.783, 797.319 482.663, 837 505.445 C 889.751 535.731, 969.591 597.258, 1027.384 652.161 L 1038.268 662.500 1028.455 675 C 1006.671 702.751, 987.739 723.614, 965.743 744.109 C 898.799 806.483, 829.170 849.030, 758 871.054 C 661.869 900.801, 555.240 903.485, 446.500 878.894 C 354.115 858.002, 270.195 812.356, 203.250 746.585 C 197.063 740.506, 192 735.894, 192 736.335 C 192 737.761, 214.558 765.402, 225.284 777.119 C 293.087 851.186, 381.594 900.895, 487.500 924.388 C 528.830 933.557, 560.818 936.557, 608.238 935.713 C 660.495 934.783, 701.773 928.130, 755.500 911.978 C 856.565 881.595, 943.348 833.346, 1029.106 759.861 C 1041.499 749.242, 1048.652 742.654, 1068.152 723.898 C 1082.968 709.648, 1124 664.376, 1124 662.279 C 1124 659.390, 1083.408 622.352, 1059.318 603.260 C 941.686 510.032, 842.481 464.641, 708 442.513 C 699.475 441.110, 691.263 439.710, 689.750 439.402 C 688.237 439.093, 687 439.087, 687 439.388'].forEach(d => {
      const m = new THREE.Mesh(ext(chemin(d), .26, .02, 12), white); m.position.z = -.13; lid.add(m);
    });

    // --- Objectif (centré sur l'origine du groupe "pupil")
    const pupil = new THREE.Group(); pupil.position.set(0, -LY * K, .1); eye.add(pupil);
    // fond en verre noir : il accroche la lumière quand l'œil bouge
    const fond = new THREE.Mesh(new THREE.CylinderGeometry(137 * K, 137 * K, .06, 96), verre);
    fond.rotation.x = Math.PI / 2; fond.position.z = -.08; pupil.add(fond);
    // bague
    const rs = new THREE.Shape(); rs.absarc(0, 0, 149.4 * K, 0, Math.PI * 2);
    const hp = new THREE.Path(); hp.absarc(0, 0, 136.5 * K, 0, Math.PI * 2, true); rs.holes.push(hp);
    pupil.add(new THREE.Mesh(ext(rs, .12, .018, 96), white));
    // iris en C : disque de 114 px moins la pupille et l'échancrure (cercles exacts du logo)
    function formeC() {
      const O = { x: 0, y: 0, r: 114 }, N = { x: 64.5, y: 58.5, r: 59 }, I = { x: -1.2, y: 4.5, r: 54.3 };
      const inter = (a, b) => {
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), l = (a.r * a.r - b.r * b.r + d * d) / (2 * d), h = Math.sqrt(a.r * a.r - l * l);
        const mx = a.x + dx * l / d, my = a.y + dy * l / d;
        return [{ x: mx + h * dy / d, y: my - h * dx / d }, { x: mx - h * dy / d, y: my + h * dx / d }];
      };
      const dans = (c, p) => Math.hypot(p.x - c.x, p.y - c.y) < c.r;
      const ang = (c, p) => Math.atan2(p.y - c.y, p.x - c.x);
      const s = new THREE.Shape();
      const arc = (c, p, q, ok) => {
        const a0 = ang(c, p), a1 = ang(c, q); let d = a1 - a0; while (d < 0) d += Math.PI * 2;
        const m = a0 + d / 2, ccw = ok({ x: c.x + c.r * Math.cos(m), y: c.y + c.r * Math.sin(m) });
        s.absarc(c.x * K, c.y * K, c.r * K, a0, a1, !ccw);
      };
      const [A, B] = inter(O, N), [Q1, Q2] = inter(N, I);
      const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
      const QB = dist(Q1, B) < dist(Q2, B) ? Q1 : Q2, QA = QB === Q1 ? Q2 : Q1;
      s.moveTo(A.x * K, A.y * K);
      arc(O, A, B, p => !dans(N, p));
      arc(N, B, QB, p => dans(O, p) && !dans(I, p));
      arc(I, QB, QA, p => !dans(N, p));
      arc(N, QA, A, p => dans(O, p) && !dans(I, p));
      return s;
    }
    const iris = new THREE.Mesh(ext(formeC(), .16, .02, 96), white); iris.position.z = .03; pupil.add(iris);
    // reflet
    const gs = new THREE.Shape(); gs.absarc(66 * K, 48.9 * K, 22.5 * K, 0, Math.PI * 2);
    const glint = new THREE.Mesh(ext(gs, .08, .018, 48), white); glint.position.z = .16; pupil.add(glint);
    // viseur : 4 coins en L (mêmes coins que foussi-site)
    const coin = [[-187, -93], [-175, -94], [-173, -138], [-127, -138], [-126, -149], [-184, -150], [-187, -146]];
    const brk = new THREE.Group(); pupil.add(brk);
    [0, 1].forEach(fx => [0, 1].forEach(fy => {
      const s = new THREE.Shape();
      coin.forEach(([x, y], i) => { const X = (fx ? -x : x) * K, Y = -((fy ? 7 - y : y) - LY) * K; i ? s.lineTo(X, Y) : s.moveTo(X, Y); });
      const m = new THREE.Mesh(ext(s, .08, .012, 1), white); m.position.z = .02; brk.add(m);
    }));
    const taille = new THREE.Box3().setFromObject(eye).getSize(new THREE.Vector3());

    // Placement : l'œil remplit le cadre .hero__scene, le canvas couvre tout le hero
    const base = { x: 0, y: 0, s: 1 };
    function resize() {
      const rh = hero.getBoundingClientRect();
      const w = Math.max(1, rh.width), h = Math.max(1, rh.height);
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
      const unite = 2 * cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) / h;
      const r = cadre.getBoundingClientRect();
      base.x = (r.left - rh.left + r.width / 2 - w / 2) * unite;
      base.y = -(r.top - rh.top + r.height / 2 - h / 2) * unite;
      base.s = Math.min(r.width * unite / (taille.x * 1.1), r.height * unite / (taille.y * 1.1));
    }
    resize();
    addEventListener('resize', resize);
    if (window.ResizeObserver) new ResizeObserver(resize).observe(hero);

    // Regard : la souris ou le doigt, sinon des coups d'œil automatiques
    let mx = 0, my = 0, tx = 0, ty = 0, open = reduce ? 1 : 0; const t0 = performance.now();
    let lastMove = -1e9, gNext = 0, nextBlink = 3000, blinkT = -1, coupFin = 0, nextCoup = 6000 + Math.random() * 4000, sx = 0, sy = 0;
    const aim = e => {
      const p = e.touches ? e.touches[0] : e;
      const r = cadre.getBoundingClientRect();
      sx = Math.max(-1.2, Math.min(1.2, (p.clientX - (r.left + r.width / 2)) / (innerWidth / 2)));
      sy = Math.max(-1, Math.min(1, (p.clientY - (r.top + r.height / 2)) / (innerHeight / 2)));
      if (now() > coupFin) { mx = sx; my = sy; }
      lastMove = now();
    };
    const now = () => performance.now();
    addEventListener('mousemove', aim, { passive: true });
    addEventListener('touchstart', aim, { passive: true });
    addEventListener('touchmove', aim, { passive: true });

    const ease = x => 1 - Math.pow(1 - x, 3);
    let actif = true;
    new IntersectionObserver(([e]) => { actif = e.isIntersecting; if (actif) requestAnimationFrame(loop); }).observe(hero);

    function loop(t) {
      if (!actif) return;
      const el = (t - t0) / 1000;
      if (!reduce) open = ease(Math.min(1, Math.max(0, (el - .6) / 1.2)));
      // clignement
      if (!reduce && open >= 1 && blinkT < 0 && t > nextBlink) { blinkT = t; nextBlink = t + 2500 + Math.random() * 3500; }
      let bl = 1; if (blinkT >= 0) { const q = (t - blinkT) / 220; if (q >= 1) blinkT = -1; else bl = 1 - Math.sin(q * Math.PI) * .92; }
      lid.scale.y = (.04 + .96 * open) * bl;
      pupil.scale.setScalar(open > .3 ? 1 : open / .3);
      // coups d'œil automatiques quand personne ne bouge
      const idle = !reduce && t - lastMove > 2500;
      if (idle && t > gNext) { if (Math.random() < .25) { mx = 0; my = 0; } else { mx = (Math.random() * 2 - 1) * 1.1; my = (Math.random() * 2 - 1) * .8; } gNext = t + 700 + Math.random() * 1500; }
      // et de temps en temps, même pendant que la souris bouge : un regard sur le côté puis retour
      if (!reduce && !idle && open >= 1 && t > nextCoup) { const c = Math.random() < .5 ? -1 : 1; mx = c * 1.1; my = (Math.random() * 2 - 1) * .4; coupFin = t + 550; nextCoup = t + 6000 + Math.random() * 5000; }
      if (coupFin && t > coupFin) { mx = sx; my = sy; coupFin = 0; }
      const sp = idle || coupFin ? .16 : .06;
      tx += (mx - tx) * sp; ty += (my - ty) * sp;
      eye.rotation.y = tx * .5; eye.rotation.x = ty * .3;
      eye.scale.setScalar(1 + Math.sin(el * 1.4) * .012);
      pupil.position.x = tx * .35; pupil.position.y = -ty * .25 - LY * K;
      pointe.position.set(base.x - tx * 3, base.y + ty * 2 + 1.5, 6);
      // mise au point du viseur à l'ouverture
      brk.scale.setScalar(reduce ? 1 : Math.max(1, 1 + Math.max(0, 1.6 - el) * .6));
      // défilement : l'œil recule et pâlit en quittant l'écran
      const rh = hero.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -rh.top / Math.max(1, rh.height)));
      racine.position.set(base.x, base.y + p * 1.2, -p * 4);
      racine.scale.setScalar(base.s);
      cv.style.opacity = String(1 - Math.min(1, p * 1.25));
      renderer.render(scene, cam);
      requestAnimationFrame(loop);
    }
    hero.classList.add('oeil-pret');
    requestAnimationFrame(loop);
  }
})();
