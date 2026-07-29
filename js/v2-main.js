/* =========================================================
   苏其辉 · 作品集 — 交互逻辑 v2
   纯原生 JS · 零依赖 · 离线可用
   v2 升级: 光标跟随 / 多层视差 / 雷达图 / 时间线展开 / 进度条 / Noise纹理(CSS)
   ========================================================= */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  /* ---------- 主题切换（圆形扩散 Ripple） ---------- */
  var themeToggle = document.getElementById("themeToggle");
  var ripple = document.querySelector('.theme-ripple');
  if (themeToggle && ripple) {
    themeToggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") || "light";
      var next = current === "dark" ? "light" : "dark";

      // 扩散原点：按钮自身的圆心
      var rect = themeToggle.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;

      // 覆盖全屏所需的最大半径
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var maxR = Math.sqrt(
        Math.pow(Math.max(cx, vw - cx), 2) + Math.pow(Math.max(cy, vh - cy), 2)
      );

      // 写入 CSS 变量
      ripple.style.setProperty('--ripple-x', cx + 'px');
      ripple.style.setProperty('--ripple-y', cy + 'px');
      ripple.style.setProperty('--ripple-radius', maxR + 'px');

      if (next === "dark") {
        // ===== 浅 → 深：先切主题，再扩散涟漪 =====
        root.setAttribute("data-theme", "dark");
        try { localStorage.setItem("theme", "dark"); } catch (e) {}
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", "#000000");

        ripple.classList.remove('is-collapsing', 'is-expanding');
        ripple.style.clipPath = 'circle(0px at ' + cx + 'px ' + cy + 'px)';
        window.requestAnimationFrame(function () {
          ripple.style.clipPath = '';
          ripple.classList.add('is-expanding');
        });
        setTimeout(function () {
          ripple.classList.remove('is-expanding');
          ripple.style.clipPath = '';
        }, 720);
      } else {
        // ===== 深 → 浅：黑色圆从全屏收缩回按钮 =====
        ripple.classList.remove('is-collapsing', 'is-expanding');
        // 起点：按钮位置，半径覆盖全屏（inline，无transition）
        ripple.style.clipPath = 'circle(' + maxR + 'px at ' + cx + 'px ' + cy + 'px)';
        // 立即切换主题到浅色（ripple底下已是白色）
        root.setAttribute("data-theme", "light");
        try { localStorage.setItem("theme", "light"); } catch (e) {}
        var meta2 = document.querySelector('meta[name="theme-color"]');
        if (meta2) meta2.setAttribute("content", "#ffffff");
        // 启动收缩：清除inline → class接管 → maxR→0过渡
        ripple.style.setProperty('--ripple-radius', '0px');
        window.requestAnimationFrame(function () {
          ripple.style.clipPath = '';       // 清除inline，让CSS类接管
          ripple.classList.add('is-collapsing');
        });
        // 收缩完成后清理
        setTimeout(function () {
          ripple.classList.remove('is-collapsing');
          ripple.style.clipPath = '';
        }, 520);
      }
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

  /* ---------- 多层视差滚动（v2 升级） ---------- */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax-speed]"));
  function applyParallax() {
    var y = window.scrollY;
    parallaxEls.forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-parallax-speed")) || 0.2;
      el.style.transform = "translate3d(0," + (y * speed).toFixed(1) + "px,0)";
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

  /* ---------- 滚动进度条（v2 升级） ---------- */
  var progressBar = document.querySelector(".scroll-progress");
  function updateProgress() {
    if (!progressBar) return;
    var scrolled = window.scrollY;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) total = 1;
    progressBar.style.width = (scrolled / total * 100) + '%';
  }

  /* ---------- 统一滚动处理 ---------- */
  var ticking = false;
  function onScroll() {
    onScrollNav();
    if (!reduceMotion) applyParallax();
    updateCaps();
    updateProgress();
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  /* ---------- 光标跟随光晕（v2 Signature） ---------- */
  var glow = document.querySelector('.cursor-glow');
  var isMobileOrReduced = reduceMotion || window.matchMedia("(hover: none)").matches;
  if (glow && !isMobileOrReduced) {
    var mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX; mouseY = e.clientY;
    });
    function animateGlow() {
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
    // hover交互元素检测
    var interactiveSelectors = 'a, button, .nav__link, .tilt-card, .gallery__item, .skill-icon, .tl__item, .tl__toggle, .gear__item, .card--interactive, .cert, .back-top';
    document.querySelectorAll(interactiveSelectors).forEach(function (el) {
      el.addEventListener('mouseenter', function () { glow.classList.add('is-hovering'); });
      el.addEventListener('mouseleave', function () { glow.classList.remove('is-hovering'); });
    });
  }

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

  /* ---------- 头像入场 ---------- */
  var heroAvatar = document.querySelector('.hero__avatar');
  if (heroAvatar) {
    setTimeout(function () {
      heroAvatar.classList.add('is-visible');
    }, 120); // 比文字早一点
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

  /* ---------- 技能雷达图（v2 升级） ---------- */
  var skillData = [
    { name: 'CorelDRAW', short: 'CDR', score: 90 },
    { name: 'Photoshop', short: 'PS', score: 85 },
    { name: 'Illustrator', short: 'AI', score: 80 },
    { name: '剪映 CapCut', short: 'CapCut', score: 80 },
    { name: 'Premiere Pro', short: 'PR', score: 80 },
    { name: 'After Effects', short: 'AE', score: 80 },
    { name: 'Lightroom', short: 'LR', score: 70 },
    { name: 'Cinema 4D', short: 'C4D', score: 45 }
  ];
  var radarSvg = document.getElementById('skillRadar');
  if (radarSvg) {
    var N = skillData.length;
    var CX = 150, CY = 150, R = 110;
    var angleStep = (2 * Math.PI) / N;
    var startAngle = -Math.PI / 2; // 从顶部开始

    // 计算轴端点坐标
    function axisPoint(i, scale) {
      var angle = startAngle + i * angleStep;
      scale = scale || 1;
      return {
        x: CX + R * scale * Math.cos(angle),
        y: CY + R * scale * Math.sin(angle)
      };
    }

    // 生成SVG内容
    var svgContent = '';

    // 同心网格（5层：20/40/60/80/100）
    for (var lv = 1; lv <= 5; lv++) {
      var levelScale = lv / 5;
      var gridPoints = '';
      for (var gi = 0; gi < N; gi++) {
        var gp = axisPoint(gi, levelScale);
        gridPoints += gp.x.toFixed(1) + ',' + gp.y.toFixed(1) + ' ';
      }
      svgContent += '<polygon class="radar-grid" points="' + gridPoints.trim() + '" />';
    }

    // 轴线
    for (var ai = 0; ai < N; ai++) {
      var ap = axisPoint(ai);
      svgContent += '<line class="radar-axis" x1="' + CX + '" y1="' + CY + '" x2="' + ap.x.toFixed(1) + '" y2="' + ap.y.toFixed(1) + '" />';
    }

    // 数据多边形
    var dataPoints = '';
    var dotElements = '';
    for (var di = 0; di < N; di++) {
      var dp = axisPoint(di, skillData[di].score / 100);
      dataPoints += dp.x.toFixed(1) + ',' + dp.y.toFixed(1) + ' ';
      dotElements += '<circle class="radar-dot" data-skill-index="' + di + '" cx="' + dp.x.toFixed(1) + '" cy="' + dp.y.toFixed(1) + '" r="3" />';
    }
    svgContent += '<polygon class="radar-poly" points="' + dataPoints.trim() + '" />';
    svgContent += dotElements;

    // 标签
    for (var li = 0; li < N; li++) {
      var lp = axisPoint(li, 1.22); // 标签在轴端外22%
      svgContent += '<text class="radar-label" x="' + lp.x.toFixed(1) + '" y="' + lp.y.toFixed(1) + '" text-anchor="middle" dominant-baseline="middle">' + skillData[li].short + '</text>';
    }

    radarSvg.innerHTML = svgContent;

    // hover交互: dot → icon标签高亮
    var radarDots = radarSvg.querySelectorAll('.radar-dot');
    var skillIcons = document.querySelectorAll('.skill-icon[data-skill]');
    var radarPoly = radarSvg.querySelector('.radar-poly');

    radarDots.forEach(function (dot) {
      dot.addEventListener('mouseenter', function () {
        var idx = parseInt(dot.getAttribute('data-skill-index'), 10);
        radarPoly.classList.add('is-hovered');
        dot.classList.add('is-active');
        if (skillIcons[idx]) skillIcons[idx].classList.add('is-active');
      });
      dot.addEventListener('mouseleave', function () {
        radarPoly.classList.remove('is-hovered');
        dot.classList.remove('is-active');
        skillIcons.forEach(function (icon) { icon.classList.remove('is-active'); });
      });
    });
    // 反向: icon → dot高亮
    skillIcons.forEach(function (icon) {
      icon.addEventListener('mouseenter', function () {
        var idx = parseInt(icon.getAttribute('data-skill'), 10);
        radarPoly.classList.add('is-hovered');
        if (radarDots[idx]) radarDots[idx].classList.add('is-active');
        icon.classList.add('is-active');
      });
      icon.addEventListener('mouseleave', function () {
        radarPoly.classList.remove('is-hovered');
        radarDots.forEach(function (d) { d.classList.remove('is-active'); });
        icon.classList.remove('is-active');
      });
    });

    // 入场动画: stroke-dasharray
    if (!reduceMotion && radarPoly) {
      radarPoly.style.opacity = '0';
      radarPoly.style.transition = 'opacity 0.8s ease 0.2s';
      var radarWrap = document.querySelector('.skills__radar-wrap');
      if (radarWrap && "IntersectionObserver" in window) {
        var rio = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              radarPoly.style.opacity = '0.6';
              rio.unobserve(en.target);
            }
          });
        }, { threshold: 0.3 });
        rio.observe(radarWrap);
      } else {
        radarPoly.style.opacity = '0.6';
      }
    }
  }

  /* ---------- 可展开时间线（v2 升级） ---------- */
  document.querySelectorAll('.tl__toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.tl__item');
      if (item) item.classList.toggle('is-open');
    });
  });

  /* ---------- 装备散开效果初始化 ---------- */
  var gearItems = document.querySelectorAll('.gear__item');
  if (gearItems.length && !reduceMotion) {
    gearItems.forEach(function (item, i) {
      var angle = parseInt(item.getAttribute('data-angle') || '0', 10);
      // 中间现有5件较大，两侧卖掉的较小
      var lifts = [4, -2, 10, -4, 6, -2, 10, 0];     // 当前是新顺序：sold, sold, 现有×5, sold
      var scales = [0.72, 0.78, 0.92, 0.95, 0.90, 0.88, 0.85, 0.72]; // 中间3个最大
      var lift = lifts[i] || 0;
      var scale = scales[i] || 0.85;
      item.style.setProperty('--angle', angle + 'deg');
      item.style.setProperty('--lift', lift + 'px');
      item.style.setProperty('--scale', scale);
      // 入场动画: 从零散开到目标位置
      item.style.transform = 'rotate(0deg) translateY(40px) scale(0.3)';
      item.style.opacity = '0';
    });
    // 用 IntersectionObserver 触发散开入场
    var gearScatter = document.querySelector('.gear__scatter');
    if (gearScatter && "IntersectionObserver" in window) {
      var gearIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            gearItems.forEach(function (item, i) {
              setTimeout(function () {
                item.style.transition = 'transform 0.8s cubic-bezier(0.34,1.56,0.64,1) ' + (i * 60) + 'ms, opacity 0.5s ease ' + (i * 60) + 'ms';
                item.style.opacity = '1';
                item.style.transform = '';
                // 让CSS变量生效
                setTimeout(function () { item.style.transition = ''; }, 900 + i * 60);
              }, i * 60);
            });
            gearIO.unobserve(en.target);
          }
        });
      }, { threshold: 0.2 });
      gearIO.observe(gearScatter);
    } else {
      gearItems.forEach(function (item) { item.style.transform = ''; item.style.opacity = '1'; });
    }
  }

  /* ---------- 作品集交互增强 ---------- */
  // 动态给所有portfolio cards添加overlay + interactive class
  var portfolioCards = document.querySelectorAll('.portfolio .card');
  portfolioCards.forEach(function (card) {
    card.classList.add('card--interactive');
    var imgEl = card.querySelector('.card__img');
    if (imgEl) {
      // 添加overlay
      var overlay = document.createElement('span');
      overlay.className = 'card__overlay';
      var isVideo = card.classList.contains('card--video');
      overlay.innerHTML = '<span class="card__overlay-text">' + (isVideo ? '点击播放' : '点击查看') + '</span>';
      imgEl.appendChild(overlay);
    }
    // 3D tilt hover
    if (!reduceMotion && !window.matchMedia("(hover: none)").matches) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--card-ry', (px * 6).toFixed(2) + 'deg');
        card.style.setProperty('--card-rx', (-py * 6).toFixed(2) + 'deg');
      });
      card.addEventListener('mouseleave', function () {
        card.style.setProperty('--card-rx', '0deg');
        card.style.setProperty('--card-ry', '0deg');
      });
    }
  });

  // Tab切换时gallery的stagger reveal动画
  var staggerObserver = null;
  function applyGalleryStagger() {
    var visibleGallery = document.querySelector('.gallery:not([hidden])');
    if (!visibleGallery || reduceMotion) return;
    var items = visibleGallery.querySelectorAll('.card');
    items.forEach(function (item) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
    });
    items.forEach(function (item, i) {
      setTimeout(function () {
        item.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
        item.style.opacity = '1';
        item.style.transform = '';
        setTimeout(function () { item.style.transition = ''; item.style.transform = ''; }, 600);
      }, i * 80);
    });
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
    // 切换时播放stagger动画
    applyGalleryStagger();
  }
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () { activateTab(tab); });
  });
  activateTab(document.querySelector(".tab.is-active") || tabs[0]);

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
      currentList = Array.prototype.slice.call(
        document.querySelectorAll("[data-lightbox='gear']")
      );
    } else {
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
  updateProgress();

  /* ---------- 回到顶部按钮 ---------- */
  var backTop = document.getElementById('backTop');
  if (backTop) {
    // 滚动超过 600px 显示按钮
    function checkBackTop() {
      if (window.scrollY > 600) {
        backTop.classList.add('is-visible');
      } else {
        backTop.classList.remove('is-visible');
      }
    }
    window.addEventListener('scroll', checkBackTop, { passive: true });
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    checkBackTop();
  }

  // 首屏产品卡入场缩放
  var heroProduct = document.getElementById("heroProduct");
  if (heroProduct && !reduceMotion) {
    heroProduct.style.transition = "transform 1s cubic-bezier(0.16,1,0.3,1)";
    heroProduct.style.transform = "perspective(900px) scale(1.12)";
    window.requestAnimationFrame(function () {
      heroProduct.style.transform = "perspective(900px) scale(1)";
      setTimeout(function () {
        heroProduct.style.transition = "";
        heroProduct.style.transform = "";
      }, 1050);
    });
  }
})();
