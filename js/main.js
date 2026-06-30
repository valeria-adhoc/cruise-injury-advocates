/* ============================================================
   Cruise Injury Advocates — main.js
   Vanilla JS. Progressive enhancement: usable with JS off.
   Handles: condensing nav, mobile menu, scroll reveals,
   number counters, accordion, process steps, intake form, FAB.
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ES = document.documentElement.lang === "es";

  /* ---- 1. Condensing header ---- */
  var header = document.getElementById("siteHeader");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 24); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- 2. Mobile menu ---- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* ---- 2b. Services dropdown (desktop) ---- */
  function closeDropdowns(except) {
    document.querySelectorAll(".has-dropdown.open").forEach(function (dd) {
      if (dd === except) return;
      dd.classList.remove("open");
      var b = dd.querySelector(".dd-toggle");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  }
  document.querySelectorAll(".has-dropdown .dd-toggle").forEach(function (btn) {
    var dd = btn.closest(".has-dropdown");
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var open = dd.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      closeDropdowns(dd);
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".has-dropdown")) closeDropdowns(null);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDropdowns(null); });

  /* ---- 2c. Mobile submenu ---- */
  document.querySelectorAll(".m-sub-toggle").forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      if (panel) panel.style.maxHeight = open ? "0px" : panel.scrollHeight + "px";
    });
  });

  /* ---- 3. Scroll reveal ---- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- 4. Number counters ---- */
  // Markup: <span class="stat-num" data-count="35" data-suffix="+">0</span>
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    if (isNaN(target)) return;
    if (reduce) { el.textContent = prefix + target + suffix; return; }
    var dur = 1400, start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCount);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { animateCount(entry.target); cio.unobserve(entry.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---- 5. Accordion ---- */
  document.querySelectorAll(".acc-btn").forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      if (panel) panel.style.maxHeight = open ? "0px" : panel.scrollHeight + "px";
    });
  });

  /* ---- 6. Process steps (click / hover to activate) ---- */
  var steps = document.querySelectorAll(".step");
  function activateStep(s) {
    steps.forEach(function (x) { x.classList.remove("active"); x.setAttribute("aria-expanded", "false"); });
    s.classList.add("active"); s.setAttribute("aria-expanded", "true");
  }
  steps.forEach(function (s) {
    s.addEventListener("click", function () { activateStep(s); });
    s.addEventListener("mouseenter", function () { activateStep(s); });
    s.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activateStep(s); } });
  });

  /* ---- 7. Footer year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  /* ---- 8. Intake forms (any number per page) ----
     No backend. To go live: set each form's action to your GHL/webhook and
     remove preventDefault, OR fetch() to data-ghl-endpoint inside submitToBackend(). */
  function submitToBackend() { return new Promise(function (res) { setTimeout(res, 600); }); } // [INTEGRATION POINT]
  function setupForm(form) {
    var statusEl = form.querySelector(".form-status");
    var fields = Array.prototype.slice.call(form.querySelectorAll("input, textarea, select"));
    function showStatus(msg, kind) { if (statusEl) { statusEl.textContent = msg; statusEl.className = "form-status " + (kind || ""); } }
    function validate() {
      var ok = true;
      fields.forEach(function (f) {
        var invalid = f.hasAttribute("required") && !String(f.value).trim();
        if (f.type === "email" && f.value.trim()) invalid = invalid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value);
        f.setAttribute("aria-invalid", String(invalid));
        if (invalid && ok) f.focus();
        if (invalid) ok = false;
      });
      return ok;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) { showStatus(ES ? "Por favor complete los campos resaltados." : "Please complete the highlighted fields.", "err"); return; }
      var btn = form.querySelector("button[type=submit]");
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = ES ? "Enviando…" : "Sending…"; }
      showStatus("");
      submitToBackend().then(function () {
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || (ES ? "Enviar" : "Submit"); }
        showStatus(ES ? "Gracias, nos pondremos en contacto con usted en breve. (Demostración: aún no está conectado a un servidor.)" : "Thank you, we will be in touch shortly. (Demo: not yet connected to a backend.)", "ok");
      });
    });
  }
  document.querySelectorAll("form[data-intake]").forEach(setupForm);

  /* ---- 9. Map facade (click to load Google Maps embed) ---- */
  document.querySelectorAll(".map-facade").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var q = btn.getAttribute("data-q") || "";
      var ifr = document.createElement("iframe");
      ifr.title = ES ? "Mapa de nuestra oficina de Miami" : "Map to our Miami office";
      ifr.loading = "lazy";
      ifr.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
      ifr.src = "https://www.google.com/maps?q=" + encodeURIComponent(q) + "&output=embed";
      btn.replaceWith(ifr);
    });
  });

  /* ---- 10. Chat FAB ---- */
  /* ---- Reviews marquee: duplicate cards for a seamless loop ---- */
  var rtrack = document.querySelector(".reviews-track");
  if (rtrack) {
    Array.prototype.slice.call(rtrack.children).forEach(function (c) {
      var d = c.cloneNode(true);
      d.setAttribute("aria-hidden", "true");
      rtrack.appendChild(d);
    });
  }

  var fab = document.getElementById("chatFab");
  if (fab) fab.addEventListener("click", function () { window.alert("[Placeholder] Connect your GHL / live-chat widget here."); });
})();
