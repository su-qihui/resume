# AGENTS.md — 苏其辉作品集站点 · 速读文档

> 供 AI agent 快速建立上下文用。读完本文即可直接改代码，无需再通读全部源码。
> **本目录 = `mbl-resume-neo`：在 `resume-main` 基础上增加毛玻璃（Frosted Glass）主题层的变体。**
> 基底版本：`HTTP/resume-34f.pages.dev/resume-main`（含 2026-09-12 三轮改动）
> 与线上 https://resume-34f.pages.dev 的关系：基底同源，本目录未部署
> 更新日期：2026-09-12

## 1. 一句话定位

个人作品集单页站点。**原生 HTML + CSS + ES5 风格 JS，零依赖、零构建、可离线**，部署在 Cloudflare Pages。改完直接刷新即可见效果，没有编译步骤。

## 2. 文件地图

| 路径 | 体积 | 职责 | 是否被引用 |
|---|---|---|---|
| `index.html` | 35.7 KB | 唯一页面，9 个语义区块 + 灯箱 + 回到顶部 | ✅ 入口 |
| `css/v2-style.css` | 40.9 KB | 双主题 Token、排版、动画、响应式、无障碍 | ✅ 被 index.html |
| `js/v2-main.js` | 26.6 KB | 全部交互（IIFE，无模块化） | ✅ 被 index.html |
| `assets/img/portfolio/{ai,cdr}/` | 10 张 WebP | 作品图 | ✅ |
| `assets/img/gear/` | 10 张 | 9 件设备图 + `sold-stamp.webp` 已售印章 | ✅ |
| `assets/img/skills/*.svg` | 12 个 | 软件 / AI 工具图标（`fill=currentColor`） | ✅ |
| `assets/img/resume/` | cover.jpg / cv.jpg / headshot.png | 封面（1.2 版）、简历（2.8.1 版）、头像 | ✅ |
| `assets/pdf/` | resume-su-qihui.pdf | 供导航「导出简历」下载的 PDF（1.5 MB） | ✅ |
| `assets/video/{douyin,school}/` | 15 段 mp4 + 同名 jpg 封面 | 视频与封面 | ⚠️ 仅 9 段被用 |
| `assets/video/vibecoding/` | 2 段 mp4 + 2 张 jpg 封面 | VibeCoding 栏：Trace / 简历视频（源 4K 已压到 720p，合计 4.5 MB） | ✅ |
| `assets/video/douyin/douyin-quanzhou.*` | 1 段 mp4 + 1 张 jpg | 泉州旅行-DJInano（源 4K 已压到 720p，5.8 MB） | ✅ |
| `tools/compress_videos.sh` | — | 批量转码 720p H.264 + faststart | 手动工具 |
| `css/style.css`、`js/main.js`、`v2.html` | — | **v1 遗留，全未被引用**（`v2.html` 与 `index.html` 逐字节相同） | ❌ 可删 |

**只加载两个文件**：`css/v2-style.css` + `js/v2-main.js`。改样式改前者，改交互改后者。

## 3. 页面结构

`<body>` 顺序即页面顺序。导航 7 项，但区块有 9 个（`#skills`、`#certificates` 无导航入口）。

| 序 | DOM id | 标题 | 导航 | 核心 DOM 钩子 |
|---|---|---|---|---|
| 首屏 | `#home` | 苏其辉 / SU QIHUI | 首页 | `.hero__product`（原 `.hero__avatar` 已移除） |
| 01 | `#about` | 用视觉讲述故事 | 关于 | `.about__grid` `.about__card` `.about__stats .num[data-count]` |
| — | （同一 section 内） | 创作装备 | — | `.gear__scatter` `.gear__item[data-angle]`（9 件） |
| 02 | `#capabilities` | 随滚动，逐步展开 | 能力 | `#capsTrack` `#capsVisual` `.caps__media[data-stage]` `.caps__cap[data-stage]` |
| 03 | `#skills` | 工具，是手的延伸 | — | `#skillRadar`（SVG 由 JS 生成）`.skill-icon[data-skill]` |
| 04 | `#experience` | 一路走来 | 经历 | `.tl__item` `.tl__toggle` `.tl__detail` |
| 05 | `#portfolio` | 精选案例 | 作品 | `#portfolioTabs` `.tab[data-filter]` `.gallery[data-group]` |
| 06 | `#douyin` | 镜头很勤快，剪辑很懒情 | 抖音 | `.douyin__phone` |
| 07 | `#certificates` | 认可与认证 | — | `.certs__grid` |
| 08 | `#contact` | 一起，把想法做出来 | 联系 | `.contact__grid` |
| — | — | 全局浮层 | — | `#lightbox` `#backTop` `#themeToggle` `#navBurger` `.scroll-progress` `.cursor-glow` `.theme-ripple` |

