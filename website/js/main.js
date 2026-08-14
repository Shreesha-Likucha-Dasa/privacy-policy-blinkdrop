/* BlinkDrop — public marketing site interactions (vanilla JS, no deps) */
(function () {
  'use strict';

  /* ---------- Sticky nav ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    menu.hidden = open;
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.step, .feature, .usecase, .compare-col, .privacy-grid > *, .security-stage, .video-wrap, .statement, .demo-stage');
  revealEls.forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Interactive demo ---------- */
  var phoneScreen = document.getElementById('demoPhoneScreen');
  var browserScreen = document.getElementById('demoBrowserScreen');
  var caption = document.getElementById('demoCaption');
  var dots = document.getElementById('demoDots');
  var prevBtn = document.getElementById('demoPrev');
  var nextBtn = document.getElementById('demoNext');

  var IMG = 'assets/img/';
  var steps = [
    { phone: '01_home.webp', browser: null, browserText: 'Waiting for your phone…', caption: 'Open BlinkDrop and tap Start Sharing.' },
    { phone: '04_qr_address.webp', browser: '08_web_connect.webp', caption: 'Scan the QR code, or open the address in a browser.' },
    { phone: '02_share_pin.webp', browser: '08_web_connect.webp', caption: 'Enter the 4-digit PIN shown on your phone.' },
    { phone: '03_connected.webp', browser: '09_web_workspace.webp', caption: 'Connected. The browser can now reach your shared files.' },
    { phone: '03_connected.webp', browser: '10_web_files.webp', caption: 'Transfer files in either direction — fast, over local Wi-Fi.', transfer: true }
  ];

  var current = 0;
  var timer = null;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setScreen(el, src) {
    if (src) el.innerHTML = '<img src="' + IMG + src + '" alt="" loading="lazy">';
  }
  function setTextScreen(el, text) {
    el.innerHTML = '<div class="screen-inner"><div><b>' + text + '</b><small>Nothing to install</small></div></div>';
  }

  function render() {
    var s = steps[current];
    if (s.phone) setScreen(phoneScreen, s.phone); else setTextScreen(phoneScreen, s.phoneText);
    if (s.browser) setScreen(browserScreen, s.browser); else setTextScreen(browserScreen, s.browserText);
    caption.textContent = s.caption;
    Array.prototype.forEach.call(dots.children, function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function go(i) {
    current = (i + steps.length) % steps.length;
    render();
    restart();
  }

  function next() { go(current + 1); }
  function prev() { go(current - 1); }
  function restart() {
    if (timer) clearInterval(timer);
    if (!reducedMotion) timer = setInterval(next, 3200);
  }

  // Build dots
  steps.forEach(function (_, i) {
    var li = document.createElement('li');
    li.setAttribute('aria-hidden', 'true');
    dots.appendChild(li);
  });

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  document.getElementById('demoStage').addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
  document.getElementById('demoStage').addEventListener('mouseleave', restart);
  document.getElementById('demoStage').addEventListener('focusin', function () { if (timer) clearInterval(timer); });
  document.getElementById('demoStage').addEventListener('focusout', restart);

  render();
  restart();

  /* ---------- Privacy toggle ---------- */
  var sw = document.getElementById('toggleSwitch');
  var stateLabel = document.getElementById('toggleState');
  var imgOn = document.getElementById('toggleImgOn');
  var imgOff = document.getElementById('toggleImgOff');
  if (sw) {
    sw.addEventListener('click', function () {
      var on = sw.getAttribute('aria-checked') === 'true';
      sw.setAttribute('aria-checked', String(!on));
      if (on) {
        stateLabel.textContent = 'Phone files hidden from browser';
        imgOn.hidden = true;
        imgOff.hidden = false;
      } else {
        stateLabel.textContent = 'Allow browser to browse phone files';
        imgOn.hidden = false;
        imgOff.hidden = true;
      }
    });
  }

  /* ---------- Active nav link ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.remove('active'); });
          var link = navLinks.filter(function (a) { return a.getAttribute('href') === '#' + entry.target.id; })[0];
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { if (s) spy.observe(s); });
  }
})();
