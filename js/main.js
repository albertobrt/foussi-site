// Foussi Vision — navigation, apparitions, formulaire
(function () {
  'use strict';

  var EMAIL = 'contact@foussi.fr';
  // Envoi direct du formulaire (facultatif) : créez un formulaire gratuit sur https://formspree.io
  // et collez ici son identifiant (ex. 'xyzabcd'). Laissé vide : le formulaire ouvre la messagerie.
  var FORMSPREE = '';
  var reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, d) { return (d || document).querySelector(s); };
  var $$ = function (s, d) { return Array.prototype.slice.call((d || document).querySelectorAll(s)); };

  /* ---------- Barre de navigation ---------- */
  var barre = $('#barre');
  function etatBarre() { barre.classList.toggle('est-defile', scrollY > 16); }
  addEventListener('scroll', etatBarre, { passive: true });
  etatBarre();

  // lien actif selon la section à l'écran
  var liens = $$('.barre__liens a[href^="#"]:not(.bouton)');
  if ('IntersectionObserver' in window) {
    var obsSections = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        liens.forEach(function (a) { a.classList.toggle('est-actif', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['haut', 'savoir-faire', 'realisations', 'images', 'methode', 'questions', 'contact'].forEach(function (id) {
      var s = document.getElementById(id); if (s) obsSections.observe(s);
    });
  }

  /* ---------- Menu téléphone ---------- */
  var boutonMenu = $('.barre__menu');
  var menu = $('#menu');
  function ouvrirMenu(ouvrir) {
    menu.hidden = !ouvrir;
    boutonMenu.setAttribute('aria-expanded', String(ouvrir));
    boutonMenu.setAttribute('aria-label', ouvrir ? 'Fermer le menu' : 'Ouvrir le menu');
    document.documentElement.style.overflow = ouvrir ? 'hidden' : '';
    barre.classList.toggle('est-defile', ouvrir || scrollY > 16);
    if (ouvrir) { var premier = $('a', menu); if (premier) premier.focus({ preventScroll: true }); }
  }
  boutonMenu.addEventListener('click', function () { ouvrirMenu(menu.hidden); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { ouvrirMenu(false); }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { ouvrirMenu(false); boutonMenu.focus(); } });
  matchMedia('(min-width: 900px)').addEventListener('change', function (m) { if (m.matches && !menu.hidden) ouvrirMenu(false); });

  /* ---------- Vidéo de fond de l accueil ---------- */
  var video = $(".hero__video");
  if (video) {
    if (reduit) { video.removeAttribute("autoplay"); video.pause(); }
    else if ("IntersectionObserver" in window) {
      // pause quand l accueil n est plus visible : économise la batterie
      new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
        else video.pause();
      }).observe(video);
    }
  }

  /* ---------- Apparitions au défilement ---------- */
  var aVoir = $$('.apparait, .projet');
  if ('IntersectionObserver' in window && !reduit) {
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('est-visible'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    aVoir.forEach(function (el) { obs.observe(el); });
  } else {
    aVoir.forEach(function (el) { el.classList.add('est-visible'); });
  }

  /* ---------- Formulaire ---------- */
  var form = $('#formulaire');
  if (form) {
    var etat = $('#etat');
    var regles = {
      nom: function (v) { return v.trim().length >= 2 ? '' : 'Indiquez votre nom.'; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Vérifiez votre adresse e-mail (exemple : nom@domaine.fr).'; },
      message: function (v) { return v.trim().length >= 10 ? '' : 'Décrivez votre projet en quelques mots (10 caractères minimum).'; },
    };
    function verifier(nom) {
      var champ = form.elements[nom];
      var msg = regles[nom](champ.value);
      champ.setAttribute('aria-invalid', msg ? 'true' : 'false');
      var err = $('#e-' + nom);
      err.textContent = msg;
      if (msg) champ.setAttribute('aria-describedby', 'e-' + nom); else champ.removeAttribute('aria-describedby');
      return !msg;
    }
    Object.keys(regles).forEach(function (nom) {
      var champ = form.elements[nom];
      champ.addEventListener('blur', function () { if (champ.value) verifier(nom); });
      champ.addEventListener('input', function () { if (champ.getAttribute('aria-invalid') === 'true') verifier(nom); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var invalides = Object.keys(regles).filter(function (nom) { return !verifier(nom); });
      if (invalides.length) { form.elements[invalides[0]].focus(); etat.textContent = ''; return; }
      var projets = $$('input[name="projet"]:checked', form).map(function (c) { return c.value; });
      var f = form.elements;
      var nom = f.nom.value.trim(), tel = f.tel.value.trim();
      var sujet = (projets.length ? 'Projet ' + projets.join(' + ') : 'Nouveau projet') + ' — ' + nom;
      var lignes = ['Bonjour,', '', f.message.value.trim(), '', '— ' + nom, 'E-mail : ' + f.email.value.trim()];
      if (tel) lignes.push('Téléphone : ' + tel);
      if (projets.length) lignes.push('Projet : ' + projets.join(', '));
      var corps = lignes.join('\n');
      if (FORMSPREE && window.fetch) {
        var bouton = $('button[type="submit"]', form);
        bouton.disabled = true;
        etat.textContent = 'Envoi en cours…';
        fetch('https://formspree.io/f/' + FORMSPREE, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ _subject: sujet, nom: nom, email: f.email.value.trim(), telephone: tel, projet: projets.join(', '), message: f.message.value.trim() })
        }).then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.reset();
          etat.textContent = 'Merci ' + nom + ' ! Votre message est bien envoyé, je vous réponds très vite.';
        }).catch(function () {
          etat.innerHTML = 'L’envoi n’a pas fonctionné. Écrivez-moi à <a href="mailto:' + EMAIL + '">' + EMAIL + '</a> ou sur <a href="https://www.instagram.com/foussi.fr/" target="_blank" rel="noopener">Instagram</a>.';
        }).then(function () { bouton.disabled = false; });
        return;
      }
      location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(sujet) + '&body=' + encodeURIComponent(corps);
      etat.innerHTML = 'Votre messagerie s’ouvre avec le message prêt à envoyer. Rien ne s’ouvre&#8239;? Écrivez à <a href="mailto:' + EMAIL + '">' + EMAIL + '</a> ou sur <a href="https://www.instagram.com/foussi.fr/" target="_blank" rel="noopener">Instagram</a>.';
    });
  }

  var annee = $('#annee');
  if (annee) annee.textContent = new Date().getFullYear();
})();