## 4. 设计 Token（`css/v2-style.css` 顶部）

改主题色只需改这两个块，全站自动跟随。

| Token | light | dark | 用途 |
|---|---|---|---|
| `--bg` / `--bg-soft` / `--surface` | `#ffffff` / `#f5f5f7` / `#fbfbfd` | `#000000` / `#0a0a0a` / `#161617` | 底色 / 交替底 / 卡面 |
| `--text` / `--text-2` | `#1d1d1f` / `#6e6e73` | `#f5f5f7` / `#a1a1a6` | 主 / 次文字 |
| `--line` | `#d2d2d7` | `#2a2a2c` | 描边 / 分隔 |
| `--accent` | `#0071e3` | `#2997ff` | 品牌蓝 |
| `--nav-bg` | `rgba(255,255,255,.72)` | `rgba(10,10,10,.66)` | 导航毛玻璃 |
| `--shadow` | `0 20px 60px rgba(0,0,0,.12)` | `... .6` | 大投影 |

排版：正文 17px / 行高 1.7（≤768px 降 16px）；内容宽 `min(1200px,92vw)`；区块纵距 `clamp(64px,10vh,120px)`；药丸圆角 `980px`。
曲线：弹性入场 `cubic-bezier(.34,1.56,.64,1)`，平稳过渡 `cubic-bezier(.16,1,.3,1)`。

## 5. 交互实现索引（改行为直接搜这些）

全部在 `js/v2-main.js` 内，按出现顺序排列。

| 功能 | 依赖的 DOM / 属性 | 关键参数 |
|---|---|---|
| 主题切换（圆形扩散） | `#themeToggle`、`.theme-ripple` | 扩散 0.7s / 收缩 0.5s，写 localStorage `theme` |
| 导航毛玻璃 + 汉堡菜单 | `#nav`、`#navBurger`、`#navLinks` | `scrollY > 20` 加 `.is-scrolled` |
| 多层视差 | 任意元素加 `data-parallax-speed` | 现仅 hero 背景 0.15、光晕 0.25 |
| 钉住滚动叙事 | `#capsTrack`（420vh）、`#capsVisual` | 进度 p → `--cap-rot` 从 −18° 到 +18°；`floor(p×4)` 切 stage |
| 滚动进度条 | `.scroll-progress` | 顶层 2px，`scrollY / 可滚动高度` |
| 光标跟随光晕 | `.cursor-glow` | lerp 0.15；触摸端改 touchstart 跟随 |
| 3D 倾斜 | 任意 `.tilt-card`，作品卡由 JS 加 `.card--interactive` | 卡片 ±12°，作品卡 ±6° |
| 滚动揭示 | 任意元素加 `data-reveal` + 可选 `data-reveal-delay="80"` | `IntersectionObserver`，threshold 0.12，触发后 unobserve |
| 数字滚动 | `.num[data-count]` | 1200ms，easeOutCubic |
| 雷达图 | `#skillRadar` + JS 内 `skillData` 数组 | 8 轴，R=110，分值硬编码在数组里 |
| 技能图标联动 | `.radar-dot[data-skill-index]` ↔ `.skill-icon[data-skill]` | 双向 hover 高亮 |
| 装备散开入场 | `.gear__item[data-angle]` | JS 注入 `--angle/--lift/--scale`，每件错位 60ms；`lifts`/`scales` 数组按 DOM 顺序对齐，**增减装备必须同步改数组** |
| 背景 Emoji 互动层 | `#emojiBg`（`<canvas>`，`z-index:-1`） | 点击任意处召唤 8~14 个 emoji，重力 0.5 / 摩擦 0.985 / 弹跳 0.7 / 粒子碰撞；上限 90 个，**首次掉到底部后 3s 淡出、0.4s 内消失**；**≤768px 手机端整体关闭**（CSS `display:none` + JS `matchMedia` 短路，不初始化引擎、点击也不响应） |
| 时间线展开 | `.tl__toggle` → `.tl__item.is-open` | `max-height` 0 → 200px |
| 作品集筛选 | `.tab[data-filter]` → `.gallery[data-group]` | 切换时 80ms 错位入场 |
| 灯箱 | `[data-lightbox]` = `image` / `video` / `gear` / `solo` | Esc 关、←→ 切换、点遮罩关；`video` 类型自动 play；`solo` 为单图查看（不参与任何图库） |

