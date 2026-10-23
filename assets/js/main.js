(function () {
  var body = document.body;

  // language: #uk / #en in the URL, then the saved choice, then the browser language
  function setLang(l) {
    body.classList.toggle('uk', l === 'uk');
    document.documentElement.lang = l === 'uk' ? 'uk' : 'en';
    document.querySelectorAll('[data-set]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.set === l);
    });
    var t = document.querySelector('title');
    if (t && t.dataset[l]) t.textContent = t.dataset[l];
    try { localStorage.setItem('lang', l); } catch (e) {}
  }
  setLang(body.classList.contains('uk') ? 'uk' : 'en');
  document.querySelectorAll('[data-set]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.set); });
  });

  // page transition curtain on internal links
  document.querySelectorAll('.plink').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      document.querySelector('.transit').classList.add('transit-back');
    });
  });
  // back/forward cache restores the page with the curtain down
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) document.querySelector('.transit').classList.remove('transit-back');
  });

  // glow that follows the cursor
  function glowPanelEl(className) {
    document.querySelectorAll('.' + className).forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        el.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        el.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      });
    });
  }
  ['header-btn', 'project-item', 'panel', 'about-project', 'project-techs', 'footer-social-btn'].forEach(glowPanelEl);

  // mobile menu
  var menu = document.querySelector('.offcanvas');
  var backdrop = document.querySelector('.offcanvas-backdrop');
  function toggleMenu(open) {
    if (!menu) return;
    menu.classList.toggle('show', open);
    backdrop.classList.toggle('show', open);
    menu.setAttribute('aria-hidden', !open);
  }
  document.querySelectorAll('[data-menu]').forEach(function (b) {
    b.addEventListener('click', function () { toggleMenu(b.dataset.menu === 'open'); });
  });
  if (backdrop) backdrop.addEventListener('click', function () { toggleMenu(false); });
  if (menu) menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { toggleMenu(false); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggleMenu(false); });

  // rotating line in the hero
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.ft-subaccent').forEach(function (subacc) {
    var divs = subacc.querySelectorAll('div');
    var current = 1;
    if (reduce || divs.length < 2) return;
    setInterval(function () {
      var first = divs[0];
      if (current === divs.length) {
        first.style.marginTop = '0px';
        current = 1;
      } else {
        first.style.marginTop = (current * -subacc.clientHeight) + 'px';
        current++;
      }
    }, 3500);
  });

  // copy e-mail
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var el = document.getElementById(b.dataset.copy), t = el.textContent.trim();
      var done = function () { var o = b.innerHTML; b.textContent = '✓'; setTimeout(function () { b.innerHTML = o; }, 1400); };
      var sel = function () { var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, sel); else sel();
    });
  });
})();
