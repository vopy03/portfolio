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

  // analytics: GoatCounter (no cookies, so no consent banner needed).
  // Put the site code from goatcounter.com here, e.g. 'vopy' for vopy.goatcounter.com; empty = analytics off.
  var GOATCOUNTER = '';
  function track(name) {
    if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: name, title: name, event: true });
  }
  if (GOATCOUNTER) {
    // clicks on every call to action are counted as events; links with ?ref=… show up as referrers
    [
      ['.offcanvas-cta', 'click-menu-report'],
      ['.ft-cta .p-more-btn', 'click-hero-report'],
      ['.ft-cta .ghost-btn', 'click-hero-whats-in-report'],
      ['.ft-linkedin', 'click-hero-linkedin'],
      ['.report-cta .p-more-btn', 'click-report-section'],
      ['.sticky-cta', 'click-sticky-report'],
      ['.copy', 'click-copy-email'],
      ['a[href^="mailto:"]', 'click-email'],
      ['a[href*="t.me/"]', 'click-telegram'],
      ['a[href*="linkedin.com"]', 'click-linkedin']
    ].forEach(function (t) {
      document.querySelectorAll(t[0]).forEach(function (el) {
        if (!el.dataset.goatcounterClick) el.dataset.goatcounterClick = t[1];
      });
    });
    document.querySelectorAll('.cta-strip .p-more-btn').forEach(function (el, i) {
      el.dataset.goatcounterClick = i === 0 ? 'click-strip-after-work' : 'click-strip-after-services';
    });
    var gc = document.createElement('script');
    gc.async = true;
    gc.src = 'https://gc.zgo.at/count.js';
    gc.dataset.goatcounter = 'https://' + GOATCOUNTER + '.goatcounter.com/count';
    document.body.appendChild(gc);
  }

  // report request: opens the visitor's mail app with the shop address filled in
  var form = document.getElementById('lead-form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = form.querySelector('input');
    var url = input.value.trim();
    if (!/^[^\s]+\.[^\s]{2,}$/.test(url)) {
      input.classList.add('invalid');
      input.focus();
      return;
    }
    input.classList.remove('invalid');
    var uk = body.classList.contains('uk');
    var subject = (uk ? 'Безкоштовний звіт: ' : 'Free report: ') + url;
    var text = uk
      ? 'Добрий день, Володимире!\n\nБуду вдячний за безкоштовний звіт по магазину ' + url + '.\n\n'
      : 'Hi Volodymyr,\n\nI would like a free report on my shop: ' + url + '.\n\n';
    track('form-report-request');
    location.href = 'mailto:vopy.work@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
  });

  // sticky button on phones: visible between the hero and the contact block
  var sticky = document.querySelector('.sticky-cta');
  var hero = document.querySelector('.welcome-block');
  var contact = document.getElementById('contact');
  if (sticky && hero && contact && 'IntersectionObserver' in window) {
    var heroVisible = true, contactVisible = false;
    var update = function () {
      var on = !heroVisible && !contactVisible;
      sticky.classList.toggle('show', on);
      sticky.setAttribute('aria-hidden', !on);
      sticky.tabIndex = on ? 0 : -1;
    };
    new IntersectionObserver(function (en) { heroVisible = en[0].isIntersecting; update(); }).observe(hero);
    new IntersectionObserver(function (en) { contactVisible = en[0].isIntersecting; update(); }).observe(contact);
  }

  // questions: animate opening and closing instead of the instant jump
  var faq = document.querySelector('.faq');
  if (faq && !reduce && Element.prototype.animate) {
    faq.classList.add('js-faq');
    faq.querySelectorAll('details').forEach(function (d) {
      var summary = d.querySelector('summary');
      var running = null;
      summary.addEventListener('click', function (e) {
        e.preventDefault();
        if (running) running.cancel();
        var start = d.offsetHeight;
        var closing = d.open && d.classList.contains('expanded');
        var end;
        if (closing) {
          d.classList.remove('expanded');
          d.classList.add('collapsing');
          end = summary.offsetHeight + (d.offsetHeight - d.clientHeight);
        } else {
          d.classList.remove('collapsing');
          d.classList.add('expanded');
          d.open = true;
          end = d.offsetHeight;
        }
        d.style.overflow = 'hidden';
        running = d.animate({ height: [start + 'px', end + 'px'] }, { duration: 300, easing: 'cubic-bezier(.4, 0, .2, 1)' });
        running.onfinish = function () {
          if (closing) { d.open = false; d.classList.remove('collapsing'); }
          d.style.overflow = '';
          running = null;
        };
        running.oncancel = function () { d.style.overflow = ''; };
      });
    });
  }

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