性能约定（改动时请保持）：滚动只挂 1 个监听 + `rAF` 节流 + `{passive:true}`；只动 `transform`/`opacity`；Observer 触发后 `unobserve`。

## 6. 常用改动指引

| 想改什么 | 改哪里 |
|---|---|
| 文案 / 联系方式 | 直接改 `index.html` 对应区块 |
| 主题色 | `v2-style.css` 的 `:root` 与 `[data-theme="dark"]` 两个块 |
| 加一张作品图 | 图片丢进 `assets/img/portfolio/{ai,cdr}/`，在对应 `.gallery` 里复制一个 `<figure class="card">`，改 `data-src` / `data-title` / `<figcaption>` |
| 加一段视频 | mp4 + 同名 jpg 封面放 `assets/video/{school,douyin}/`，复制 `<figure class="card card--video">`，改 `data-src` / `data-poster` / `data-title` |
| 改技能分值 | `js/v2-main.js` 里的 `skillData` 数组（`score` 0–100） |
| 加/改时间线 | 复制 `.tl__item` 结构，补充 `.tl__detail` 内段落 |
| 加/改装备 | 复制 `.gear__item`，注意 `data-angle`（旋转角，度）与 `.gear__item--sold` 类；**同时改 `js/v2-main.js` 里 `lifts` / `scales` 两个数组**（按下标对应 DOM 顺序，中间件大、两侧已售件小） |
| 加导航项 | `#navLinks` 里加 `<a class="nav__link" data-section="区块id">`，`data-section` 必须等于目标 `section[id]` |
| **改完资源记得升版本号** | `index.html` 里 CSS / JS / 封面图都带 `?v=` 查询串（当前 `css/v2-style.css?v=20260912`、`js/v2-main.js?v=20260912`、`cover.jpg?v=1.2`、`cv.jpg?v=2.8.1`）。同名文件覆盖后浏览器仍会吃缓存，**不升版本号页面看起来"没变"**。换图 / 改样式 / 改脚本后把对应 `?v=` 递增即可 |
| 加一段作品视频 | mp4 + 同名 jpg 封面放 `assets/video/<分组>/`，在对应 `.gallery[data-group]` 里复制一个 `<figure class="card card--video">`，改 `data-src` / `data-poster` / `data-title`；分组标签在 `.tabs` 里加 `<button class="tab" data-filter="<分组>">` |
| 换导出简历的 PDF | 覆盖 `assets/pdf/resume-su-qihui.pdf`（文件名保持 ASCII，避免 URL 编码）；导航按钮在 `.nav__actions` 里的 `.nav__export`，`download` 属性决定保存的文件名 |
| 换简历大图 | 覆盖 `assets/img/resume/cv.jpg` 并同步改 `.about__card` 与灯箱的 `data-src` 版本号（当前 `?v=2.8.1`）；图是 A4 比例，卡片 `aspect-ratio: 210/297` 与之匹配，别改回 `3/4` 否则会裁掉底部 |

## 7. 已知问题（改代码前先看，避免踩坑）

