/* =========================================================
   苏其辉 · 作品集 — 交互逻辑 v2
   纯原生 JS · 零依赖 · 离线可用
   v2 升级: 光标跟随 / 多层视差 / 雷达图 / 时间线展开 / 进度条 / Noise纹理(CSS)
   ========================================================= */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMobileViewport = window.matchMedia("(max-width: 768px)").matches;  // 手机端（≤768px）：关掉若干重效果
  var root = document.documentElement;

  /* ---------- 视口高度锁（修"往下滑却往上跳一段"） ----------
     会收起地址栏的浏览器（iOS Safari、三星浏览器）在滚动中把可视高改变一次。首屏
     min-height 和 02 堆叠区的钉住行程都按视口高算，于是**文档流高度**跟着变，
     同一个 scrollY 下整页内容往下挪 —— 看着就是往上跳（实测 844→916：作品集位移 158px、
     四张堆叠卡各 93~94px）。做法：把首屏高度锁成开页那一刻量到的 px，**只在宽度变化
     （转屏）时重量**；地址栏收起不改宽度，所以文档流全程不变。
     背景视频那一层改用 dvh 跟着长高填满屏幕 —— 它不在文档流里，不会造成位移。 */
  var isTouchLike = window.matchMedia('(hover: none)').matches
    || window.matchMedia('(pointer: coarse)').matches
    || (window.matchMedia('(max-width: 768px)').matches && (navigator.maxTouchPoints || 0) > 0);
  var vportLockW = window.innerWidth;
  var vportLockH = window.innerHeight;
  function applyVportLock() { root.style.setProperty('--vport-h', vportLockH + 'px'); }
  function vportH() { return vportLockH; }
  applyVportLock();
  window.addEventListener('resize', function () {
    var w = window.innerWidth, h = window.innerHeight;
    if (!isTouchLike) {                       // 桌面没有"收起地址栏"这回事，窗口照常跟着变
      vportLockW = w; vportLockH = h; applyVportLock(); capsTops = null; return;
    }
    if (w === vportLockW) return;             // 触屏且宽度没变 = 地址栏收起，一律不动
    vportLockW = w; vportLockH = h; applyVportLock(); capsTops = null;
  }, { passive: true });

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

  /* ---------- 能力叙事（02）----------
     改版前这里有一套 JS 驱动的"钉住滚动"：读 #capsTrack 进度 → 写 --cap-rot 让视觉体
     立体旋转 → 按 floor(p×4) 切换四项能力的 is-active。
     现在换成堆叠卡片（后一张 sticky 盖住前一张），纯 CSS position:sticky 就能表达，
     逐帧读 rect 反而会把合成器的工作抢回主线程，所以整段删除。 */

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
    updateProgress();
    updateCapsSquash();
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
  var isMobileOrReduced = reduceMotion;
  var isTouch = window.matchMedia("(hover: none)").matches;

  if (glow && !isMobileOrReduced && !isMobileViewport) {   // 手机端关闭"蓝点追踪"
    var mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

    if (isTouch) {
      // ===== 触摸设备：点哪跳哪，带短暂淡出 =====
      glow.style.opacity = '0';
      glow.style.mixBlendMode = 'normal';
      glow.style.transition = 'opacity 0.4s ease-out';
      document.addEventListener('touchstart', function (e) {
        var t = e.touches[0];
        glow.style.left = t.clientX + 'px';
        glow.style.top = t.clientY + 'px';
        glowX = t.clientX; glowY = t.clientY;
        glow.style.opacity = '0.5';
        glow.classList.add('is-hovering');
      }, { passive: true });
      document.addEventListener('touchmove', function (e) {
        var t = e.touches[0];
        glow.style.left = t.clientX + 'px';
        glow.style.top = t.clientY + 'px';
        glowX = t.clientX; glowY = t.clientY;
      }, { passive: true });
      document.addEventListener('touchend', function () {
        glow.style.opacity = '0';
        glow.classList.remove('is-hovering');
      }, { passive: true });
    } else {
      // ===== 桌面端：平滑跟随 =====
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

  /* ---------- 可展开时间线：点整张卡片展开（v2 升级） ---------- */
  document.querySelectorAll('.tl__item').forEach(function (item) {
    var toggle = item.querySelector('.tl__toggle');
    var detail = item.querySelector('.tl__detail');
    function setOpen(open) {
      item.classList.toggle('is-open', open);
      if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    item.addEventListener('click', function (e) {
      // 展开之后在详情里选文字、点链接，不该顺手把卡片收起来
      if (detail && item.classList.contains('is-open') && detail.contains(e.target)) return;
      setOpen(!item.classList.contains('is-open'));
    });
  });

  /* ---------- 装备散开效果初始化 ---------- */
  var gearItems = document.querySelectorAll('.gear__item');
  if (gearItems.length && !reduceMotion) {
    gearItems.forEach(function (item, i) {
      var angle = parseInt(item.getAttribute('data-angle') || '0', 10);
      // 中间现有6件较大，两侧卖掉的较小
      var lifts = [4, -2, 10, -4, 8, 6, -2, 10, 0];          // 顺序：sold, sold, 现有×6, sold
      var scales = [0.72, 0.78, 0.92, 0.95, 0.94, 0.90, 0.88, 0.85, 0.72]; // 中间几个最大
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

  /* ---------- 02 堆叠卡：上升途中挤扁，钉住那一下弹回 ---------- */
  // 不用 IntersectionObserver 判"钉住了"：卡片完全进入视口时 ratio 就已经到 1，
  // 之后从 468px 继续升到 74px 这一段没有任何回调，卡片会永远停在压扁状态。
  // 这里改成读一次布局位置（临时撤 sticky），之后每帧只做算术，不读 rect。
  var capsCards = Array.prototype.slice.call(document.querySelectorAll('.caps__card'));
  var capsSec = document.querySelector('.caps');
  var CAPS_PIN = 74;                       // 由 measureCaps() 从 CSS 的 --caps-pin 读实际值（手机端是 62）
  var capsTops = null;
  var capsSquashOn = capsCards.length && !!capsSec && !reduceMotion;

  function measureCaps() {
    var pinVar = parseFloat(getComputedStyle(capsSec).getPropertyValue('--caps-pin'));
    if (pinVar) CAPS_PIN = pinVar;
    capsSec.classList.add('is-measuring');           // position:static 一档，量未钉住的位置
    capsTops = capsCards.map(function (c) { return c.getBoundingClientRect().top + window.pageYOffset; });
    capsSec.classList.remove('is-measuring');
  }

  function updateCapsSquash() {
    if (!capsSquashOn) return;
    if (!capsTops) measureCaps();
    var vh = vportH(), y = window.pageYOffset;   // 用锁住的视口高，地址栏收起时这一帧才不会整体偏
    for (var i = 0; i < capsCards.length; i++) {
      var el = capsCards[i];
      var k = (capsTops[i] - y - CAPS_PIN) / (vh - CAPS_PIN);   // 1=刚进视口底，0=到钉住位
      if (k > 1) k = 1;                                // 还在视口下方就别反向拉长
      var landed = k <= 0;
      var next = landed ? 'L' : (k >= 1 ? 'N' : k.toFixed(2));
      if (el._sq === next) continue;                            // 值没变就不碰样式
      el._sq = next;
      if (landed) {
        el.style.removeProperty('--sq');
        el.style.removeProperty('--sx');
        el.classList.add('is-landed');
      } else {
        el.classList.remove('is-landed');
        var q = 1 - 0.075 * (1 - k);                            // 越接近钉住位越扁
        el.style.setProperty('--sq', q.toFixed(3));
        el.style.setProperty('--sx', (1 + 0.03 * (1 - k)).toFixed(3));       // 只鼓一点点，别做成果冻
      }
    }
  }

  if (capsSquashOn) {
    window.addEventListener('resize', function () { capsTops = null; }, { passive: true });
    updateCapsSquash();
  }

  /* ---------- 作品集交互增强：视频卡就地播放 ---------- */
  // 桌面 = 悬停即播，手机 = 停留即播（下面两块共用这一套起停函数）。
  // 第一次触发才建 <video> 并赋 src，preload=none —— 不抢首屏带宽；离开就 pause，下载随之停。
  function inlinePlayer(imgEl) {
    if (imgEl._ip) return imgEl._ip;
    var src = imgEl.getAttribute('data-src');
    if (!src) return null;
    var vid = document.createElement('video');
    vid.className = 'card__vid';
    vid.muted = true; vid.loop = true; vid.preload = 'none';
    vid.setAttribute('muted', '');
    vid.setAttribute('playsinline', '');
    vid.setAttribute('loop', '');
    vid.setAttribute('preload', 'none');
    var poster = imgEl.getAttribute('data-poster');
    if (poster) vid.poster = poster;
    vid.src = src;
    var bar = document.createElement('span');
    bar.className = 'card__buf';
    var fill = document.createElement('i');
    bar.appendChild(fill);
    imgEl.insertBefore(vid, imgEl.firstChild);
    imgEl.appendChild(bar);

    var p = { vid: vid, bar: bar, fill: fill, timer: 0 };
    function paint() {
      try {
        if (vid.duration && vid.buffered.length) {
          fill.style.width = Math.round(vid.buffered.end(vid.buffered.length - 1) / vid.duration * 100) + '%';
        }
      } catch (err) {}
    }
    function showBar() { bar.classList.add('is-on'); paint(); }
    p.hideBar = function () { if (p.timer) { clearTimeout(p.timer); p.timer = 0; } bar.classList.remove('is-on'); };
    vid.addEventListener('progress', paint);
    vid.addEventListener('waiting', showBar);
    vid.addEventListener('canplay', paint);
    vid.addEventListener('playing', function () { imgEl.classList.add('is-playing'); p.hideBar(); });
    imgEl._ip = p;
    return p;
  }

  function inlinePlay(imgEl) {
    var p = inlinePlayer(imgEl);
    if (!p) return;
    p.timer = setTimeout(function () { p.bar.classList.add('is-on'); p.bar._on = 1; }, 260);  // 网不卡时这条根本不露脸
    var pr = p.vid.play();
    if (pr && pr.catch) pr.catch(function () {});
  }

  function inlineStop(imgEl) {
    var p = imgEl._ip;
    if (!p) return;
    p.hideBar();
    p.vid.pause();
    imgEl.classList.remove('is-playing');
  }

  // 灯箱起来时必须先把卡片里的内联视频全停掉，否则"展示面 + 预览面"两个声音一起播
  function stopAllInline() {
    var els = document.querySelectorAll('.card__img.is-playing');
    for (var i = 0; i < els.length; i++) inlineStop(els[i]);
  }
  function lightboxOpen() {
    var lb = document.getElementById('lightbox');
    return !!(lb && lb.classList.contains('is-open'));
  }
  // 关掉灯箱后由它主动补一次同步，不靠"用户正好又滚了一下"才触发 IntersectionObserver
  var phoneResync = null;

  function setupHoverPlay(imgEl) {
    imgEl.addEventListener('mouseenter', function () { inlinePlay(imgEl); });
    imgEl.addEventListener('mouseleave', function () { inlineStop(imgEl); });
  }

  /* ---------- 手机端：停留即播（没有 hover 可用，改成"停在视口里才播"） ----------
     三条硬约束，少一条就会变成流量黑洞：
       ① 同一时刻全站只播一张（挑视口中心最近的那张），其余立即 pause；
       ② 停留满 500ms 才起播 —— 快速划过时不连环触发下载；
       ③ 开了省数据、或 effectiveType 掉到 2g/3g，整套不启用，退回"点一下开灯箱播"。
     开销按"在播时长 × 码率"涨（本机实测慢慢滑完视频栏一遍 33MB，最重的 douyin-01/06 是 3.2Mbps），
     不是整只文件大小 —— 划走就 pause，所以上限由用户停多久决定。 */
  function setupPhoneAutoPlay(imgEls) {
    var inView = [], dwell = 0, playing = null;
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
    function gateOpen() {
      if (!conn) return true;
      if (conn.saveData) return false;
      return !/(^|[,\s])(2g|3g)(?=$|[,\s])/.test(conn.effectiveType || '');
    }
    function nearestToCenter() {
      var best = null, bd = Infinity;
      for (var i = 0; i < inView.length; i++) {
        var r = inView[i].getBoundingClientRect();
        var d = Math.abs(r.top + r.height / 2 - window.innerHeight / 2);
        if (d < bd) { bd = d; best = inView[i]; }
      }
      return best;
    }
    function sync() {
      if (lightboxOpen()) return;   // 灯箱开着时不许再拉起内联播放，否则两个声音一起响
      var t = nearestToCenter();
      // 只有"还是同一张且它仍在播"才跳过；灯箱会把内联视频停掉，这时要能重新起播
      if (t === playing && t && t._ip && !t._ip.vid.paused) return;
      if (playing) inlineStop(playing);
      playing = t || null;
      if (playing) inlinePlay(playing);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var el = en.target, k = inView.indexOf(el);
        if (en.intersectionRatio >= 0.6) { if (k < 0) inView.push(el); }
        else if (k >= 0) inView.splice(k, 1);
      });
      clearTimeout(dwell);
      // 从"没在播"到起播要停留满 500ms，避免快速划过时连环下载；
      // 但一旦已经在信息流里了，换到下一张就立刻切（B 站那种跟手感）。
      if (playing && playing._ip && !playing._ip.vid.paused) {
        if (gateOpen()) sync();
        return;
      }
      dwell = setTimeout(function () {
        if (!gateOpen()) { if (playing) { inlineStop(playing); playing = null; } return; }
        sync();
      }, 500);
    }, { threshold: [0, 0.6, 1] });
    imgEls.forEach(function (el) { io.observe(el); });
    phoneResync = function () {
      clearTimeout(dwell);
      dwell = setTimeout(function () { if (gateOpen()) sync(); }, 400);
    };
    if (conn && conn.addEventListener) {
      conn.addEventListener('change', function () {
        if (!gateOpen() && playing) { inlineStop(playing); playing = null; }
      });
    }
  }

  // isTouchLike 定义在文件开头「视口高度锁」那一节 —— 三星浏览器谎报 hover 是它的由来，
  // 第三条带手机宽度条件是为了不误伤带触摸屏的笔记本。

  // 动态给所有portfolio cards添加overlay + interactive class
  var phoneVideoCards = [];
  var portfolioCards = document.querySelectorAll('.portfolio .card');
  portfolioCards.forEach(function (card) {
    card.classList.add('card--interactive');
    var imgEl = card.querySelector('.card__img');
    var isVideo = card.classList.contains('card--video');
    if (imgEl && !isVideo) {
      // 图片卡保留那层暗色「点击查看」；视频卡换成悬停即播，不再铺暗罩
      var overlay = document.createElement('span');
      overlay.className = 'card__overlay';
      overlay.innerHTML = '<span class="card__overlay-text">点击查看</span>';
      imgEl.appendChild(overlay);
    }
    if (imgEl && isVideo && !reduceMotion) {
      if (isTouchLike) { phoneVideoCards.push(imgEl); }
      else { setupHoverPlay(imgEl); }
    }
    // 3D tilt hover
    if (!reduceMotion && !isTouchLike) {
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

  if (phoneVideoCards.length && 'IntersectionObserver' in window) setupPhoneAutoPlay(phoneVideoCards);

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
    } else if (lbType === "solo") {
      // 单图查看（如「关于」区的简历卡），不参与任何图库
      currentList = [btn];
    } else {
      currentList = Array.prototype.slice.call(
        document.querySelectorAll(".gallery:not([hidden]) [data-lightbox]")
      );
    }
    currentIndex = currentList.indexOf(btn);
    if (currentIndex < 0) currentIndex = 0;
    stopAllInline();
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
    if (phoneResync) phoneResync();
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

  /* 首屏背景视频：封面用**片子自己的第一帧**，所以静态图和起播画面是同一帧，
     不会再出现"先亮一下再黑掉"的跳帧。<video poster> 是单属性、没法跟 <source media>
     按视口分，所以手机端（竖屏片）由 JS 换封面，断点数值与 CSS 手机端那组一致。
     「减弱动效」下停在封面帧；自动播放被拦时等第一次手势再从头播。 */
  var heroVideo = document.querySelector('.hero__video');
  if (heroVideo) {
    var mqPhone = window.matchMedia('(max-width: 768px)');
    function setHeroPoster() {
      heroVideo.poster = mqPhone.matches
        ? 'assets/video/hero/hero-bg-m-first.jpg?v=1'
        : 'assets/video/hero/hero-bg-first.jpg?v=1';
    }
    setHeroPoster();
    if (mqPhone.addEventListener) mqPhone.addEventListener('change', setHeroPoster);
    function fromFirstFrame() {
      if (heroVideo.currentTime > 0.05) heroVideo.currentTime = 0;
    }
    heroVideo.addEventListener('loadedmetadata', fromFirstFrame);
    if (reduceMotion) {
      heroVideo.pause();
    } else {
      var p = heroVideo.play();
      if (p && p.catch) p.catch(function () {
        var retry = function () {
          fromFirstFrame();
          var p2 = heroVideo.play();
          if (p2 && p2.catch) p2.catch(function () {});
        };
        window.addEventListener('touchstart', retry, { passive: true, once: true });
        window.addEventListener('scroll', retry, { passive: true, once: true });
      });
    }
  }

  /* 背景视频舞台：高度 = 页首到 02 核心能力 的下沿，配合 .bg-stage__pin 的 sticky，
     视频就会一路跟随到那里、然后随舞台一起滚走掐断。
     用 ResizeObserver 量，不挂到 scroll 上 —— 每帧读 getBoundingClientRect 会强制重排。 */
  var bgStage = document.querySelector('.bg-stage');
  var capsSec = document.getElementById('capabilities');
  if (bgStage && capsSec) {
    var sizeBgStage = function () {
      var bottom = capsSec.getBoundingClientRect().bottom + window.pageYOffset;
      bgStage.style.setProperty('--bg-stage-h', Math.round(bottom) + 'px');
    };
    sizeBgStage();
    if (window.ResizeObserver) { new ResizeObserver(sizeBgStage).observe(capsSec); }
    window.addEventListener('load', sizeBgStage);
  }

  /* ---------- 背景 Emoji 互动层 ----------
     效果源自「千问代码_html_20260911.html」：单击召唤 emoji，带重力 / 摩擦 / 弹跳 / 粒子碰撞。
     相对原版的 3 处调整（都是为了适配一个长页面站点）：
       ① 上限 90 个（原 400），避免滚动页面被堆满；
       ② 粒子落到底部静止 3s 后淡出 0.4s 再移除，不会永久堆积；
       ③ 画布 pointer-events:none，点击监听挂 document，不遮挡任何链接 / 按钮。 */
  var emojiCanvas = document.getElementById('emojiBg');
  var emojiOffOnMobile = isMobileViewport;  // 手机端关闭 emoji 效果
  if (emojiCanvas && !reduceMotion && !emojiOffOnMobile) {
    (function () {
      var ctx = emojiCanvas.getContext('2d');
      var EMOJIS = ['😀','😂','🥰','😎','🤩','🥳','😜','🤪','😇','🤠','👻','💩','🎃','👽','🤖','🦄','🐶','🐱','🐼','🦊','🐸','🐵','🦁','🐯','🐻','🐷','🐮','🐔','🦖','🐙','🍕','🍔','🍟','🍩','🍪','🍎','🍉','🍓','🍇','🍌','⭐','🌈','🔥','💎','💖','🎈','🎁','🎵','🚀','⚽','🏀','🎮'];
      var GRAVITY = 0.5, FRICTION = 0.985, BOUNCE = 0.7, GROUND_FRICTION = 0.9;
      var MAX_PARTICLES = 90, REST_HOLD = 3000, FADE_MS = 400, MAX_LIFE = 15000; // 掉到底部 3s 后淡出，淡出历时 0.4s（按时间而非帧数，避免低帧率下拖长）
      var W = 0, H = 0;
      var particles = [];
      var loopRunning = false;

      function resize() {
        var dpr = Math.min(2, window.devicePixelRatio || 1);
        W = window.innerWidth; H = window.innerHeight;
        emojiCanvas.width = Math.round(W * dpr);
        emojiCanvas.height = Math.round(H * dpr);
        emojiCanvas.style.width = W + 'px';
        emojiCanvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      window.addEventListener('resize', resize);

      function Emoji(x, y, char) {
        this.x = x; this.y = y; this.char = char;
        this.r = 14 + Math.random() * 12;
        var angle = Math.random() * Math.PI * 2;
        var speed = 4 + Math.random() * 8;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 6;
        this.rot = Math.random() * Math.PI * 2;
        this.vr = (Math.random() - 0.5) * 0.2;
        this.mass = this.r * this.r;
        this.alpha = 1;
        this.bornAt = 0;
        this.groundSince = 0;
        this.lastAt = 0;
      }
      Emoji.prototype.update = function (now) {
        if (!this.bornAt) this.bornAt = now;
        // 帧间隔（毫秒，封顶 50ms，避免切后台回来一帧直接把 alpha 打穿）
        var dt = this.lastAt ? Math.min(50, now - this.lastAt) : 16.7;
        this.lastAt = now;

        this.vy += GRAVITY;
        this.vx *= FRICTION;
        this.vy *= FRICTION;
        this.x += this.vx;
        this.y += this.vy;
        this.rot += this.vr;

        if (this.y + this.r > H) {
          this.y = H - this.r;
          this.vy *= -BOUNCE;
          this.vx *= GROUND_FRICTION;
          this.vr *= 0.8;
          if (Math.abs(this.vy) < 1) {
            this.vy = 0;
            this.vx *= 0.88;   // 落定后额外衰减水平速度，尽快停下
            this.vr *= 0.7;
          }
          // 首次触地时刻（只记一次，弹跳不重置）——倒计时从"掉到底部"那一刻开始
          if (!this.groundSince) this.groundSince = now;
        }
        if (this.y - this.r < 0) { this.y = this.r; this.vy *= -BOUNCE; }
        if (this.x - this.r < 0) { this.x = this.r; this.vx *= -BOUNCE; }
        if (this.x + this.r > W) { this.x = W - this.r; this.vx *= -BOUNCE; }

        // 消失判定：掉到底部（首次触地）后 3s 淡出；另设总寿命兜底（避免叠在别的粒子上永不触地）
        var fadeAt = this.groundSince ? this.groundSince + REST_HOLD : this.bornAt + MAX_LIFE;
        if (now > fadeAt) this.alpha = Math.max(0, this.alpha - dt / FADE_MS);
      };
      Emoji.prototype.draw = function () {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.min(1, this.alpha);
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.font = (this.r * 2) + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.char, 0, 0);
        ctx.restore();
      };

      function resolveCollision(a, b) {
        var dx = b.x - a.x, dy = b.y - a.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var minDist = a.r + b.r;
        if (dist === 0 || dist >= minDist) return;
        var nx = dx / dist, ny = dy / dist;
        var overlap = (minDist - dist) / 2;
        a.x -= nx * overlap; a.y -= ny * overlap;
        b.x += nx * overlap; b.y += ny * overlap;
        var dvx = b.vx - a.vx, dvy = b.vy - a.vy;
        var vn = dvx * nx + dvy * ny;
        if (vn > 0) return;
        var j = -(1 + 0.8) * vn / (1 / a.mass + 1 / b.mass);
        a.vx -= j * nx / a.mass; a.vy -= j * ny / a.mass;
        b.vx += j * nx / b.mass; b.vy += j * ny / b.mass;
      }

      function loop(now) {
        ctx.clearRect(0, 0, W, H);
        var i, j;
        for (i = 0; i < particles.length; i++) particles[i].update(now);
        for (i = 0; i < particles.length; i++) {
          for (j = i + 1; j < particles.length; j++) resolveCollision(particles[i], particles[j]);
        }
        var alive = [];
        for (i = 0; i < particles.length; i++) {
          if (particles[i].alpha > 0) { particles[i].draw(); alive.push(particles[i]); }
        }
        particles = alive;
        if (particles.length) window.requestAnimationFrame(loop);
        else { ctx.clearRect(0, 0, W, H); loopRunning = false; }
      }
      function startLoop() {
        if (!loopRunning) { loopRunning = true; window.requestAnimationFrame(loop); }
      }

      function spawn(x, y) {
        var count = 8 + Math.floor(Math.random() * 7); // 8~14 个
        for (var i = 0; i < count; i++) {
          particles.push(new Emoji(x, y, EMOJIS[Math.floor(Math.random() * EMOJIS.length)]));
        }
        while (particles.length > MAX_PARTICLES) particles.shift();
        startLoop();
      }

      document.addEventListener('pointerdown', function (e) {
        spawn(e.clientX, e.clientY);
      }, { passive: true });

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) { particles = []; ctx.clearRect(0, 0, W, H); loopRunning = false; }
      });
    })();
  }
})();
