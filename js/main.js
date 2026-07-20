/* =========================================================
   苏其辉 · 作品集 — 交互逻辑
   纯原生 JS · 零依赖 · 离线可用
   ========================================================= */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  /* ---------- 主题切换 ---------- */
  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", next === "dark" ? "#000000" : "#ffffff");
    });
  }

  /* ---------- 导航：滚动玻璃态 + 移动端菜单 ---------- */
  var nav = document.getElementById("nav");
  var navLinks = document.getElementById("navLinks");
  var burger = document.getElementById("navBurger");

  function onScrollNav() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 视差滚动 ---------- */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  function applyParallax() {
    var y = window.scrollY;
    parallaxEls.forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-speed")) || 0.2;
      if (el.classList.contains("tilt-card")) {
        el.style.setProperty("--py", (y * speed).toFixed(1) + "px");
      } else {
        el.style.transform = "translate3d(0," + (y * speed).toFixed(1) + "px,0)";
      }
    });
  }

  /* ---------- 能力叙事（钉住滚动） ---------- */
  var track = document.getElementById("capsTrack");
  var visual = document.getElementById("capsVisual");
  var medias = Array.prototype.slice.call(document.querySelectorAll(".caps__media"));
  var caps = Array.prototype.slice.call(document.querySelectorAll(".caps__cap"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".caps__progress .dot"));
  var STAGES = caps.length || 4;

  function updateCaps() {
    if (!track || !visual) return;
    var rect = track.getBoundingClientRect();
    var vh = window.innerHeight;
    var total = track.offsetHeight - vh;
    if (total <= 0) total = 1;
    var p = -rect.top / total;
    if (p < 0) p = 0;
    if (p > 1) p = 1;
    var rot = (p * 36 - 18).toFixed(2);
    visual.style.setProperty("--cap-rot", rot + "deg");
    var idx = Math.min(STAGES - 1, Math.floor(p * STAGES + 0.0001));
    for (var i = 0; i < medias.length; i++) {
      var on = i === idx;
      medias[i].classList.toggle("is-active", on);
      if (caps[i]) caps[i].classList.toggle("is-active", on);
      if (dots[i]) dots[i].classList.toggle("is-active", on);
    }
  }

  /* ---------- 统一滚动处理 ---------- */
  var ticking = false;
  function onScroll() {
    onScrollNav();
    if (!reduceMotion) applyParallax();
    updateCaps();
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  /* ---------- 3D 倾斜交互卡 ---------- */
  if (!reduceMotion && !window.matchMedia("(hover: none)").matches) {
    var tiltEls = Array.prototype.slice.call(document.querySelectorAll(".tilt-card"));
    tiltEls.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--ry", (px * 12).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-py * 12).toFixed(2) + "deg");
      });
      el.addEventListener("mouseleave", function () {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* ---------- 滚动揭示动画 ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          var d = el.getAttribute("data-reveal-delay");
          if (d) el.style.setProperty("--rd", d + "ms");
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 数字滚动计数 ---------- */
  function animateCount(el, target) {
    if (reduceMotion) { el.textContent = target; return; }
    var dur = 1200, start = performance.now();
    function tick(now) {
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target);
      if (t < 1) window.requestAnimationFrame(tick);
      else el.textContent = target;
    }
    window.requestAnimationFrame(tick);
  }
  var counters = Array.prototype.slice.call(document.querySelectorAll(".num[data-count]"));
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          animateCount(en.target, parseInt(en.target.getAttribute("data-count"), 10) || 0);
          cio.unobserve(en.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute("data-count"); });
  }

  /* ---------- 导航高亮（当前区块） ---------- */
  var navLinkMap = {};
  Array.prototype.slice.call(document.querySelectorAll(".nav__link")).forEach(function (l) {
    navLinkMap[l.getAttribute("data-section")] = l;
  });
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  if ("IntersectionObserver" in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.id;
          Object.keys(navLinkMap).forEach(function (k) { navLinkMap[k].classList.remove("active"); });
          if (navLinkMap[id]) navLinkMap[id].classList.add("active");
        }
      });
    }, { threshold: 0.4, rootMargin: "-25% 0px -45% 0px" });
    sections.forEach(function (s) { sio.observe(s); });
  }

  /* ---------- 作品集 Tab 筛选 ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var galleries = Array.prototype.slice.call(document.querySelectorAll(".gallery"));
  function activateTab(tab) {
    if (!tab) return;
    tabs.forEach(function (t) { t.classList.remove("is-active"); });
    tab.classList.add("is-active");
    var f = tab.getAttribute("data-filter");
    galleries.forEach(function (g) {
      g.hidden = !(f === "all" || g.getAttribute("data-group") === f);
    });
  }
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () { activateTab(tab); });
  });
  // 初始化：让默认激活的 Tab 正确显示（修复「全部」只显示平面设计的问题）
  activateTab(document.querySelector(".tab.is-active") || tabs[0]);

  /* ---------- 装备缩略图已由 Lightbox 统一处理（data-lightbox="image"） ---------- */

  /* ---------- Lightbox（图片 / 视频） ---------- */
  var lb = document.getElementById("lightbox");
  var lbStage = document.getElementById("lbStage");
  var lbCaption = document.getElementById("lbCaption");
  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  var currentList = [];
  var currentIndex = 0;

  function renderLb() {
    var item = currentList[currentIndex];
    if (!item) return;
    var type = item.getAttribute("data-lightbox");
    var title = item.getAttribute("data-title") || "";
    lbStage.innerHTML = "";
    if (type === "video") {
      var v = document.createElement("video");
      v.src = item.getAttribute("data-src");
      var poster = item.getAttribute("data-poster");
      if (poster) v.poster = poster;
      v.controls = true; v.autoplay = true; v.playsInline = true;
      v.setAttribute("playsinline", "");
      lbStage.appendChild(v);
      var pr = v.play();
      if (pr && pr.catch) pr.catch(function () {});
    } else {
      var img = document.createElement("img");
      img.src = item.getAttribute("data-src");
      img.alt = title;
      lbStage.appendChild(img);
    }
    lbCaption.textContent = title;
  }
  function openLb(btn) {
    var lbType = btn.getAttribute("data-lightbox") || "image";
    if (lbType === "gear") {
      // 装备区独立 lightbox，只遍历装备缩略图
      currentList = Array.prototype.slice.call(
        document.querySelectorAll("[data-lightbox='gear']")
      );
    } else {
      // 作品集 lightbox，只遍历当前显示的 gallery 内元素
      currentList = Array.prototype.slice.call(
        document.querySelectorAll(".gallery:not([hidden]) [data-lightbox]")
      );
    }
    currentIndex = currentList.indexOf(btn);
    if (currentIndex < 0) currentIndex = 0;
    renderLb();
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbStage.innerHTML = "";
  }
  function navLb(dir) {
    if (!currentList.length) return;
    currentIndex = (currentIndex + dir + currentList.length) % currentList.length;
    renderLb();
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]")).forEach(function (btn) {
    btn.addEventListener("click", function () { openLb(btn); });
  });
  if (lbClose) lbClose.addEventListener("click", closeLb);
  if (lbPrev) lbPrev.addEventListener("click", function () { navLb(-1); });
  if (lbNext) lbNext.addEventListener("click", function () { navLb(1); });
  if (lb) {
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    window.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowLeft") navLb(-1);
      else if (e.key === "ArrowRight") navLb(1);
    });
  }

  /* ---------- 初始化 ---------- */
  onScrollNav();
  updateCaps();
  // 首屏产品卡入场缩放
  var heroProduct = document.getElementById("heroProduct");
  if (heroProduct && !reduceMotion) {
    heroProduct.style.transition = "transform 1s cubic-bezier(0.16,1,0.3,1)";
    heroProduct.style.transform = "perspective(900px) scale(1.12)";
    window.requestAnimationFrame(function () {
      heroProduct.style.transform = "perspective(900px) scale(1)";
      setTimeout(function () {
        // 清除内联 transform，交还给 CSS（启用 3D 倾斜变量）
        heroProduct.style.transition = "";
        heroProduct.style.transform = "";
      }, 1050);
    });
  }
})();