| 优先级 | 问题 | 位置 / 证据 | 修法 |
|---|---|---|---|
| ~~**P0**~~ | ~~线上头像 404~~ | **已修复**：改为直接移除首屏头像（`hero__avatar` 的 DOM / CSS / JS 已全部删除），导航 logo 仍使用 `assets/img/resume/headshot.png` | — |
| ~~P1~~ | ~~封面图印着「年龄 18 岁」~~ | **已修复**：换成 1.2 版封面（19 岁）并覆盖 `assets/img/resume/cover.jpg` | — |
| P1 | 抖音链接串入分享文案 | `href="https://v.douyin.com/-5uPGKXw7kI/ 8@4.com :9pm"`，含空格与残留字符，抖音区与联系区各一处 | 换成干净短链 |
| P2 | 6 段视频未挂载 | `douyin-03/04/05/07/08.mp4`、`school-05.mp4` 在目录里但 HTML 无引用 | 补进作品集或删除 |
| P2 | v1 遗留文件 | `css/style.css`、`js/main.js`、`v2.html` 均未被引用 | 归档或删除 |
| P2 | 导航缺 2 个入口 | `#skills`、`#certificates` 无导航项 | 补 `nav__link` |
| P3 | 未定义变量 | `v2-style.css` 中 `.radar-label` 用 `font-family: var(--sans)`，`--sans` 全站未定义 | 改 `var(--ff-body)` 或删该行 |
| P3 | 死代码 | `.skills__grid`、`.skill`、`.skill__icon`、`.skill__name` 无对应 DOM | 清理 |
| P3 | 重复媒体查询 | `.caps__track` 在 `≤768px` 先设 360vh 后又设 300vh，前者永不生效 | 合并为一处 |
| P3 | 灯箱视频可能不自动播 | `v2-main.js` 中 `autoplay` 未设 `muted`，部分浏览器拒绝（代码已 catch，不报错） | 需必定自动播就加 `v.muted = true` |

非缺陷但需知：主题初值取 `matchMedia('(prefers-color-scheme: light)')`，在无系统偏好的环境（无头渲染、部分 WebView）会落到**深色**。

## 8. 运行与部署

```bash
# 本地预览（推荐，避免 file:// 限制）
python -m http.server 8765      # 然后开 http://127.0.0.1:8765
```

也可直接双击 `index.html`——纯静态、无模块、无跨域请求限制，但视频在 `file://` 下可能不播。

部署：Cloudflare Pages，推仓库即上线。无构建命令，输出目录为仓库根（本目录）。

## 9. 观感速记（无图版，供判断改动影响面）

- **首屏**：淡蓝紫氛围光 + 大字姓名渐变 + 封面卡缩放登场，文字自 0ms 起每 80ms 逐级浮现。
- **装备区**：8 件设备呈扇面散开，已售三件降透明加灰度并盖"已售"印章，hover 复原放大。
- **能力区**：滚动时中央视觉体缓慢立体旋转，四项能力依次切换，底部圆点指示。
- **技能区**：SVG 雷达图替代进度条，图与图标双向 hover 联动。
- **作品区**：2 列瀑布卡片，hover 抬升 + 遮罩"点击播放/查看"，点击开灯箱。
- **深色模式**：纯黑底，作品图成为画面唯一亮部；切换有从按钮原点扩散的圆动画。
- **背景 Emoji**：单击页面任意处，8~14 个 emoji 从点击点炸开，受重力下落、落地弹跳、彼此碰撞，掉到底部后 3 秒淡出。画布是 `z-index:-1`，只露在页面空白处，**不会盖住任何文字**，也不拦截点击。
- **右上角**：导航栏右侧常驻「导出简历」蓝色按钮（图标 + 文字），点击直接下载 PDF。
- **毛玻璃**（本变体）：**背景与基底版完全一致**（白底 / `--bg-soft` / hero 自带渐变，未加任何背景图层）。变化只在 UI 元素：导航是吸顶磨砂条（内容从下面滚过时会被糊开）、作品卡 / 时间线卡 / 证书卡 / 联系卡 / 技能胶囊都有半透明白底 + 顶边内高光 + 一道极淡的冷色斜向光泽、装备是玻璃相框、页脚是一条玻璃横带；灯箱换成"浅黑影 + 强模糊"，背景始终可辨认。深色主题下白玻璃降到 12% 透明度、模糊加大一档，呈夜间磨砂观感。
- **简历卡**：鼠标移到「关于」区的简历上会浮出「点击查看大图」遮罩，点击进灯箱看整张 A4。
- 全局叠了一层 4% 透明度的 SVG 噪点（`.section::after`），用来消除大片渐变的塑料感——改 `.section` 背景时别把它盖掉。

