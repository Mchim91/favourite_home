/* Shared behaviour for the TRGC landing page and the five company sites. */
(function () {
  'use strict';

  /* ---- mobile menu ---- */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ---- underline the menu link for the section you are on ---- */
  var links = [].slice.call(document.querySelectorAll('.menu a[href^="#"]'));
  var sections = links.map(function (l) { return document.getElementById(l.getAttribute('href').slice(1)); });
  function spy() {
    var current = 0;
    sections.forEach(function (s, i) {
      if (s && s.getBoundingClientRect().top <= 140) current = i;
    });
    links.forEach(function (l, i) { l.setAttribute('aria-current', String(i === current)); });
  }
  if (links.length) { spy(); window.addEventListener('scroll', spy, { passive: true }); }

  /* ---- the road: a marker that drives along as you scroll ---- */
  var road = document.getElementById('road-track');
  var path = document.getElementById('road-path');
  var car = road && road.querySelector('.car');
  if (road && path && car) {
    var phone = window.matchMedia('(max-width: 760px)');
    var drive = function () {
      var r = road.getBoundingClientRect();
      var p = (window.innerHeight * 0.55 - r.top) / r.height;
      p = Math.max(0, Math.min(1, p));
      if (phone.matches) {
        car.style.left = '';
        car.style.top = (p * 100) + '%';
      } else {
        var pt = path.getPointAtLength(p * path.getTotalLength());
        car.style.left = pt.x + '%';
        car.style.top = pt.y + '%';
      }
    };
    drive();
    window.addEventListener('scroll', drive, { passive: true });
    window.addEventListener('resize', drive);
  }

  /* ---- enquiry forms send the message to the WhatsApp business number ---- */
  [].forEach.call(document.querySelectorAll('form[data-whatsapp]'), function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var lines = ['Hello ' + form.getAttribute('data-company') + ', I would like to make an enquiry.', ''];
      [].forEach.call(form.elements, function (el) {
        if (!el.name || !el.value.trim()) return;
        var label = form.querySelector('label[for="' + el.id + '"]');
        lines.push((label ? label.textContent.replace(/\s*\(optional\)\s*$/i, '') : el.name) + ': ' + el.value.trim());
      });
      var url = 'https://wa.me/' + form.getAttribute('data-whatsapp') + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');
    });
  });
})();