## 10. 毛玻璃主题层（本变体特有）

> 配方来源：`~/.workbuddy/skills/frosted-glass-web`（backdrop-blur）。全部代码在 `css/v2-style.css` 末尾的
> 「mbl-resume-neo · 毛玻璃主题层」一个区块里，**HTML 与 JS 零改动**。

### 10.1 前提：不改背景，所以玻璃靠什么被看见

**本变体明确不改动原有背景**：`body` 仍是白底 / `--bg-soft` / hero 自带渐变，`.caps` 仍是 `var(--bg-soft)`，
没有加任何背景图层。由此带来一个必须知道的客观事实：

> `backdrop-filter` 只是「把身后已有的东西糊掉」。背景接近纯白时**几乎没有内容可糊**，模糊本身基本是"空转"。
> 真正能看到 blur 的地方只有两处：**内容从固定导航底下滚过**时，以及**灯箱浮层**（身后有整页内容）。

所以玻璃质感由这三样共同表达，改样式时不要只盯着 `backdrop-filter`：

| 手法 | 令牌 | 作用 |
|---|---|---|
| 半透明填充 | `--glass-alpha` | 让底色透出来一点 |
| 冷色斜向光泽 | `--glass-sheen` | 白底上**最能被看见**的一笔，给卡面一道淡淡的玻璃反光 |
| 内高光描边 | `--glass-highlight` | 顶边一条内高光，玻璃的"厚度感"来源 |

> 若哪天想让模糊真正显形，**必须先给背景加细节**（渐变光斑 / 纹理 / 图片）——这是毛玻璃成立的物理前提，
> 与 CSS 写得对不对无关。判断标准：把 `backdrop-filter` 那行删掉，界面还能读吗？能读 → 它只是增强；
> 不能读 → 该修的是底色对比度，不是加模糊。

### 10.2 玻璃令牌

浅色与深色各一套，全部挂在 `:root, [data-theme="light"]` 与 `[data-theme="dark"]` 下：

| 令牌 | 浅色 | 深色 | 说明 |
|---|---|---|---|
| `--glass-alpha` | `.52` | `.12` | 卡面底色透明度。**深色底必须砍到 .10 附近**，否则白玻璃叠上去变灰雾 |
| `--glass-alpha-nav` | `.62` | `.10` | 导航栏。底子要比卡片厚，保证滚动时文字可读 |
| `--glass-blur` | `14px` | `20px` | 深色底模糊要加大一档 |
| `--glass-sat` | `180%` | `160%` | 模糊会把颜色揉淡，提饱和把色彩找回来 |
| `--glass-hairline` | `rgba(17,20,28,.07)` | `rgba(255,255,255,.10)` | **外描边用淡灰细线**。原背景是浅色，skill 默认的白色描边会直接"消失" |
| `--glass-highlight` | `rgba(255,255,255,.78)` | `rgba(255,255,255,.08)` | 顶边内高光（`inset 0 1px 0`） |
| `--glass-sheen` | `rgba(219,231,255,.26)` | `rgba(255,255,255,.07)` | 140° 冷色斜向光泽 |
| `--glass-border` | `rgba(255,255,255,.62)` | `rgba(255,255,255,.14)` | 仅用于装备相框 / 徽标等"图上有玻璃"的地方 |
| `--glass-ink / -2` | `#1a1d26` / `#4a5060` | `#f5f6fa` / `rgba(255,255,255,.72)` | 玻璃上的文字，**不要用灰字** |

### 10.3 玻璃作用范围

| 档位 | 元素 | 参数 |
|---|---|---|
| 吸顶导航 | `.nav.is-scrolled` | `blur(16px) saturate(180%)` |
| 卡面（通用） | `.card` `.tl__card` `.cert` `.contact__item` `.skill-icon` `.tab` `.about__card` `.douyin__phone` `.back-top` `.caps__visual` | `blur(var(--glass-blur)) saturate(var(--glass-sat))` + 高光描边 |
| 玻璃相框 | `.gear__item` | **只做描边+半透明白底，不加 backdrop-filter** —— 图本身不透明，加模糊纯浪费一层合成 |
| 页脚横带 | `.footer` | 同卡面 |
| 浮层（强隔离） | `#lightbox` 遮罩 / 关闭键 / 左右键 / 说明条 | 遮罩用 `rgba(10,12,20,.30)` + `blur(24px)`。**不要用纯黑半透明**，那样毛玻璃就白做了 |

配套改动：玻璃容器上重绑 `--text / --text-2 / --line` 三个变量，让内部文字自动切到玻璃专用墨色。
**除此之外页面其余部分（背景、分区底色、标题、正文、JS）全部保持原样**——`.caps` 仍是 `var(--bg-soft)`、
`.card__img` / `.tl__detail` 仍是原色、`--text-2` 仍是 `#6e6e73`。

### 10.4 降级（不可省）

- `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))` → 全部退回纯色。
- `@media (prefers-reduced-transparency: reduce)` → 关掉所有 `backdrop-filter`。
- 每个玻璃元素都写了 `-webkit-backdrop-filter`（不然 Safari 全线失效）。

### 10.5 性能与可读性约定

- 移动端（≤768px）模糊降到 `10px`、底子加厚到 `.68`（导航 `.72`）——玻璃层数越少越省，可读性也更好。
- 动画只动 `opacity` / `background`，**绝不动 `blur()` 半径**。
- 改了玻璃底子后，务必回看玻璃上的正文对比度：`--glass-alpha` 调低时文字要保持 ≥4.5:1。

## 11. 变更记录

**2026-09-12**
1. 创作装备新增第 9 件 **DJI Osmo 360 II**（`assets/img/gear/djiosmo360ii.jpg`，`data-angle="0"`），同步把 `lifts`/`scales` 扩到 9 项；移动端装备网格由 4 列改 3 列（正好 3×3），并修掉 ≤480px 下 `.gear__item` 被写死 72px 宽的老 bug。
2. 年龄 18 → **19**（`about__lead` 文案 + `.num[data-count]`）。
3. 新增**背景 Emoji 互动层**（`#emojiBg` + `.emoji-bg` + JS 尾部的 Emoji 引擎），效果移植自 `千问代码_html_20260911.html`。适配改动：上限 400→90、静止后淡出、画布 `z-index:-1` 且 `pointer-events:none`。
4. **移除首屏头像** `hero__avatar`（原引用 `headshot.webp`，线上 404 导致破图），DOM / CSS / JS 一并清干净。
5. 关于栏简历换成 **2.8.1 义乌版**（覆盖 `assets/img/resume/cv.jpg`，压到 1240×1754 / 294 KB，src 加 `?v=2.8.1` 破缓存）；`.about__card` 比例由 `3/4` 改为 `210/297`，避免裁掉简历底部内容。

> 改动前的原始文件备份在 `E:\vibe coding\Resume\HTTP\_backup\resume-main-20260912\`。

**2026-09-12（第二轮）**
1. Emoji 生命周期改为「掉到底部后 3s 淡出、0.4s 内消失」，见 §5 该行；另修掉一个隐蔽 bug：`alpha -= 1/24` 浮点累加**永远到不了 0**，粒子只是变透明却不出列，rAF 循环会一直空转 —— 现在用 `Math.max(0, alpha - dt/FADE_MS)` 按时间衰减。
2. 导航右上角新增 **「导出简历」** 按钮（`.nav__export`），下载 `assets/pdf/resume-su-qihui.pdf`，`download` 属性写明保存名「苏其辉-影视后期-新媒体.pdf」。
3. 首屏封面换成 **1.2 版**（19 岁），覆盖 `assets/img/resume/cover.jpg`（1240×1754 / 133 KB）。
4. 「关于」区简历卡改为 **可点击查看大图**：`div` → `button` + `data-lightbox="solo"`，hover 出「点击查看大图」遮罩，点击进灯箱；`openLb()` 增加 `solo` 分支（否则会因为不在图库中而串到作品集第一张图）。
5. **修复首屏姓名下沿被裁**：`.hero__name` 用 `background-clip: text` + `color: transparent`，而 `.hero__title` 的 `line-height:0.95` 使元素盒只有 133.4px，字形墨迹下探到盒底**下方 4.7px** —— 渐变只画在盒内，超出部分没有背景色 → 变透明 → 视觉上被切掉。修法：`.hero__name { padding-bottom:0.12em; margin-bottom:-0.12em }`，背景盒下扩 0.12em（余量一倍），等量负外边距把下一行拉回原位。实测修复后「SU QIHUI」「多媒体设计师」位置与基底版**逐像素一致**（enTop 286.5 / titleH 164.7 / nextTop 329.8），版式零位移。
   ⚠️ **基底站 `resume-main` 有同样的 bug，尚未修** —— 若要在线上生效，需把这段一并带过去。

**2026-09-12（第三轮，按用户反馈两度调整）**
1. **手机端关闭 Emoji**：`≤768px` 时 `.emoji-bg { display:none !important }`，且 JS 用 `matchMedia('(max-width:768px)')` 直接**不初始化引擎**（点击也不响应，省 CPU）。
2. **手机端关闭"蓝点追踪"**：跟随手指的蓝色光晕（`.cursor-glow`）在手机上 `display:none`，且 JS 里光晕初始化同样短路 —— CSS + JS 双保险。
3. **手机端毛玻璃按主题分档：浅色开、深色关**。深色的还原层写在 `css/v2-style.css` **文件最末尾**（必须放在玻璃层之后，否则同权重会被玻璃层反过来盖掉），全部用 `[data-theme="dark"]` 前缀，只对深色生效 —— 浅色继续吃上面的玻璃层。
   深色关的理由：黑底上白玻璃只会变灰雾，手机上多一层 blur 还纯耗电；浅色白玻璃仍能透出光泽，值得开。
   深色还原时**玻璃专用墨色也要一并还原**（`[data-theme="dark"] { --glass-ink/-2/--border-soft }` 设回主题默认），否则玻璃层里 `--text: var(--glass-ink)` 会把深色卡面文字染成玻璃墨色。
   **例外**：`.about__card-badge` 的 `blur(12px)` 是**基底版本来就有的**，深色手机端保持原样。
4. **装备区手机端保留散开效果，但排成"上 4 下 5"，已售 3 件集中到下排末尾**：
   - 排布：`repeat(20, 1fr)`，DOM 第 3~6 个（在用的收藏柜 / Osmo Nano / Osmo 360 II / Neo 2）`grid-column: span 5`（4×5=20 → 上排），其余 5 个 `span 4`（5×4=20 → 下排）。
   - 已售 3 件（DOM 第 1、2、9 个）用 **CSS `order: 10`** 排到显示顺序最后 → 正好落在下排末尾 3 个位置，且 `.gear__item--sold { z-index:0 }` 压到下层。桌面端不设 `order`，仍是一排 9 件（已售在两端）。
   - **列间距必须为 0**（`gap: 22px 0`），改用每件自身 `margin: 0 3px` 留缝 —— 若用列 gap，"跨 5 格 × 4 件"会随视口变窄把第 4 件挤到下一行（360px 实测会变成 3+1+…）。
   - 每件另配一套 `--angle/--lift/--scale`（`!important` 盖过 JS 内联值，角度正负交错、位移 ±9px、缩放 .84~1），排布"乱而有序"。
   - 实测 320/390/414px：都是上 4 下 5、无溢出；1440px 桌面端仍是一排 9 件散开扇形（已售在两端）。
5. ⚠️ 两条反复踩的坑：**① JS 写进内联样式的 CSS 变量，样式表必须 `!important` 才压得过**（普通规则永远输）；**② 后加的覆盖层必须放在被覆盖层之后**，否则同权重下先写的会被后写的盖掉。
6. CSS/JS 版本号 `?v=neo8`。

**2026-09-12（第四轮）**
1. **精选案例新增「VibeCoding」筛选栏**（5 个标签：全部 / 视频作品 / VibeCoding / AI 平面设计 / CDR 制版）。
   - 新图库 `<div class="gallery gallery--video" data-group="vibecoding" hidden>`，两张卡：`vibecoding-01`（Trace）、`vibecoding-02`（简历视频）。
   - Trace 卡片说明里挂开源地址 `https://gitee.com/goushiiyun/trace`（`.card__link`，蓝色下划线，可点）；图库底部一行 `.gallery__note`：**以上视频效果使用 Codex + Hyperframes 制作**。
   - 两个新样式类加在 `v2 升级样式` 之前：`.card__link`、`.gallery__note`（后者 `grid-column: 1/-1` 跨满两列）。
2. **视频压缩**（源 4K60 太大，刷新很慢）：
   | 源 | 原始 | 压缩后 |
   |---|---|---|
   | Trace最终4K-v1.mp4 | 3840×2160 / 60fps / 386 MB / 73.6s | 1280×720 / 30fps / **3.09 MB** |
   | 简历视频.mp4 | 3840×2160 / 60fps / 164 MB / 34.0s | 1280×720 / 30fps / **1.43 MB** |
   命令：`ffmpeg -i in.mp4 -vf "scale=1280:-2,fps=30" -c:v libx264 -preset medium -crf 27 -pix_fmt yuv420p -c:a aac -b:a 96k -ac 1 -movflags +faststart out.mp4`，封面用 `-ss 0.6 -frames:v 1 -q:v 2` 抽帧。
   ⚠️ **中文文件名会让 ffmpeg 报 `Illegal byte sequence`** —— 先 `cp` 到 `$TEMP` 下的纯 ASCII 文件名再转码（`tools/compress_videos.sh` 里也是这么绕的）。
3. 基底站 `resume-main` 同步了同样的改动（含视频与样式）。
4. **视频作品新增「泉州旅行-DJInano」**（第 10 张视频卡，排在末尾）：`assets/video/douyin/douyin-quanzhou.mp4`（720p30 / 5.8 MB，源 4K60 / 120 MB / 19.8s）+ 封面 `douyin-quanzhou.jpg`，标签「抖音」。
5. **删除抖音区宣传标语**「镜头很勤快，剪辑很懒情」（用户要求，两站同步）。
5. **补缓存版本号**：上一轮改完 `cover.jpg` 后页面仍显示旧封面——磁盘文件确实是新的（1240×1754），但没有 `?v=` 查询串，浏览器直接吃缓存。现已给 `css/v2-style.css`、`js/v2-main.js` 加 `?v=20260912`，`cover.jpg` 加 `?v=1.2`。**今后覆盖任何同名资源都必须递增版本号**。

**2026-09-12（mbl-resume-neo 毛玻璃变体）**
1. 从 `resume-main` 整体复制而来，本目录的 CSS/JS 引用版本号为 `?v=neo1`。
2. 新增毛玻璃主题层，详见 §10。改动只落在 `css/v2-style.css` 末尾追加的玻璃层；**HTML 与 JS 零改动**。
3. **第一版做错过一次方向**：最初按 skill 的"先造背景再上玻璃"思路加了一层彩色光斑背景（`.bg-scene`），用户明确要求**背景保持原样、只把 UI 元素换成玻璃**，已全部撤掉。撤掉后连带的还原项：`.caps` 分区底色回到 `var(--bg-soft)`、`.card__img` / `.tl__detail` 回到原色、`--text-2` 回到 `#6e6e73`、移除标题 `text-shadow`。当前 `index.html` 里只有 1 处本变体注释，无新增元素。
4. **代价要说清**：背景是纯白时 `backdrop-filter` 几乎没有内容可糊，模糊基本"空转"。为了让玻璃仍可感知，改用「半透明填充 + 冷色斜向光泽 `--glass-sheen` + 顶边内高光」三件套来承载质感；写 CSS 时**别只调 `backdrop-filter`**。若以后要让模糊显形，前提是给背景加细节（渐变/纹理/图），这不是 CSS 写法问题。
4. 验证说明：本页整页高度 **15,539px**，在无 GPU 的软件光栅下 `Page.captureScreenshot(captureBeyondViewport:true)` 会让渲染器崩溃（**原站同样如此，与毛玻璃无关**），因此 skill 自带的 `shot.mjs` 在本环境跑不通。改用逐屏视口截图（18 张，桌面/移动 × 浅色/深色 + 灯箱）完成验收，无 JS 异常、无 4xx、移动端无横向溢出。

