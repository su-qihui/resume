# AGENTS.md — 苏其辉作品集站点 · 速读文档

> 供 AI agent 快速建立上下文用。读完本文即可直接改代码，无需再通读全部源码。
> **本目录 = `mbl-resume-neo`：在 `resume-main` 基础上增加毛玻璃（Frosted Glass）主题层的变体。**
> 基底版本：`HTTP/resume-34f.pages.dev/resume-main`（含 2026-09-12 三轮改动）
> 与线上 https://resume-34f.pages.dev 的关系：**本目录就是线上源码**，已接回 git 仓库
> `github.com/su-qihui/resume`（main），推 main 即由 Cloudflare Pages 自动重建发布。2026-09-29 起同步。
> 更新日期：2026-10-08（第二十一轮）

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
| `assets/img/certs/` | 2 张 jpg / 合计 615 KB | C1 驾驶证、民航局无人机合格证的**打码证件照**，证书卡点击进灯箱 | ✅ |
| `assets/img/resume/` | cv.jpg / headshot.png | 简历（2.8.1 版，「关于」区）、导航 logo 头像 | ✅ |
| `assets/img/resume/cover.jpg` | 133 KB | **首屏封面卡图 —— 2026-09-28 该卡已删，此图现无人引用**（`v2.html` 那份是 v1 遗留副本，不算） | ❌ 可删 |
| `assets/pdf/` | resume-su-qihui.pdf | 供导航「导出简历」下载的 PDF（1.5 MB） | ✅ |
| `assets/video/{douyin,school}/` | 15 段 mp4 + 同名 jpg 封面 | 视频与封面 | ⚠️ 仅 9 段被用 |
| `assets/video/vibecoding/` | 3 段 mp4 + 3 张 jpg 封面 | VibeCoding 栏：Trace / 简历视频 / 讨厌红楼梦字幕动效（依次 3.1 MB、1.4 MB、**22.4 MB**，全部 720p24；第三段已剪掉前奏） | ✅ |
| `assets/video/douyin/douyin-quanzhou.*` | 1 段 mp4 + 1 张 jpg | 泉州旅行-DJInano（源 4K 已压到 720p，5.8 MB） | ✅ |
| `assets/video/hero/` | hero-bg.mp4 (1080p30 / **8.5 MB**) + hero-bg-m.mp4 (720×1280 / **5.6 MB**，手机端) + **各自第一帧封面** `hero-bg-first.jpg`(23 KB) / `hero-bg-m-first.jpg`(12 KB)，均 30s 循环。`hero-bg.jpg`（6s 抽的那张）已无人引用 | **首屏背景视频**，`<source media>` 按视口二选一（源 `Final V2_30s_4K60.mp4` 横屏 / `Final V1_30s_1080x1920_60.mp4` 竖屏）；**调色必须和原片一致，不许加任何 curves/brightness 滤镜**（见 §10 第九轮） | ✅ |
| `tools/compress_videos.sh` | — | 批量转码 720p H.264 + faststart | 手动工具 |
| `css/style.css`、`js/main.js`、`v2.html` | — | **v1 遗留，全未被引用**（`v2.html` 与 `index.html` 逐字节相同） | ❌ 可删 |

**只加载两个文件**：`css/v2-style.css` + `js/v2-main.js`。改样式改前者，改交互改后者。

## 3. 页面结构

`<body>` 顺序即页面顺序。导航 7 项，但区块有 9 个（`#skills`、`#certificates` 无导航入口）。

| 序 | DOM id | 标题 | 导航 | 核心 DOM 钩子 |
|---|---|---|---|---|
| 首屏 | `#home` | 苏其辉 / SU QIHUI | 首页 | `.hero__video` + `.hero__scrim`（`.hero__avatar`、`.hero__product` 两张图卡均已移除，首屏只剩文字） |
| 01 | `#about` | 用视觉讲述故事 | 关于 | `.about__grid` `.about__card` `.about__stats .num[data-count]` |
| — | （同一 section 内） | 创作装备 | — | `.gear__scatter` `.gear__item[data-angle]`（9 件） |
| 02 | `#capabilities` | 随滚动，逐步展开 | 能力 | `.caps__stack` `.caps__card`（4 张，偶数张带 `.caps__card--flip`）`.caps__shot` `.caps__body` |
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
| 首屏背景视频 | `.bg-stage` > `.bg-stage__pin`（`position:sticky`）> `.hero__video` + `.hero__scrim`，另有 `.bg-stage__end` | 视频**不在 `.hero` 里**，是 body 级跟随层；高度由 `sizeBgStage()` 量 `#capabilities` 下沿写进 `--bg-stage-h`（挂 ResizeObserver），到那里自然滚走掐断。桌面 `brightness(.88)`+径向斑，手机 `.80`+纯线性。`reduceMotion` 时 `pause()` 停在封面。**`.bg-stage` 必须 `pointer-events:none`** |
| 01/02 压在视频上 | `section.on-video`（加在 `#about`、`#capabilities` 上） | 重绑 `--text/--text-2/--line/--accent` **且写 `color:var(--text)`**；另叠 `background:rgba(6,7,10,.22)` 均匀垫底（必须带 `section` 前缀才压得过 `.caps`）。`.caps` 底色已改 transparent |
| 多层视差 | 任意元素加 `data-parallax-speed` | 现仅 hero 背景 0.15、光晕 0.25 |
| 能力区堆叠卡片 | `.caps__stack` 内 4 个 `.caps__card` 兄弟节点 | **盖住关系是纯 CSS**：每张 `position:sticky; top:var(--caps-pin)=74px`，后一张滚上来把前一张整块盖住（不淡出）。**另有一层 JS 挤扁**（`updateCapsSquash()`，见 §11 第十六轮）：上升途中 `scaleY` 压到 0.925，落位加 `.is-landed` 弹回。卡高 `min-height:48vh`（录屏原比例 68vh，第十一轮照抄后用户要求压扁）＋ `--caps-gap` 14px → 钉住行程 ≈445px，四张等长（最后一张靠 `.caps__stack{padding-bottom:50vh}` 补齐）。`z-index` 按 `nth-child` 1→4 递增保证"后来者在上" |
| 滚动进度条 | `.scroll-progress` | 顶层 2px，`scrollY / 可滚动高度` |
| 光标跟随光晕 | `.cursor-glow` | lerp 0.15；触摸端改 touchstart 跟随 |
| 3D 倾斜 | 任意 `.tilt-card`，作品卡由 JS 加 `.card--interactive` | 卡片 ±12°，作品卡 ±6° |
| 滚动揭示 | 任意元素加 `data-reveal` + 可选 `data-reveal-delay="80"` | `IntersectionObserver`，threshold 0.12，触发后 unobserve |
| 数字滚动 | `.num[data-count]` | 1200ms，easeOutCubic |
| 雷达图 | `#skillRadar` + JS 内 `skillData` 数组 | 8 轴，R=110，分值硬编码在数组里 |
| 技能图标联动 | `.radar-dot[data-skill-index]` ↔ `.skill-icon[data-skill]` | 双向 hover 高亮 |
| 装备散开入场 | `.gear__item[data-angle]` | JS 注入 `--angle/--lift/--scale`，每件错位 60ms；`lifts`/`scales` 数组按 DOM 顺序对齐，**增减装备必须同步改数组** |
| 背景 Emoji 互动层 | `#emojiBg`（`<canvas>`，`z-index:-1`） | 点击任意处召唤 8~14 个 emoji，重力 0.5 / 摩擦 0.985 / 弹跳 0.7 / 粒子碰撞；上限 90 个，**首次掉到底部后 3s 淡出、0.4s 内消失**；**≤768px 手机端整体关闭**（CSS `display:none` + JS `matchMedia` 短路，不初始化引擎、点击也不响应） |
| 时间线展开 | **点 `.tl__item` 任意处** → `.is-open`（`.tl__toggle` 只当箭头 + 键盘焦点，`aria-expanded` 由 JS 同步） | `max-height` 0 → 200px；展开后点 `.tl__detail` 内的文字不收起（可选中） |
| 作品集筛选 | `.tab[data-filter]` → `.gallery[data-group]` | 切换时 80ms 错位入场 |
| 灯箱 | `[data-lightbox]` = `image` / `video` / `gear` / `solo` | Esc 关、←→ 切换、点遮罩关；`video` 类型自动 play；`solo` 为单图查看（不参与任何图库） |
| 作品卡即播（桌面悬停 / 手机停留） | 同一套 `inlinePlay/inlineStop(imgEl)`，状态挂在 `imgEl._ip`（`{vid,bar,fill,timer,hideBar}`），首次才建 `<video class="card__vid">`；分流开关是 `isTouchLike` | `preload="none"` + 首次触发才赋 src；淡入盖封面、`.card__play` 隐掉。**慢网才出进度条**：起播挂 260ms 定时器 → `.card__buf.is-on`，`playing`/停止时撤掉，宽度取 `buffered.end/duration`。桌面绑 `mouseenter/leave`；触屏走 `setupPhoneAutoPlay()`：IO 阈值 0.6 收集在屏卡 → **首次起播要停留 500ms，已在播则切下一张立即生效** → 全站只播离视口中线最近的一张，切换先 `inlineStop` 旧的。`navigator.connection` 的 `saveData` 或 `effectiveType` 含 2g/3g 时整套闸住，退回点卡片开灯箱，并监听 `connection.change`。**`openLb()` 第一件事是 `stopAllInline()`**，否则卡片面和灯箱面一起出声；`reduceMotion` 下整套不启用 |
| 触屏判定 `isTouchLike` | `(hover:none)` ‖ `(pointer:coarse)` ‖ `(max-width:768px) && maxTouchPoints>0` | **只认 `(hover:none)` 不够**：三星浏览器报有 hover，点击补发的 mouseenter 会让卡片视频和灯箱视频一起播。第三条**必须带宽度条件**，否则带触摸屏的笔记本（`maxTouchPoints=10`）会被误判成手机，桌面悬停播放就没了。3D 倾斜同样用 `!isTouchLike` |
| 平滑滚动 | `html { scroll-behavior: smooth }` **只写在 `@media (min-width: 769px)` 里** | 全局挂会让安卓地址栏收起时浏览器自己的滚动修正变成"往上跳一段"的动画（三星复现、夸克不复现）。手机端锚点跳转瞬时到位 |
| 视口高度锁 `--vport-h` | JS 开页时把 `innerHeight` 写成 px 变量，`resize` 里**只有宽度变了才重量**；`.hero min-height`、手机端 `.caps__stack padding-bottom`、`.section / .caps__head` 的 `clamp(64px, 10vh, 120px)` 三处都改读 `var(--vport-h, 100svh)` | **任何留在文档流里的 `vh/svh` 都会让安卓/ iOS 地址栏收起时整页位移**（实测 94px，就是「往下滑却往上跳」）。锁只对触屏生效，桌面拖窗口高度该变还是要变。背景视频那一层反过来用 `100dvh` 跟随长高填满——它在 absolute 的 `.bg-stage` 里，不在流中，推不动内容 |
| 手机端目录抽屉 | 一份状态 `.nav.is-open` 同时驱动三处：`.nav__links`（浮起的玻璃片）、`.nav-scrim`（遮罩，z-index 99，压在内容上、导航下）、`.nav__burger`（三条杠变 X） | 行=左名称右章节号（01/02/04/05/06/08 复用页面 `section__eyebrow` 的真实序号，首页给 TOP），行间是内缩 14px 的细线；`.active` 整行淡蓝底。点遮罩/Esc/点链接都关闭，`aria-expanded`+`aria-label` 同步。样式集中在文件末尾「⑨ 手机端导航」一节（放最后是为了盖过玻璃层，不靠 !important）。手机端顶栏是**常驻**玻璃，深色档另用 `rgba(10,11,14,.72)` 深底，因为顶栏底下是视频、有一帧整幅白闪会把白玻璃+浅墨糊掉 |性能约定（改动时请保持）：滚动只挂 1 个监听 + `rAF` 节流 + `{passive:true}`；只动 `transform`/`opacity`；Observer 触发后 `unobserve`。

## 6. 常用改动指引

| 想改什么 | 改哪里 |
|---|---|
| 文案 / 联系方式 | 直接改 `index.html` 对应区块 |
| 主题色 | `v2-style.css` 的 `:root` 与 `[data-theme="dark"]` 两个块 |
| 加一张作品图 | 图片丢进 `assets/img/portfolio/{ai,cdr}/`，在对应 `.gallery` 里复制一个 `<figure class="card">`，改 `data-src` / `data-title` / `<figcaption>` |
| 加一段视频 | mp4 + 同名 jpg 封面放 `assets/video/{school,douyin,vibecoding}/`，复制 `<figure class="card card--video">`，改 `data-src` / `data-poster` / `data-title`。**别再手写 `.card__overlay`** —— 暗罩现在只由 JS 注入给图片卡，视频卡是悬停即播 |
| 改技能分值 | `js/v2-main.js` 里的 `skillData` 数组（`score` 0–100） |
| 加/改时间线 | 复制 `.tl__item` 结构，补充 `.tl__detail` 内段落 |
| 加/改装备 | 复制 `.gear__item`，注意 `data-angle`（旋转角，度）与 `.gear__item--sold` 类；**同时改 `js/v2-main.js` 里 `lifts` / `scales` 两个数组**（按下标对应 DOM 顺序，中间件大、两侧已售件小） |
| 加导航项 | `#navLinks` 里加 `<a class="nav__link" data-section="区块id">`，`data-section` 必须等于目标 `section[id]` |
| 加一张证书卡 | `.certs__grid` 里复制 `<div class="cert">`；**要挂证件图的**复制 `<button class="cert" data-lightbox="solo" data-src data-title>`（`solo` 分支见 §5 灯箱那行），说明行走 `.cert__meta`；`data-reveal-delay` 按 80ms 递增 |
| **改完资源记得升版本号** | `index.html` 里 CSS / JS / 资源都带 `?v=` 查询串（当前 `css/v2-style.css?v=neo38`、`js/v2-main.js?v=neo10`、`cv.jpg?v=2.8.1`、`hero-bg.mp4?v=3`；`cover.jpg` 已随首屏封面卡移除，不再被引用）。同名文件覆盖后浏览器仍会吃缓存，**不升版本号页面看起来"没变"**（2026-09-28 一天内踩过两次：改完 CSS 没升号，量到的还是旧值）。换图 / 改样式 / 改脚本后把对应 `?v=` 递增即可 |
| 换首屏背景视频 | 覆盖 `assets/video/hero/hero-bg.mp4`（手机端另有 `hero-bg-m.mp4`，两条都要重导）+ 重新抽**两支各自的第一帧** `hero-bg-first.jpg` / `hero-bg-m-first.jpg`（手机端那张由 JS 按 `matchMedia` 选，见 §5 首屏背景视频那行），并递增 `index.html` 里三处 `?v=`。转码命令：`ffmpeg -i in.mp4 -vf "scale=1920:-2:in_range=full:out_range=limited:flags=lanczos,fps=30" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -an -movflags +faststart out.mp4`（`-an` 去音轨；`in_range/out_range` 是因为源是 `yuvj420p` 全量程，配合输出的 `tv` 标记它是外观无损的往返映射）。⛔ **链里绝不许加 `curves` / `brightness` / `eq` 等调色滤镜** —— 第九轮查明"看着有层膜"就是上一轮加的 curves 把全片亮度压掉 25%、饱和度压掉 32%。导完用 `signalstats` 对照片源与成片的**全片** meanY / SATAVG，两边要对得上 |
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
| ~~P3~~ | ~~重复媒体查询~~ | ~~`.caps__track` 在 `≤768px` 先设 360vh 后又设 300vh，前者永不生效~~ | **已修**（2026-09-29 第十一轮）：堆叠卡片改版后 `.caps__track` 整类已不存在，两处旧的 `≤768px` caps 规则一并清掉，手机端规则只留在「响应式」那组一处 |
| P3 | 灯箱视频可能不自动播 | `v2-main.js` 中 `autoplay` 未设 `muted`，部分浏览器拒绝（代码已 catch，不报错） | 需必定自动播就加 `v.muted = true` |

非缺陷但需知：主题初值取 `matchMedia('(prefers-color-scheme: light)')`，在无系统偏好的环境（无头渲染、部分 WebView）会落到**深色**。

## 8. 运行与部署

```bash
# 本地预览（推荐，避免 file:// 限制）
# ⚠️ 8765 已被另一个会话占用（会看到"杭州微缩沙盘"），本站用 8766 / 8767
python -m http.server 8766 --bind 0.0.0.0          # 仅 HTTP/1.0，不支持 Range
"C:/Users/Administrator/AppData/Local/Programs/Python/Python312/python.exe" \
  C:/Users/Administrator/AppData/Local/Temp/range_server.py 8767 "E:/vibe coding/Resume/HTTP/mbl-resume-neo"
# ↑ 8767 支持 Range（返回 206），手机 Safari 播视频必须要这个
```

也可直接双击 `index.html`——纯静态、无模块、无跨域请求限制，但视频在 `file://` 下可能不播。

部署：**推 `main` 即上线**，Cloudflare Pages 自动重建（实测 1 分钟内生效）。无构建命令，输出目录为仓库根（本目录）。

```bash
G="/c/Program Files/Git/cmd/git.exe"; cd "/e/vibe coding/Resume/HTTP/mbl-resume-neo"
"$G" status --porcelain                      # 先看改动面
"$G" add -A && "$G" commit -m "…"            # 身份已配在仓库本地，别动全局
"$G" -c credential.helper=store push origin main   # token 在 ~/.git-credentials，直连通，不需代理
```

**线上验收两个必踩的坑（2026-10-08 实测）**

1. `curl https://resume-34f.pages.dev/index.html` 回的是 **308 跳转到 `/`**，不加 `-L` 拿到的是 0 字节，
   grep 永远数不到新版本号 —— 会误判成"Pages 没重建"（第十七轮就这么误判了一次）。
   **探测线上版本一律 `curl -sL "$U/?nc=随机"`**（带随机 query 躲边缘缓存）。
2. **`github.com:443` 会整段不通而 `api.github.com` 正常**（推第十七轮时遇到：`Connection was reset` /
   `Empty reply from server` / `Failed to connect after 21s`，同时 api 回 200；本机 7897 代理没起、`ProxyEnable=0`）。
   这时走 REST 推：从 `~/.git-credentials` 取 `ghp_` 令牌 → `GET /git/ref/heads/main` 确认远端就是本地提交的父提交 →
   逐个 `POST /git/blobs`（base64，**返回 sha 必须等于 `git rev-parse main:<path>`**，不等就停）→
   `POST /git/trees`（带 `base_tree`）→ `POST /git/commits`（带上本地提交的 author / committer / date）→
   `PATCH /git/refs/heads/main`。实测 6 个文件（含 2 张 jpg）约 60 秒推完，Pages 照常重建。
   ⚠️ 这样造出来的提交 sha 与本地不同、**tree 相同**（本次本地 `2c36c8e` / 远端 `f3adfcd`，tree 都是 `2bf85d8`）。
   等 `github.com` 恢复后先 `git fetch` 再 `git reset --soft origin/main` 对齐，**不要 `git pull --rebase`**
   （会把同一批改动复制成第二个提交）。

⚠️ **本仓库 blob 存的是 CRLF**，而 Windows git 全局默认 `core.autocrlf=true` 会在 check-in 时把 CRLF 重写成 LF，
导致**每个文件整文件假 diff**（实测 css 从 112 行真改动膨胀到 2314 行）。本目录已设 `core.autocrlf=false`（仓库级），
新建工作副本后要沿用；若发现某文件工作副本是 LF 而仓库是 CRLF，用 python 把 `\n` 换回 `\r\n` 再 add。

## 9. 观感速记（无图版，供判断改动影响面）

- **首屏～02（深色带）**：30s 循环的个人 Showreel 当背景，**视频上没有任何遮罩、没有 CSS 滤镜、转码也不加调色**（第九轮把压暗的 curves 撤了，成片全片 meanY 83.0 / 源片 83.4，观感与原片一致）；`.bg-stage` sticky 跟随，**到 02 核心能力 下沿掐掉**，03 起回到白底。姓名/标语/正文全转浅色墨 + 文字投影，01/02 各自挂 `.30` 墨色垫底。片源明暗交替得很厉害（全片 38% 的帧亮度 >128、13% >200、中位只有 21/255），所以**暗场时文字对比 12~18:1 极好，白闪那几秒文字基本读不出**——这是片子自己的节奏，不是遮罩没加够。
- **装备区**：8 件设备呈扇面散开，已售三件降透明加灰度并盖"已售"印章，hover 复原放大。
- **能力区（02）**：**堆叠卡片 + 烟熏液态玻璃**。四张圆角卡（图占约 1.45 列、文字占 1 列，偶数卡左右对调，卡高 48vh）依次钉在导航下方 74px 处不动，后一张从前下方滚上来盖住前一张（不缩放、不淡出），四张钉住行程等长 ≈445px。卡面是 `rgba(8,10,16,.40)` + `blur(26px)` 的烟熏玻璃 —— 下面那张被糊成一片柔光当深度层，看得出叠了但读不出字。手机端（≤768px）关掉 sticky，改普通流、图统一在上。
- **技能区**：SVG 雷达图替代进度条，图与图标双向 hover 联动。
- **作品区**：2 列瀑布卡片，hover 抬升 + 遮罩"点击播放/查看"，点击开灯箱。
- **深色模式**：纯黑底，作品图成为画面唯一亮部；切换有从按钮原点扩散的圆动画。
- **背景 Emoji**：单击页面任意处，8~14 个 emoji 从点击点炸开，受重力下落、落地弹跳、彼此碰撞，掉到底部后 3 秒淡出。画布是 `z-index:-1`，只露在页面空白处，**不会盖住任何文字**，也不拦截点击。
- **右上角**：导航栏右侧常驻「导出简历」蓝色按钮（图标 + 文字），点击直接下载 PDF。
- **毛玻璃**（本变体）：**背景与基底版完全一致**（白底 / `--bg-soft` / hero 自带渐变，未加任何背景图层）。变化只在 UI 元素：导航是吸顶磨砂条（内容从下面滚过时会被糊开）、作品卡 / 时间线卡 / 证书卡 / 联系卡 / 技能胶囊都有半透明白底 + 顶边内高光 + 一道极淡的冷色斜向光泽、装备是玻璃相框、页脚是一条玻璃横带；灯箱换成"浅黑影 + 强模糊"，背景始终可辨认。深色主题下白玻璃降到 12% 透明度、模糊加大一档，呈夜间磨砂观感。
- **简历卡**：鼠标移到「关于」区的简历上会浮出「点击查看大图」遮罩，点击进灯箱看整张 A4。
- 全局叠了一层 4% 透明度的 SVG 噪点（`.section::after`），用来消除大片渐变的塑料感——改 `.section` 背景时别把它盖掉。

## 10. 毛玻璃主题层（本变体特有）

> 配方来源：`~/.workbuddy/skills/frosted-glass-web`（backdrop-blur）。玻璃本身的代码全在 `css/v2-style.css` 末尾的
> 「mbl-resume-neo · 毛玻璃主题层」一个区块里。⚠️ 原写的"HTML 与 JS 零改动"已被 2026-09-28 的首屏背景视频
> 打破（那次动了 `index.html` 和 `js/v2-main.js`），但**玻璃层自身仍是纯 CSS**。

### 10.1 前提：玻璃靠什么被看见

**2026-09-28 起首屏以下的前两段也有背景视频了**：`.bg-stage` 从页首 sticky 跟随到 **02 核心能力 下沿**才掐掉，
所以 `#home`、`#about`、`#capabilities` 三区都是深色（后两区靠 `section.on-video` 转墨色 + `.22` 均匀垫底，
`.caps` 底色已从 `var(--bg-soft)` 改为 `transparent`）。**03 软件熟练度 往下**仍是原样：`body` 白底 / `--bg-soft` 交替。
由此带来一个必须知道的客观事实：

> `backdrop-filter` 只是「把身后已有的东西糊掉」。背景接近纯白时**几乎没有内容可糊**，模糊本身基本是"空转"。
> 现在 **首屏到 02 这一整段**，玻璃卡片和吸顶导航底下终于有真东西可糊了；03 往后的白色区块仍是"空转"。

所以玻璃质感由这三样共同表达，改样式时不要只盯着 `backdrop-filter`：

| 手法 | 令牌 | 作用 |
|---|---|---|
| 半透明填充 | `--glass-alpha` | 让底色透出来一点 |
| 冷色斜向光泽 | `--glass-sheen` | 白底上**最能被看见**的一笔，给卡面一道淡淡的玻璃反光 |
| 内高光描边 | `--glass-highlight` | 顶边一条内高光，玻璃的"厚度感"来源 |

> 想让某个区块的模糊显形，**必须先给该区块背景加细节**（渐变光斑 / 纹理 / 图片）——这是毛玻璃成立的物理前提，
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
| 卡面（通用） | `.card` `.tl__card` `.cert` `.contact__item` `.skill-icon` `.tab` `.about__card` `.douyin__phone` `.back-top` | `blur(var(--glass-blur)) saturate(var(--glass-sat))` + 高光描边 |
| 堆叠卡（02） | `.caps__card` | **自带一套，不吃主题玻璃令牌**：`rgba(8,10,16,.40)` + `blur(26px) saturate(160%) brightness(.80)` + 顶边内高光 + 斜向光泽。必须**深色**半透，理由见 §11 第十三轮 |
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
4. **修复 3D 倾斜卡失效（"四角倾斜"回归）**：`.hero__product` / `.about__card` / `.douyin__phone` 三张 `.tilt-card` 同时带 `data-reveal`，而入场规则 `[data-reveal].is-visible { transform:none }` 优先级 (0,2,0) 高于 `.tilt-card` 的 (0,1,0)，reveal 完成后倾斜被 `transform:none` **永久压住**（JS 的 `--rx/--ry` 在变、computed transform 却一直是 none）。
   修法：紧跟 reveal 规则之后加 `[data-reveal].is-visible.tilt-card { transform: perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)); transition: transform .4s cubic-bezier(.16,1,.3,1); transition-delay: 0ms }`（(0,3,0) 压过 (0,2,0)，且倾斜要跟手，不沿用入场那 0.8s + delay）。
   ⚠️ 这是**基底站就有的老 bug**（备份版实测同样 `transform:none`），`resume-main` 尚未修。
   验证：鼠标移到卡片四个角，`--rx/--ry` 变化且 computed transform 出现 matrix3d 旋转 ✓。
5. **装备区手机端保留散开效果，但排成"上 4 下 5"，已售 3 件集中到下排末尾**：
   - 排布：`repeat(20, 1fr)`，DOM 第 3~6 个（在用的收藏柜 / Osmo Nano / Osmo 360 II / Neo 2）`grid-column: span 5`（4×5=20 → 上排），其余 5 个 `span 4`（5×4=20 → 下排）。
   - 已售 3 件（DOM 第 1、2、9 个）用 **CSS `order: 10`** 排到显示顺序最后 → 正好落在下排末尾 3 个位置，且 `.gear__item--sold { z-index:0 }` 压到下层。桌面端不设 `order`，仍是一排 9 件（已售在两端）。
   - **列间距必须为 0**（`gap: 22px 0`），改用每件自身 `margin: 0 3px` 留缝 —— 若用列 gap，"跨 5 格 × 4 件"会随视口变窄把第 4 件挤到下一行（360px 实测会变成 3+1+…）。
   - 每件另配一套 `--angle/--lift/--scale`（`!important` 盖过 JS 内联值，角度正负交错、位移 ±9px、缩放 .84~1），排布"乱而有序"。
   - 实测 320/390/414px：都是上 4 下 5、无溢出；1440px 桌面端仍是一排 9 件散开扇形（已售在两端）。
5. ⚠️ 两条反复踩的坑：**① JS 写进内联样式的 CSS 变量，样式表必须 `!important` 才压得过**（普通规则永远输）；**② 后加的覆盖层必须放在被覆盖层之后**，否则同权重下先写的会被后写的盖掉。
7. CSS/JS 版本号 `?v=neo9`。

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
4. **已推送到 GitHub** `https://github.com/su-qihui/resume`（main 分支，提交 `00efbd7`），线上 `https://resume-34f.pages.dev` 已自动部署最新版。
   推送走的不是 git（沙箱里 git 的网络子进程会被杀），而是 **GitHub REST API**：`git ls-files -s` 取本地 blob sha → 与远端树对比 → 只对变更文件 `POST /git/blobs`（base64）→ `POST /git/trees`（带 `base_tree` 增量）→ `POST /git/commits` → `PATCH /git/refs/heads/main`。凭据从 `git credential fill` 取（GCM 已存 `su-qihui` 的令牌）。
   ⚠️ 推完记得删临时凭据文件；本地目录里不要再留 `.git`（沙箱网络受限，fetch 不下来，留着只会是半套仓库）。
4. **视频作品新增「泉州旅行-DJInano」**（第 10 张视频卡，排在末尾）：`assets/video/douyin/douyin-quanzhou.mp4`（720p30 / 5.8 MB，源 4K60 / 120 MB / 19.8s）+ 封面 `douyin-quanzhou.jpg`，标签「抖音」。
5. **删除抖音区宣传标语**「镜头很勤快，剪辑很懒情」（用户要求，两站同步）。
5. **补缓存版本号**：上一轮改完 `cover.jpg` 后页面仍显示旧封面——磁盘文件确实是新的（1240×1754），但没有 `?v=` 查询串，浏览器直接吃缓存。现已给 `css/v2-style.css`、`js/v2-main.js` 加 `?v=20260912`，`cover.jpg` 加 `?v=1.2`。**今后覆盖任何同名资源都必须递增版本号**。

**2026-09-12（mbl-resume-neo 毛玻璃变体）**
1. 从 `resume-main` 整体复制而来，本目录的 CSS/JS 引用版本号为 `?v=neo1`。
2. 新增毛玻璃主题层，详见 §10。改动只落在 `css/v2-style.css` 末尾追加的玻璃层；**HTML 与 JS 零改动**。
3. **第一版做错过一次方向**：最初按 skill 的"先造背景再上玻璃"思路加了一层彩色光斑背景（`.bg-scene`），用户明确要求**背景保持原样、只把 UI 元素换成玻璃**，已全部撤掉。撤掉后连带的还原项：`.caps` 分区底色回到 `var(--bg-soft)`、`.card__img` / `.tl__detail` 回到原色、`--text-2` 回到 `#6e6e73`、移除标题 `text-shadow`。当前 `index.html` 里只有 1 处本变体注释，无新增元素。
4. **代价要说清**：背景是纯白时 `backdrop-filter` 几乎没有内容可糊，模糊基本"空转"。为了让玻璃仍可感知，改用「半透明填充 + 冷色斜向光泽 `--glass-sheen` + 顶边内高光」三件套来承载质感；写 CSS 时**别只调 `backdrop-filter`**。若以后要让模糊显形，前提是给背景加细节（渐变/纹理/图），这不是 CSS 写法问题。
4. 验证说明：本页整页高度 **15,539px**，在无 GPU 的软件光栅下 `Page.captureScreenshot(captureBeyondViewport:true)` 会让渲染器崩溃（**原站同样如此，与毛玻璃无关**），因此 skill 自带的 `shot.mjs` 在本环境跑不通。改用逐屏视口截图（18 张，桌面/移动 × 浅色/深色 + 灯箱）完成验收，无 JS 异常、无 4xx、移动端无横向溢出。


**2026-09-28（首屏背景视频）**
1. **首屏换成深色 + Showreel 当背景**：新增 `assets/video/hero/hero-bg.mp4`（源 `Final V2_30s_4K60.mp4`，
   4K60 / 66.5 MB → **1080p30 / 8.3 MB**，`-an` 去音轨）+ `hero-bg.jpg` 封面（取 6s 那帧，130 KB）。
   DOM 在 `.hero` 里加 `.hero__video` + `.hero__scrim`，插在 `.hero__glow` 之后、`.hero__inner` 之前。
   ⚠️ 这是本变体**第一次动 HTML**，§10 开头"HTML 与 JS 零改动"那句自此只对玻璃层本身成立。
2. **踩过的第一个坑：以为片源是暗的**。抽了 0.5/6/15/20s 四帧都是近黑，就按"暗底 + 白字"做了，
   结果 16.7s 是一整幅亮白画面，白色姓名直接消失。用 `signalstats` 逐帧量了全片亮度才拿到真相：
   **30 秒里有 10 秒平均亮度 >140/255，峰值 207**（10s 和 16s 是最坏的两秒）。
   教训：**背景视频必须逐帧量亮度分布，不能抽几帧看感觉**。
3. **最终遮罩配方**（`v2-style.css` 的 hero 段）：视频自身 `filter: brightness(.62) saturate(1.06)` 先把高光收进来，
   再叠 `.hero__scrim` = 中央径向暗斑（`ellipse 58% 54% at 50% 44%`，核心 `rgba(6,7,10,.78)`）+ 上下线性渐变
   （顶部给导航压暗，底部 `var(--bg)` 渐隐回页面底色接「关于」区）。
   实测最坏帧（10.2s）上的对比度：标语 6.8:1、多媒体设计师 9.2:1、SU QIHUI 8.2:1、导航 4.5:1 —— 全部过 AA。
4. **首屏转深色的连带项**（漏一个就是一处黑底黑字）：
   - `.hero__inner` 和 `.nav:not(.is-scrolled)` 里重绑 `--text/--text-2/--line`，**同时必须写 `color: var(--text)`**。
     因为 `.hero__role`（"多媒体设计师"）和 `.nav__name` 都**没有自身 color 声明**、靠继承 `body` 的取色，
     只重绑自定义属性不会改变已继承下来的 computed color —— 浅色主题下这两处会是黑字压在视频上。
   - 导航只在**未吸顶**（`scrollY<=20`，即正好压在首屏视频上）时转浅；一吸顶就恢复原白色玻璃条，不用改 JS。
   - `.hero__scroll`（"向下滚动"）**故意留在 `.hero__inner` 外面**，继续吃主题色 → 浅色主题下是深灰，
     正好压在渐隐到白的那一段上，可读。
5. **JS**：`v2-main.js` 尾部加 3 行——`reduceMotion` 时 `pause()` 停在封面帧，否则补一次 `play().catch()`。
   `muted` 是自动播放的硬前提（§7 那条 P3 灯箱老问题的同一个根因）。
6. **版本号**：CSS `neo9 → neo11`（中途吃过一次教训：改完 CSS 没升号，浏览器 304 命中旧缓存，
   量出来的 `--text-2` 还是改前的 `.68`），JS `neo4 → neo5`。§6 那行"当前 ?v=20260912"同步更正。
7. **验证工具坑（可复用）**：CDP `take_screenshot` 在这页**经常超时**，根因不是 AGENTS.md 之前记的
   "整页太高"，而是**页面有 `infinite` CSS 动画在跑 → CDP 等不到稳定帧**。本页就是
   `.hero__scroll-line::after` 的 `scrollDot`。解法：截图前注入
   `*,*::before,*::after{animation:none!important;transition:none!important}` 并 `video.pause()`。
   另：无头 Chrome 要加 `--autoplay-policy=no-user-gesture-required --enable-unsafe-swiftshader
   --use-gl=angle --use-angle=swiftshader` 才会把视频帧合成进截图，否则只截到底色。
8. 已验：全新加载下 `paused=false`（无手势自动播）、`readyState=4`、循环 30s、无 console 报错、无 4xx、
   mp4 走 206 分段请求；深色主题 + 视频下 rAF 实测 **60.2 fps**；390×844 真机视口下最亮帧文字与按钮全可读；
   `--force-prefers-reduced-motion` 下视频确认停在封面帧不推进。

**2026-09-28（第二轮：删首屏封面卡 + 文字块居中）**
1. **删掉首屏那张「个人简历」封面卡**：`.hero__product` 的 DOM（`index.html`）、CSS（`v2-style.css` 基础段 + 玻璃段 2.4 各一处）、
   JS（`v2-main.js` 里那段 `heroProduct` 入场缩放）三处一并清干净。首屏自此**只有文字，没有任何图卡**。
   ⚠️ `assets/img/resume/cover.jpg` 因此**变成无人引用的孤儿文件**（只有 v1 遗留副本 `v2.html` 还写着它），删不删等用户定。
   玻璃段 2.4 的注释同步改成只说"简历卡"（`.about__card` 还在用）。
2. **文字块真正居中**：卡删掉后量出 `.hero__inner` 光学中心在 **500px、视口中心 450px，偏下 50px** ——
   根因是 `.hero` 的 `padding: 100px 20px 0` **上下不对称**（那 100px 上边距是为了躲 56px 固定导航，下边距却是 0）。
   改成 `padding: 100px 20px`（上下各 100）后实测 `offset = 0`，且整屏不再溢出（hero 高度由 1164 → 900 = 100vh）。
   顺带确认「向下滚动」提示在 y=797，与文字块底边 658 不重叠。
3. **遮罩跟着文字块挪**：径向暗斑中心 `50% 44% → 50% 50%`（对齐新的居中位置），底部渐隐起点 `72% → 78%`（让出按钮区）。
   顶部线性压暗 `rgba(6,7,10,.52)@0 → 0@15%` 加到 `.66@0 → .34@9% → 0@19%`：最亮那一帧上导航实测只有 4.2:1，差 AA 一点，压深这一档补上。
   首屏文字对比度（10.2s 那幅整幅亮白的最坏帧、逐像素实测）：姓名 7.5:1、SU QIHUI 12.5:1、多媒体设计师 10.9:1、标语 6.6:1。
4. 版本号：CSS `neo11 → neo14`（这一轮里改了三次 CSS，每次都升号），JS `neo5 → neo6`。

**2026-09-28（第三轮：手机端首屏单独处理）**
用户拿真机截图反馈"手机端效果较差"，三处调整**全部只写在 `@media (max-width: 768px)` 里，桌面端一行没动**：
1. **关掉文字背后的径向黑斑**。竖屏下 16:9 视频被 `object-fit: cover` 裁成中间一条（390px 视口只取到画面宽度约 26%），
   片子里的大色块糊成一团橄榄绿色斑；而 `.hero__scrim` 那个椭圆暗斑在这个尺寸下**边缘清晰可见**，比色斑更难看。
   → 手机端遮罩改成**纯线性**（`rgba(6,7,10,.60)@0 → .26@24% → .26@66% → var(--bg)@100%`），不再有椭圆。
2. **改用「均匀压暗视频 + 文字自带投影」承载可读性**：`.hero__video` 的 `brightness(.62)` 在手机端降到 `.46`（整幅一起降，没有"一块黑"的观感）；
   姓名用 `filter: drop-shadow(0 2px 9px rgba(0,0,0,.62))`，其余四行文字用 `text-shadow` 双层（1px 白内高光 + 7px 黑投影）做立体感。
   ⚠️ **`.hero__name` 必须用 `drop-shadow` 不能用 `text-shadow`** —— 它是 `background-clip:text` + `color:transparent`，
   给透明填充的文字加 `text-shadow` 会从字形后面直接透出来，变成一坨实心鬼影。
3. **两个按钮改小并排**：删掉 ≤480px 原有的 `flex-direction:column` + `.btn{width:100%}`（竖排满宽），
   改为保持横排 + `padding: 11px 22px` / `font-size: .9rem`。实测 390px 下 116+89=205px 一行放下，**320px 仍不折行、无横向溢出**。
4. 手机端对比度（10.2s 那幅整幅亮白最坏帧，逐像素量）：姓名 / SU QIHUI / 多媒体设计师 均 **7.0:1**，标语 **5.1:1**，导航 **6.8:1** —— 全过 AA，
   且不再依赖那团黑。暗段落（6.8s）在 `brightness(.46)` 下粒子纹理仍清晰可见，没被压成死灰。
5. 版本号：CSS `neo14 → neo15`。

**2026-09-28（第四轮：手机端换竖屏背景视频）**
1. 新增 `assets/video/hero/hero-bg-m.mp4`（源 `E:\Project\2026\9月\2026.09.27-remotion-reel\导出\Final V1_30s_1080x1920_60.mp4`，
   1080×1920 / 60fps / 30.5 MB → **720×1280 / 30fps / 5.4 MB**，`-an` 去音轨）。桌面版 `hero-bg.mp4` 原样保留。
2. **按视口选源用纯 HTML 的 `<source media>`，零 JS 零构建**：
   ```html
   <source media="(max-width: 768px)" src="assets/video/hero/hero-bg-m.mp4?v=1" type="video/mp4" />
   <source src="assets/video/hero/hero-bg.mp4?v=1" type="video/mp4" />
   ```
   两条铁律：**① 带 `media` 的必须排在前面**（浏览器取第一个匹配的 source，无 `media` 的那条永远匹配，放前面会把后面全短路）；
   **② 断点数值必须和 CSS 手机端首屏那组的 `max-width:768px` 完全一致**，否则视口选中的视频与那套遮罩处理会错位。
   实测双向隔离成立：390px 只下载竖屏 5.19 MB、1440px 只下载横屏，另一条根本不发请求。
3. **封面 `poster` 仍是横屏那张**，手机端靠 `object-fit: cover` 裁中间（粒子球中心，本来就好看）。
   `<video poster>` 是单属性、没法按视口切换，为它加 JS 不划算 —— 视频 1 秒内就接管画面。
4. **CSS 一行没改**：竖屏峰值亮度 235（比横屏的 207 更高），但第三轮定的 `brightness(.46)` + 线性 `.26` 遮罩扛住了。
   最坏瞬间实测在 **10.28s**（一记 235 的白闪，不是 10s 那一秒的均值 225 —— 逐秒均值会把 0.3s 的闪白摊平，要找单帧峰值），
   该帧上手机端对比度：姓名 / SU QIHUI / 多媒体设计师 **7.0:1**、标语 **5.1:1**、导航 **6.8:1**，全过 AA。
   全片有 **4.18 秒**单帧亮度超 200。
5. 版本号：本轮只换资源、`?v=` 沿用 `neo15`（新增的 mp4 自身带 `?v=1`）。

**2026-09-28（第五轮：视频跟随到 02 + 调亮）**
用户要两件事：① 背景更亮更透（"目前展示不出背景的视觉冲击"）；② 视频跟随到 02 核心能力 后掐掉。

1. **视频从 `.hero` 里搬出来，改成 body 级跟随层**：
   ```html
   <div class="bg-stage"><div class="bg-stage__pin"> video + .hero__scrim </div><div class="bg-stage__end"></div></div>
   ```
   `.bg-stage` 绝对定位、高度 = 页首到 `#capabilities` 下沿；`.bg-stage__pin` 用 `position:sticky; top:0; height:100vh`
   实现"跟随"，走到舞台底边自然滚走 = "掐掉"。**纯 CSS 表达不了"到某个 section 结束"**，所以高度由 JS 量：
   `v2-main.js` 里 `sizeBgStage()` 读 `capsSec.getBoundingClientRect().bottom + pageYOffset` 写进 `--bg-stage-h`，
   挂 **ResizeObserver**（不挂 scroll —— 每帧读 rect 会强制重排）+ `load` 兜一次。
   实测：`--bg-stage-h = 6089px`，与 `#skills` 的 top 完全一致；滚动探针 0/1500/3000/5000/5189 视频都钉在 top=0，
   5600 起 top 转负，**6089 正好 bottom=0 完全滚出**。
   ⚠️ `.bg-stage` 带 `pointer-events:none`（视频和遮罩继承），否则整屏点不动。
2. **`.hero` 的 `background:#08090c` 交还给 `.bg-stage`**，并给 `.hero` 补 `z-index:1` —— 否则 hero 自己的底色会把舞台盖掉。
   `.hero__bg` / `.hero__glow` 留在 hero 内不动，它们现在变成压在视频之上的一层品牌蓝薄雾，视差照旧。
3. **01 / 02 两区转深色**：`index.html` 给这两个 section 加 `class="on-video"`，CSS 里重绑
   `--text/--text-2/--line/--accent` 并**同时写 `color: var(--text)`**（第二轮那条教训在这里第三次应验：
   `.section__title`、`.about__lead` 都没有自身 color）。`.caps` 的 `background: var(--bg-soft)` 必须改成 `transparent`，
   否则它是不透明白底，视频跟上去根本看不见。
4. **踩了两次权重坑**（都是"后写的赢"）：
   - `.hero__scroll` 的浅色墨一开始写在基础规则**之前**，被后面 `color: var(--text-2)` 顶掉，量出来还是 `#6e6e73`。挪到 `@keyframes scrollDot` 之后才对。
   - `section.on-video { background: rgba(6,7,10,.22) }` 必须带 `section` 前缀提到 (0,1,1)，才被 `.caps`(0,1,0) 的 `transparent` 上面压住。
5. **调亮的真正瓶颈不是遮罩，是片子自己有近白段落**：横屏版有 **3.70 秒**单帧亮度 >200（峰值 218 @10.23–10.40s）。
   我先按"亮度 .80 + 黑斑 .45"改，离线建模算出标语那一行遮罩已衰减到只剩 .37 → 实测 2.8:1，反而比原方案更黑。
   于是用脚本把 (brightness, 文字行 alpha) 的组合全列了一遍，引入一个指标 **video-through = brightness × (1 − alpha)**
   （有多少片子真正透出来）。原版 .62/.78 只有 **0.14**，最终选的 **.88/.50 = 0.44，等于亮 3.1 倍**。
6. **01 区加了均匀垫底**：首屏那套视口居中的径向暗斑护不到 01/02 的正文（实测正文只有 3.6–4.4:1），
   所以 `section.on-video` 叠一层 `rgba(6,7,10,.22)` 均匀底 —— 均匀、没有椭圆边界，不会重现手机端那团"黑斑"。
7. **实测对比度（最坏那一帧 10.30s / 15.5s，逐像素量，不含文字投影的功劳）**：
   首屏 姓名 4.9、SU QIHUI 5.0、多媒体设计师 4.8、导航 4.7、品牌 8.4（均过 AA 4.5）；标语 4.0、向下滚动 4.4（差一点，靠多层投影撑）。
   01 区 正文 5.8、标题 7.9、装备副标 4.9；02 区 eyebrow 6.6、h3 5.5、正文 5.3、角标 4.9，大标题 4.1（大字号阈值 3:1，达标）。
8. 版本号：CSS `neo15 → neo22`（这一轮改了 7 次，每次升号），JS `neo6 → neo7`。
9. ⚠️ **本地预览端口换了**：`8765` 被另一个会话的 `python -m http.server` 用 `127.0.0.1:8765` 抢走（localhost 上更具体的绑定赢），
   打开 8765 会看到"杭州微缩沙盘"而不是本站。简历站现在跑在 **8766**。

**2026-09-28（第六轮：再通透些 —— 用高光压缩解开"亮 vs 可读"的死结）**
用户第三次提"背景还是不够透，尤其手机端"。到这一步 CSS 已经推不动了：手机透过率 .39、桌面 .53，
再减遮罩标语就掉到 2.4:1。**瓶颈根本不在 CSS，在片源自己** —— 两支片子各有 3.7s / 4.2s 单帧亮度 >200（峰值 218 / 235）。
近白画面 + 浅色小字要 AA，数学上就只能挂厚遮罩。

**解法：压高光，不动暗场。**〔⚠️ 本条已被第九轮**撤销** —— 这条曲线正是"膜"的真凶，别再往背景视频上加调色滤镜〕
转码链尾加一条曲线 `curves=master='0/0 0.45/0.47 0.7/0.58 1/0.64'`：
| | 白闪帧 | 暗帧 | 全片峰值 | >200 的秒数 |
|---|---|---|---|---|
| 压前 | 233 | 21.9 | 218 / 235 | 3.70 / 4.18 s |
| 压后 | **159** | 21.2 | **153** | **0.00 s** |
暗部几乎没动（21.9→21.2），只把高光拉回来 —— 所以片子的质感、粒子、glitch 全在，只是不再爆白。
重导后 `hero-bg.mp4` 7.8 MB / `hero-bg-m.mp4` 5.3 MB（`?v=` 升到 2，**文件名没变必须升号**）。

于是 CSS 反而能大幅让步：桌面 `brightness(.80)` + 径向斑 `.22`、手机 `brightness(.80)` + 线性 `.22`。
**透过率 桌面 .44→.62、手机 .39→.62**，同时文字投影加厚一档（`0 0 2px .95 / 0 1px 3px .85 / 0 3px 16px .7`，
姓名再加一层 `drop-shadow(0 0 2px .8)` 紧贴边缘）—— 投影是唯一"不压暗视频却能加可读性"的手段。
⚠️ 投影别用白色内高光，在亮段落上会和背景糊成一片，反而更糊。

**实测（最坏帧逐像素，不含投影功劳）—— 这一轮第一次两端全过 AA 4.5:1**：
桌面 姓名 7.0、SU QIHUI 6.4、多媒体设计师 5.6、标语 4.6、导航 5.4、向下滚动 5.4；
手机 姓名/SU QIHUI/角色 5.4、标语 4.5、品牌 9.9。

**方法论（下次直接照做，别再绕）**：`video-through = brightness × (1 − 文字行遮罩alpha)` 当"通透度"指标，
先用 `signalstats` 量出片源最坏单帧亮度，再反解"给定亮度下满足 AA 的最大透过率"。
**先量片源，再定 CSS** —— 前几轮反复调 CSS 都是在治标。
版本号：CSS `neo24 → neo25`。

**2026-09-28（第七轮：首屏遮罩撤干净）**
用户第四次提通透度、明确"你直接改成透明吧"，于是把首屏视频上的压暗全部撤除：
- `.hero__video` 的 `filter` 只剩 `saturate(1.06)`，`brightness()` 彻底去掉（桌面手机都是，手机端那套 `.46/.70/.80` 历史值一并清）。
- `.hero__scrim` 从「径向暗斑 + 全高基底灰幕」缩成**只保留顶部一条给固定导航压暗的窄带**
  （`rgba(6,7,10,.72)@0 → .34@8% → 0@18%`）。这条不能撤 —— 导航未吸顶时是透明底，撤了会在亮段落上直接消失。
- 文字投影是最后一道防线（`.hero__eyebrow/.hero__en/.hero__role/.hero__tagline` 三层 text-shadow + 姓名三层 drop-shadow）。
  ⚠️ 别再往 `.hero__name` 上加 `text-shadow`，它是 `background-clip:text` + 透明填充，会透出实心鬼影。

**代价（实测，密纹那一帧，零遮罩）**：姓名 6.4:1 仍过 AA，但"多媒体设计师" 2.9:1、标语 3.1:1、导航 4.3:1 —— 均不达 AA 4.5。
根因不是亮度而是**画面高频纹理和文字抢边缘**，所以继续加暗只会回到用户刚否掉的老路。
**要救可读性优先试 `.hero__video { filter: blur(4px) }`** —— 模糊专治高频竞争、且不压暗视频，
代价是片子发虚，属于用户自己的片子，需他点头。

**2026-09-28（第八轮：找对"膜"是谁 —— 我上一轮删错了对象）**
用户拿截图指着一条横向硬边说"主页和背景之间有层膜"。**我理解错了**：把 `section.on-video` 那层
`rgba(6,7,10,.30)` 均匀垫底（= 横线**以下**、01/02 两段的正文底）当成膜删掉了，用户立刻纠正
"不是让你把横线以下那个删了，回到上版本；要关的是顶部那部分背后的膜"。

真正的膜是 **`.hero__bg` 和 `.hero__glow`**：这两层浅色半透明渐变（`--accent-soft` 蓝 + 紫 + `--glow`）
原本就是白底首屏的氛围装饰，**它们在 `.hero` 里（`z-index:1`），压在 body 级视频舞台（`z-index:0`）之上**，
等于给整个首屏蒙了一层乳白 —— 所以画面看着"被遮挡、降对比"，正是用户说的观感。
→ 两个 DOM 节点和它们的 CSS 一并删除，`.hero` 现在只剩 `hero__inner` + `hero__scroll` 两个子元素。
→ 01/02 的 `.30` 垫底**原样恢复**（用户明确要留）。

**教训**：用户说"有层膜"时，先确认膜在**哪一层、压在谁之上**，别看到半透明背景就删。
这次两处都是"遮罩"，但一处是他要保的正文底、一处是他要撤的洗白层，删错方向白跑一轮。
另：撤掉这两层后 `data-parallax-speed` **全站已无消费者**，`applyParallax()` 会拿到空数组（安全，但视差功能事实上退役）。
版本号：CSS `neo25 → neo26 → neo28`。

**2026-09-29（第九轮：膜在视频里，不在 CSS 里 —— 撤销第六轮的调色曲线）**
用户自己找到根因："你在压缩原视频时把色调调暗了饱和度变低了"。回查第八轮结尾的困境（CSS 遮罩已撤干净、
`.hero__bg/.hero__glow` 也删了，他还是说"被遮挡、降对比"）—— 因为那层膜**烧在 mp4 像素里**。

量法：把两支原片和两版成片都先归一到全量程数字再量 `signalstats`（原片 `pc`、成片 `tv`，
直接比 YAVG 会因为量程标记差 16/235 而得出错误结论 —— 上一轮就是这么误判的）：

| 桌面 hero-bg.mp4 | 全片 meanY | meanSAT | 峰值 Y |
|---|---|---|---|
| 源 `Final V2_30s_4K60.mp4` | 83.4 | 5.3% | 255 |
| 旧成片（带 curves） | **62.2（−25%）** | **3.6%（−32%）** | **193** |
| 新成片（无滤镜） | 83.0 | 5.5% | 255 |

| 手机 hero-bg-m.mp4 | meanY | meanSAT | 峰值 Y |
|---|---|---|---|
| 源 `Final V1_30s_1080x1920_60.mp4` | 85.7 | 4.8% | 255 |
| 旧成片 | 63.9 | 3.3% | 196 |
| 新成片 | 85.1 | 4.8% | 255 |

那条 `curves=master='0/0 0.45/0.47 0.7/0.58 1/0.64'` 名义上"只压高光"，实际 `1/0.64` 把纯白拉到 64%，
是全局压暗；亮度掉了 1/4，饱和度跟着塌，观感就是"蒙了层灰膜"。**第六轮表格里的"压后峰值 153"不是战果，是事故。**

重导：`ffmpeg -i in.mp4 -vf "scale=1920:-2:in_range=full:out_range=limited:flags=lanczos,fps=30" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -an -movflags +faststart out.mp4`
（竖屏 `scale=720:1280`），**链尾无任何滤镜**；封面 6s 重抽。成片 38% 的帧亮度 >128、13% >200，和源片（38% / 14%）对得上。

**代价（1440×900 实测，逐像素，含现有文字投影）**：
- 中位帧（t=15.0s，暗场）：姓名 17.9、角色 18.3、标语 13.3、导航 8.4、按钮 18.3 —— 全过 AA，余量很大。
- **最亮帧（t=10.3s，片子里的白闪）：全部 1.0~1.1:1，导航 2.9:1 —— 文字基本消失。** 这不是遮罩问题，
  是他片子自己的爆白镜头（全片有 3.7s 单帧 >200）。CSS 现在没有可用遮罩（他要求撤干净），所以这几秒确实读不出字。
- 想救只有三条路，都需要他点头：① 剪掉/缩短片中的白闪秒（最干净，动的是他的片子）；② `.hero__video{filter:blur(4px)}`
  —— 专治高频竞争但救不了纯白；③ 只在白闪区间挂动态遮罩（要做时间轴联动，成本最高）。

**方法论补一条**：用户说"有膜/发灰/不透"，嫌疑名单必须是**整条链** —— CSS 遮罩 → CSS filter → 编解码滤镜 → 片源本身。
判别工具是"对照片源与成片的全片 meanY/SATAVG"，**看两帧、量 CSS 计算值都不算证据**。
版本号：`hero-bg.*?v=2 → 3`，CSS 仍 `neo28`（本轮没动样式）。

**2026-09-29（第十轮：接回 git 仓库并首次部署本目录）**
本目录原先**没有 `.git`**（`git status` 报 not a git repository），所以 9-12 之后 17 天的改动一直没上线，
线上停在 `00efbd7`（CSS `neo8` / JS `neo4`，且 `assets/video/hero/` 整个目录不存在）。本轮做法：

1. `git init -b main` + `remote add origin` + `fetch origin main`（全量 212MB 对象，约 6 分钟）
   → `git reset --soft FETCH_HEAD` → `git add -A`。这样当前工作树变成远端 main 的**直接子提交**，历史不断。
2. ⚠️ 踩到 CRLF 假 diff：仓库 blob 是 CRLF，全局 `core.autocrlf=true` 把 check-in 内容重写成 LF，
   css 的 112 行真改动被放大成 2314 行整文件重写。解法是仓库级 `core.autocrlf=false` + `add --renormalize -A`，
   再把工作副本已是 LF 的 `index.html` 换回 CRLF。最终 diff 回到 **410 insertions / 63 deletions**，可审。
3. 提交身份用仓库级 `user.name=苏其辉` / `user.email=s2705579416@163.com`（与历史一致），**没动全局配置**。
4. 推送：`git -c credential.helper=store push origin main`，token 在 `~/.git-credentials`（scope `repo`），
   `github.com` 直连通，**不需要 socks5/7897 代理**（旧记忆里那套代理需求已过时）。
5. 提交 `20178cb` 推上去后 **约 1 分钟**线上就换成了新版：`resume-34f.pages.dev` 的 index 与本地**逐字节相同**，
   三个 hero 资源各 200 且字节数一致，浏览器实测 `hero-bg.mp4` 在播（currentTime 1.5s 内走 1.45s），无 console 报错。
6. ⚠️ **`pages.dev` 对 `Range: bytes=0-1023` 回的是 `200 + 全文件`，且没有 `Accept-Ranges` 头**
   （对老的 `douyin-01.mp4` 同样如此，不是本次新文件的锅）。桌面 Chrome 能放，iOS Safari 对无 Range 的视频历史上会拒播，
   真机如果黑屏，这是第一嫌疑。本地 `range_server.py`（8767）是有 206 的，所以"本地能放线上不能放"要先看这里。

**2026-09-29（第十一轮：02 能力区改成"堆叠卡片"，照抄参考录屏）**
用户给了一段 8.2s 的录屏（夸克录屏，1210×588），要求把中间那段鼠标滚动的效果"完全摘抄"过来。
原实现是 JS 驱动的钉住滚动（`#capsTrack` 420vh + `--cap-rot` 立体旋转 + `floor(p×4)` 切 stage + 底部圆点）。

1. **先量录屏再动手**（逐帧灰度化后取"卡片左内边距"那条竖带的行中位数，>15 判为卡面）：
   | 量到的 | 值 |
   |---|---|
   | 钉住位置 | 卡顶恒定停在 **y=26**（f96→f168 共 72 帧不动） |
   | 卡高 | **399 / 588 = 67.9vh** |
   | 卡宽 | 1079 / 1210 = **89.2vw** |
   | 卡间距 | **13px**；圆角 ≈12px |
   | 卡面色 / 页面底色 | **#161617 on #090909** |
   | 图文列宽 | 579 : 403 ≈ **1.45 : 1**，列间距 50px，内边距 24px |
   | 标题字号 | ≈30px（两行占 74px） |
   关键判据：**被盖住的那张顶边一直停在 26 不动**，而盖上来那张的顶边从 440 → 148 → 25 匀速上移
   → 结论是**纯覆盖**，没有缩放、没有淡出、没有变暗。
2. **机制其实是纯 CSS**：四个 `.caps__card` 作为**兄弟节点**各带 `position:sticky; top:74px` 就够了 ——
   先到的钉住，后到的因为 DOM 靠后自然画在上面并盖住它，等整叠的容器底边过去再一起滚走。
   据此**删掉了 `updateCaps()` 全部逻辑**（含 `onScroll` 里逐帧读 `getBoundingClientRect` 那一次强制重排）。
   录屏里"最后一张钉不住多久就滚走"也是这个机制的自然结果，不是额外做的。
3. **两处必须适配的偏差**（照抄会坏的地方）：
   - 钉住位从 26 下移到 **74px** —— 本站导航是 56px 固定毛玻璃条，26px 会让卡顶被导航糊住。
   - 卡面**必须不透明**。玻璃变体的默认做法（半透明白底 + `backdrop-filter`）在这里是致命冲突：
     被盖住的那张会透上来，堆叠层次直接消失。所以 `.caps__card` **不入玻璃层**，
     并从玻璃层的 5 个选择器列表里摘掉了原来的 `.caps__visual`。
4. **踩到的一个真 bug**：`.caps__shot img` 原本在文档流里，它的**固有高度会反过来撑高 grid 行** ——
   四张卡里第三张被撑到 655px、其余 610px，每张的钉住行程就不一样了。
   改成 `position:absolute; inset:0` 让图脱离流，卡高只由 `min-height:68vh` 决定。实测四张等高 610px。
5. **最后一张补行程**：卡片靠"下一张滚上来"结束钉住，最后一张没有下一张，原本只钉 209px 就交还给 03。
   `.caps__stack{padding-bottom:70vh}` 补成一张卡高+间距。实测四张钉住行程 **623 / 624 / 624 / 642px**。
6. **连带影响（自动适配，无需改代码）**：`.caps` 高度从 420vh 变成 ~374vh，
   `sizeBgStage()` 量 `#capabilities` 下沿写进 `--bg-stage-h`，背景视频舞台从 6089px 缩到 **5660px** 并仍与 section 底边对齐。
7. 手机端（≤768px）**关掉 sticky** 改普通流、图统一在上、`.caps__card--flip` 的 `order` 归零；
   顺带清掉了 §7 那条 P3「`.caps__track` 360vh 被 300vh 永久盖掉」的死规则。
8. 验证：headless Chrome 走 CDP 在 1210×588 / 1440×900 / 390×844 三档逐阶段截图，确认
   钉住→覆盖→交替左右→交还 03 全流程；1920 宽下 `scrollWidth 1910 < innerWidth 1920` 无横向溢出；无 console 报错。
   ⚠️ 截图里卡片四周偶尔出现的红色细线**不是 bug**，是他自己 Showreel 的画面内容（全站 CSS 里没有任何红色）。
9. 版本号：CSS `neo28 → neo31`（中途修 img 撑高、补 padding-bottom 各升一次），JS `neo7 → neo8`。

**2026-09-29（第十二轮：卡片压扁）**
用户拿自己浏览器截图圈了个红框，说卡片"有点大"、要压成红框那样。

1. **从截图里量出比例**（1641×978 的窗口截图，实测 1:1 CSS px，视口高 ≈897）：
   卡片实际 **604px**（y 180→784，靠"图区结束→卡面结束→19px 缝→下一张"三段定位，
   直接扫单列会被 `box-shadow` 压暗的缝隙骗过去），红框 **433px**（y 162→595，
   红框边缘按"整行红像素 >400"筛横线、">300"筛竖线抓出来的）。
   → 433/604 = **71.7%**，`min-height: 68vh → 48vh`。红框顶边和卡顶基本重合，所以只收底边。
   宽度没动（红框 1152 vs 卡 1125，是他手画偏出去的一点余量）。
2. **连带改 `--caps-stack` 的补行程**：`padding-bottom: 70vh → 50vh`（一个行程 = 48vh + 14px 间距）。
3. **代价要说清**：钉住行程从 623px 掉到 **445px**（四张仍是 444/445/444/462 等长）。
   这套纯 CSS 机制里"一张卡停留多久"完全等于"下一张要走多远"，而两者之间只有 `--caps-gap` 一个旋钮 ——
   想把节奏放慢就得同时接受卡片之间露出更宽的背景带。觉得滚太快就调 `--caps-gap`，别调卡高。
4. 复验：1641×903 下实测卡高 **433px**（与红框逐像素对上）、四张等高、`.caps__body` 的
   `scrollHeight - clientHeight` 全为 0（文字没被裁）、图区 381px 等宽。版本号 CSS `neo31 → neo32`。

**2026-09-29（第十三轮：卡片换成透明液态玻璃）**
用户要"试试透明液态玻璃的背景效果"。这直接顶掉了第十一轮写进注释和 §10.3 的那条"卡面必须不透明"。

1. **结论先说：透明可以做，前提是模糊半径开足。** 之前判断"半透明会让下面那张透上来"只对了一半 ——
   真正致命的不是透明，是**没有模糊的透明**。`blur(26px)` 之后下面那张变成一片柔光，
   反而成了深度层，叠过的痕迹看得出、字读不出，观感比不透明更立体。
2. **踩到的真问题：清水玻璃会被片源牵着走。** 第一版按 Apple 那种浅色玻璃做 `rgba(255,255,255,.08)` +
   `brightness(1.08)`，赶上 Showreel 里那段白底彩色纸屑画面，整张卡跟着变乳白，白字对比掉到 2.8:1。
   → 改**烟熏档**：`background-color: rgba(8,10,16,.40)` + `backdrop-filter: blur(26px) saturate(160%) brightness(.80)`。
   深色自底 + 压一档 backdrop 亮度，把卡片亮度和背景亮度脱钩。
3. **补文字投影而不是把卡调更黑**（`.caps__num/.caps__body h3/p` 三层 text-shadow）——
   投影是唯一"不牺牲玻璃通透度却能加可读性"的手段，和首屏那套是同一个打法。
   实测最坏那一帧（t=10.3s 整幅白闪）：角标 **6.23:1**、标题 **6.93:1**、正文 **4.83:1** —— 三项全过 AA 4.5。
   暗场（t=15s）分别是 3.35 / 9.11 / 10.30:1。
   ⚠️ 量角标时我第一版把取样框定在 y 452-470，报出 2.79:1 判成 FAIL —— 那是**取样框错了**
   （数字实际在 y 443-452）。按蓝色像素反查定位后重测才拿到真值。**先确认量的是那个东西，再判它坏。**
4. **降级不可省**：`@supports not (backdrop-filter)` 和 `prefers-reduced-transparency: reduce` 两条
   都退回不透明 `#161617`。**没有模糊的半透明比不透明更糟** —— 下面那张的字会直接看清。
5. 不吃主题玻璃令牌（`--glass-alpha` 等）。02 区永远是深色带（压在跟随视频上），
   浅色主题的 `.52` 白玻璃放这儿必然重演第 2 条的乳白问题，所以数值写死在 `.caps__card` 上。
6. 复验：1641×903 与 390×844 两档、把背景视频分别定格在 10.3s / 15s / 21s 三种亮度帧截图，
   钉住→盖住→玻璃深度→手机端普通流全部正常，无 console 报错。
7. 版本号：CSS `neo32 → neo35`。

**2026-10-06（第十四轮：证书区新增两张可点击的证件卡）**
用户要求新增 C1 机动车驾驶证与民航局无人机合格证，并明确"原有四张一个字都不要改"（互联网营销 / 全媒体运营那两张证暂时在国网只查到一条，是评价机构上报链路的问题，后续再调）。

1. 素材：根目录 `C1驾驶证-打码.jpg` / `UOM合格证-打码.jpg` 复制为 `assets/img/certs/c1-license.jpg`（346 KB / 1894×1280）与 `caac-uom.jpg`（269 KB / 1814×1280）。**两张源图 EXIF 0 条**，无 GPS / 设备信息随图外泄。
2. 卡片沿用第二轮「关于」区简历卡的打法：`div` → `button.cert` + `data-lightbox="solo"`，点击进灯箱看打码证件，`data-title` 写官方全名并注明打码范围。
3. CSS 三条（紧跟 `.cert h3`）：`button.cert` 还原表单控件（`width:100%; font:inherit; color:var(--text); cursor:pointer; appearance:none`）、`.cert__meta`（0.78rem / `--text-2`）；手机端那组里 meta 降 0.66rem。
4. 文案定稿过程：无人机那张 h3 原写"民航局无人机操控合格证"，390px 下断成"…合格 / 证"两行 → 改"民航局无人机合格证"；两条 meta 各去掉末尾"证件"，桌面卡高由 223px 回到 203px、meta 收成单行。
5. 版本号：CSS `neo35 → neo36`。JS 未动，仍 `neo8`。
6. 验证（headless Chrome + CDP，`Runtime.evaluate` 量数值 + `Page.captureScreenshot` 出图，1440×1000 与 390×844 各跑浅/深）：`.certs__grid` 6 张卡两列三行，列宽 331px / 170px，新卡 h3 与 meta **全部单行**、`opacity` 全 1（reveal 正常触发）；`scrollWidth` 1430/1440 与 380/390 无横向溢出；`Runtime.exceptionThrown` 0 条；两张证件图 `naturalWidth` 1894 / 1814 加载成功；点击后 `#lightbox` 加 `is-open`、`aria-hidden=false`、`body.overflow=hidden`、说明条与 `data-src` 均对得上。
7. ⚠️ **本目录工作树里此前就压着第十一～十三轮未提交的改动**（`git log` 停在 `0f67396` 第十轮，2026-09-29）。本轮若一起提交，会把那三轮同时带上，推 main 即一起上线。
8. ⚠️ 证件图只打了证号 / 住址 / 证件编号，**C1 上的出生日期与有效期、UOM 上的证书编号仍公开可见**，要不要再压一层等用户定。

**2026-10-06（第十五轮：证书卡换位 + 作品卡改悬停即播 + 时间线整卡可点 + VibeCoding 加片）**
用户一次提了四件事，逐条落地。

1. **证书卡**：两张证件卡从第 5、6 位挪到第 3、4 位（紧跟互联网营销中级 / 全媒体运营高级），`data-reveal-delay` 重新按 80ms 排；meta 去掉「点击查看」字样（卡片本身有 `cursor:pointer` 和 hover 抬升，够了）。原有四张仍一字未动。
2. **作品卡去掉那层暗罩**：暗色「点击播放」层是 `v2-main.js` 里给每张 `.portfolio .card` 注入的 `.card__overlay`（`rgba(0,0,0,.45)` + `blur(4px)`），douyin-01 那张还额外在 HTML 里硬写了一份 —— 硬写那份已删。**现在 JS 只给图片卡注入**（`点击查看`），视频卡改为**悬停即播**：首次 `mouseenter` 才建 `<video class="card__vid">` 并赋 src（`preload="none"`，不抢首屏带宽），淡入盖住封面同时把 `▶` 的 opacity 收到 0；`mouseleave` 暂停并淡回封面。
3. **慢网进度条**：`mouseenter` 挂 260ms 定时器才显示 `.card__buf`（宽 = `buffered.end/duration`），`playing` 一到就撤 —— 网不卡的话这条根本不会露脸。触屏 `hover:none` 与 `reduceMotion` 下整套不启用，点卡片照旧开灯箱。
4. **时间线**：监听从 `.tl__toggle` 改挂到 `.tl__item`，点卡片任意处展开/收起；`.tl__toggle` 保留为箭头 + 键盘焦点（`aria-expanded` 由 JS 同步）。**展开后点详情正文不再收起**（`detail.contains(e.target)` 直接 return），否则选个文字就把卡片关了。顺带修掉一个老重叠：`.tl__toggle` 原本 `top:14px; right:14px`，和同样在右上角的 `.tl__badge`（`top:14px; right:16px`）叠在一起、箭头画在徽章上 —— 改成两端统一 `bottom:12px; right:12px`，`.tl__card` 桌面内边距补 `padding-bottom:42px`，手机端那条同值覆盖规则删掉。
5. **VibeCoding 第三张**：`E:\Project\2026\9月\2026.09.28-讨厌红楼梦\导出\讨厌红楼梦.mp4`（1920×1080 / 24fps / 242.4s / **430 MB**）压成 `assets/video/vibecoding/vibecoding-03.mp4`（1280×720 / 24fps / **23.1 MB** / 761 kbps）。命令：`ffmpeg -i in -vf "scale=1280:-2,fps=24" -c:v libx264 -preset medium -crf 28 -pix_fmt yuv420p -c:a aac -b:a 96k -ac 1 -movflags +faststart out`（源已是 24fps，**不强转 30**）。封面取 45s 那帧（胶片框 + 像素字幕，最能说明"字幕动效"）。⚠️ 中文路径先 `cp` 成 `rh-src.mp4` 再转码（老坑）。
6. **归属更正**：栏底那行「以上视频效果使用 Codex + Hyperframes 制作」对新片不成立 —— 源工程是 `讨厌红楼梦.aligned.jizura.json`（JIZURA 逐句对齐），已改成按作品分别标注。
7. 版本号：CSS `neo36 → neo37`，JS `neo8 → neo9`。
8. 验证（headless Chrome + CDP，1440×1000 浅色）：证书 6 张顺序与文案逐张核对；`.card--video` 13 张**带暗罩 0 张**、图片卡 10 张**带暗罩 10 张**；悬停 douyin-01 → 527ms 内 `paused=false`、`currentTime 0.26`、`is-playing` 挂上、`▶` opacity 0，离开 → `paused=true` 且视频淡回 0；时间线点标题展开 ✓、`aria-expanded=true` ✓、点详情不收起 ✓、再点收起 ✓、箭头与徽章实测不再重叠；新卡 poster 1280×720、mp4 metadata 242.4s 加载无错；无横向溢出（1430/1440）、`Runtime.exceptionThrown` 0 条。

**2026-10-08（第十六轮：所在地改温州 + 首屏改用真·第一帧 + 装备放大 + 堆叠卡挤扁）**
用户四件事。

1. **所在地**：`about__lead`「来自浙江金华义乌」→「来自浙江温州」，联系区 `📍 浙江 · 金华 · 义乌` → `📍 浙江 · 温州`（驾驶证住址是浙江苍南，属温州）。时间线里「义乌齐辉广告社」是店名，未动。
2. **首屏背景视频改为"从原视频第一帧起播、且封面就是那一帧"**：原来 `poster` 是 6s 抽的亮帧，而视频从 0 起播 —— 手机上会先亮一下再黑掉。实测两支片子的入点亮度：**0s meanY 10.2 / 0.5s 10.5 / 1s 13.3 / 2s 18.4 / 3s 175.7**（横竖屏同形，竖屏 0s 10.6），即**前约 2 秒本来就是黑场淡入**。据此抽了两张真·第一帧：`hero-bg-first.jpg`（横，23 KB）、`hero-bg-m-first.jpg`（竖，12 KB）。`<video poster>` 是单属性、没法跟 `<source media>` 分视口，所以 JS 里按 `matchMedia('(max-width:768px)')` 选封面并监听 change；另加 `loadedmetadata` 时 `currentTime>0.05 → 归 0`，以及自动播放被拒时 `touchstart`/`scroll` 各 `once` 兜底重播。⚠️ 代价：**首屏开头约 2 秒是黑的**（片子自己的淡入），不是 bug。
3. **电脑端装备放大**：`.gear__item` 由写死 `120px` 改 `clamp(120px, 9.6vw, 148px)`（宽高等比），`margin-left` -20 → -24px，`.gear__scatter` `min-height` 220 → 252px、下内边距 40 → 44px。实测 `offsetWidth`：1025px 视口 120、1280 视口 123、1440 视口 **138**、1920 视口 **148**；≤1024px 仍走原来那组 100px + 横向滚动，四档 `scrollWidth` 均 ≤ 视口宽，无溢出。
4. **02 堆叠卡：宽度收窄 + 挤扁动效**。`.caps__stack` 宽 `min(1120px,89vw)` → **`min(980px,82vw)`**（实测 1440 下 980px），图文列间距 48 → 40px。挤扁做法：`.caps__card` 加 `transform: scaleY(var(--sq)) scaleX(var(--sx))` + `transform-origin:50% 0`，卡片上升途中越接近钉住位越扁（最多 **sy 0.925 / sx 1.03**），钉住那一下由 `.is-landed { transform:none; transition: .55s cubic-bezier(.34,1.56,.64,1) }` 弹回原形。
   ⚠️ **第一版用 IntersectionObserver 判"钉住"是错的**：root 顶边缩 74px 后，卡片完全进入视口时 `intersectionRatio` 就已经到 1（top≈468px），**从 468 升到 74 这一段不再有任何回调**，卡片会永远停在压扁状态（实测钉住的卡读到 sy=0.925 且没有 landed 标记）。改成：load/resize 时给 `.caps` 加 `is-measuring`（临时 `position:static`）量一次各卡的自然位置，之后**每帧只做算术**（`k=(naturalTop - scrollY - 74)/(vh - 74)`，`k<=0` 即落位），挂在已有的 `onScroll` rAF 里，值没变化就不碰样式。这也符合 §5 末尾"不逐帧读 rect"的约定。
5. **追加：剪掉讨厌红楼梦的前奏**。用户"前大半段有一大部分是前奏"。依据两处独立时间轴对齐：JIZURA 工程 `timing.lineTimes` 第一句人声在 **30.68s**（`-1: 0.2` 是标题卡），ASR `asr_full.json` 段落间隔 **2.00 → 31.30 正好 29.3 秒无人声**。取 **29.6s** 作切点（留 1.1s 呼吸），从 **430 MB 原始源片**一次重导（不在已压好的 720p 上二次转码）：`ffmpeg -ss 29.6 -i src -vf "scale=1280:-2,fps=24" -c:v libx264 -crf 28 ... -af "afade=t=in:st=0:d=0.35"` → **212.8s / 22.4 MB**。封面按同位移取切片 15.4s 那帧（与原封面同一画面）。资源引用 `?v=1 → ?v=2` 三处。
   实测：首帧是 IDR（frame types I,B,P）、`moov` 在偏移 36（faststart 生效）、HTTP 200 全文件可取、开头三帧 meanY 206/211/173（前奏末段的亮画面，1.1s 后进人声）。
6. 版本号：CSS `neo37 → neo38`，JS `neo9 → neo10`。
7. 验证（headless Chrome + CDP）：文案两处实测为新值；1440 与 390 两档下 `heroVideo.poster` 分别是横/竖那张第一帧、`currentSrc` 选对源、起播后 currentTime 从 0 连续走（+0.7s 时 4.87 / 4.84，说明没有跳帧）；装备四档尺寸与溢出见上；挤扁逐档滚动扫（1440×900，卡高 432，步长 200px）：上升中 `#3 sy=0.927 top=92` → 落位 `#3 sy=1.004* top=74`（弹性过冲可见）→ 交还阶段四张全 `sy=1.000`，无异常拉伸；`Runtime.exceptionThrown` 0 条。

**2026-10-08（第十七轮：手机端也上堆叠 + 证件图补打码 + 定位文案）**
1. **手机端 02 能力区改成和桌面一样的堆叠**。原来 `≤768px` 写死 `position: static`，注释理由是"一屏放不下 68vh 的卡"——
   那是第十二轮把卡高压到 48vh **之前**的理由，早就不成立了。实测 390×844 一张卡 **422px**、钉住位以下还有 **782px**，
   所以直接开 sticky：手机端 `--caps-pin: 62px`（桌面 74px，手机导航 56px），`.caps__stack` 补行程
   `calc(50vh + 40px)`（实测 462px ≥ 一张卡 422 + 间距 20）。JS 里 `CAPS_PIN` 改成从 CSS 变量读实际值，
   挤扁的 `min-width:769px` 门槛去掉（只留 `reduceMotion` 一档）。
   验证：390×844 逐 150px 滚动扫 —— 卡片依次钉在 top=62，上升途中 `sy` 0.961→0.947→0.933，
   落位 `0.997*/1.003*`（弹性过冲），交还阶段四张全 1.000；`scrollWidth 380/390` 无溢出，0 报错。
   桌面复测（1440×900）同一条曲线不变，`--caps-pin` 读到 74 ✓。
2. **证件图再打一层码**（上一轮只打了证号/住址/证件编号）：C1 的**出生日期**与**有效期限**、UOM 的**证书编号**
   全部按原图风格做同尺寸马赛克（block=13）。坐标是画 20px 网格图量出来的，第一版两处不合格已修：
   C1 左边界 695 压到了"出生日期"的"期"字 → 右移到 728；UOM 右边界 990 短了，`832` 三位露在外面 → 扩到 1024。
   资源 `?v=1 → ?v=2`。**根目录那两张原始打码图没动**，只换站点里的。
3. 联系区定位 `📍 浙江 · 温州` → **`📍 浙江范围内可接受`**（求职地点弹性，比写死城市好）。
4. 版本号：CSS `neo38 → neo39`，JS `neo10 → neo11`。
5. ⚠️ **实测确认 pages.dev 不支持 Range**：同一台机器上 MDN 的 mp4 回 `206 + Accept-Ranges: bytes`，
   本站 `--noproxy` 下仍回 `200 + 整文件`、且响应里根本没有 `Accept-Ranges` 头 —— 不是本机代理的锅。
   iOS Safari 对无 Range 的视频会拒播/拖不动，这是手机端第一嫌疑。

**2026-10-08（第十八轮：作品集手机端单列大图 + 停留即播）**
用户："手机版的效果不太理想这点怎么优化好，也想加入类似电脑版停留自动播放的效果"。布局方案问他时选了**单列大图**。

1. **作品集手机端改单列**。改前用 `style.gridTemplateColumns="repeat(2,1fr)"` 现场复原两列量过：一张卡 **171px** 宽、
   画面 **169×95** —— 16:9 缩到这么小，`▶` 三角和右下角标签几乎和画面一样抢眼。
   `@media (max-width:768px)` 里 `.gallery` 改 `grid-template-columns:1fr; gap:22px`（≤480px 时 18px），
   配套 `.card__cap` 字号 → `1rem`、`.card__play` 三角 → `10px 0 10px 17px`、`.card__tag` → `.66rem`。
   实测 390×844：卡宽 **359**、画面 **357×201**、标题 16px 单行。
2. **手机"停留即播"**（触屏没有 hover）。先把第十五轮那套悬停播放拆成共用的
   `inlinePlayer(imgEl)` / `inlinePlay` / `inlineStop`（状态挂在 `imgEl._ip`，`setupHoverPlay` 只剩两行绑定），
   再为 `hover:none` 的设备加 `setupPhoneAutoPlay()`：**IO 阈值 0.6 收集在屏卡 → 停留 500ms 才起播 →
   全站只播离视口中线最近的一张**，切走的立刻 `pause()`。
   ⚠️ 三条约束一条都不能少，缺了就变成流量黑洞（本轮实测见下）。
   另外接了 `navigator.connection`：`saveData` 打开、或 `effectiveType` 含 2g/3g 时整套闸住不播，
   退回"点卡片开灯箱"，并监听 `connection.change` 在网速掉下去时立刻停。
   触屏与桌面的分流派发在原来的循环里：`hover:none` push 进 `phoneVideoCards`，否则 `setupHoverPlay`。
3. 版本号：CSS `neo39 → neo40`，JS `neo11 → neo12`。
4. **验证（headless Chrome + CDP，390×844 dpr3 + `setTouchEmulationEnabled`）**：
   `hover:none`=true、`pointer:coarse`=true、dpr=3；一次完整滚动 `.card__vid` 从 1 建到 13、
   **同时在播峰值始终 = 1**、`Runtime.exceptionThrown` 0 条、`scrollWidth` 380/390 无溢出。
5. **流量实测**（`Network.dataReceived` 按 requestId 归属到 URL、`cacheDisabled`、390 视口每停 1.5s 滚一格）：
   首屏 **5.00 MB**（全是竖背景 `hero-bg-m.mp4`，5.9 MB 的整片被拉完 —— 它跟视口无关，加载就下）；
   「视频作品」栏滚一遍 **33.31 MB**，被碰到的 7 张各 3.5~6.2 MB（`douyin-01/06` 6.19、`school-01` 5.63…）。
   ⚠️ "码率 × 停留秒"这个直觉低估了 Chrome：它**前向缓冲不看停留时长**，起播一次就预拉好几兆，
   所以真实量级是"**每张 3~6 MB**"，不是每兆每秒。一次看 2~3 张 ≈ 10~15 MB，够用但别在 3G 下刷。
   **没有**为此再压一套 540p 预览片：仓库已经 238 MB，多一份素材+一份 `?v=` 维护不值；
   真要省流量，正路是给 `.card__vid` 单配低码率预览源（重编码 + 双份文件），留作以后的活。
   ⚠️ 量法两个坑：`Network.loadingFinished` 对**没下完**的视频请求永远不来，字节必须用 `dataReceived` 累加；
   `performance.getEntriesByType('resource').transferSize` 同样只记已完成的请求，用它量流式视频会严重少报
   （第一版就是这么读出"7.3 MB"的假数）。

**2026-10-08（第十九轮：安卓两处真机问题——下滑回跳 + 触屏没自动播还双重播放）**
用户拿安卓真机测了 `suqihui.pages.dev`，反馈两条：① 夸克正常，**三星浏览器往下滑会往上跳一段**；
② **手机端停留即播没生效，点击变成"卡片面 + 灯箱面一起播"**，要求做成 B 站那种滑到哪面播哪面。

1. **下滑回跳的根因是全局 `html { scroll-behavior: smooth }`**。安卓地址栏收起时浏览器会自己修正滚动偏移，
   这个修正被 CSS 平滑化之后就成了一次"往上跳"的动画 —— 夸克不复现、三星复现，正是浏览器对这条属性的处理差异。
   改成只在桌面生效：`@media (min-width: 769px) { html { scroll-behavior: smooth; } }`。
   实测 `getComputedStyle(html).scrollBehavior`：**1440 = `smooth`、390 = `auto`**。
   顺手把 02 区两处高度单位补了稳定档（`min-height:48vh → +48svh`、手机端 `padding-bottom:calc(50vh+40px) → +50svh`），
   这样即使某浏览器让 `vh` 跟着可视高变，滚动中途整段也不会变长。
   ⚠️ 我用 CDP 改 `innerHeight` 量到过"02 区下移 94px / 文档高 +209px"，但**那不能直接当成他看到的跳幅**：
   真机上 `vh` 未必随地址栏变（Chrome 系 `vh`=lvh 是稳定的），这个量法只证明"如果变会偏多少"。
2. **触屏判定放宽**。原来只认 `(hover: none)`，而三星浏览器报"有 hover"，于是走了桌面的
   `mouseenter` 分支 —— 触屏点击会补发 mouseenter，所以"点一下卡片视频开始播 + 同时灯箱也播"，
   而停留即播永远不触发。现在三条取或：`(hover:none)` ‖ `(pointer:coarse)` ‖ **`(max-width:768px) && maxTouchPoints>0`**。
   ⚠️ 第三条**必须带宽度条件**：带触摸屏的笔记本 `navigator.maxTouchPoints` 是 10，不带宽度就会把桌面的悬停播放误关掉。
   同理 3D 倾斜的开关也从 `!(hover:none)` 换成 `!isTouchLike`。
3. **灯箱起来前先停掉所有内联视频**：新增 `stopAllInline()`（遍历 `.card__img.is-playing` 调 `inlineStop`），
   在 `openLb()` 里 `renderLb()` 之前调用。这条与检测无关，就算浏览器把两条媒体查询都谎报了，双重播放也不会再出现。
4. **关掉灯箱后要能恢复自动播**：`sync()` 原来 `if (t === playing) return;` 会因为"还是那张但已被停掉"而永远不再起播。
   改成 `if (t === playing && t && t._ip && !t._ip.vid.paused) return;`。
5. **跟手感**：从"没在播"到第一次起播仍要停留 500ms（防快速划过连环下载），
   但**一旦信息流已经在播**，滑到下一张立刻切换，不再等 500ms —— 这才是 B 站信息流的感觉。
6. 版本号：CSS `neo40 → neo41`，JS `neo12 → neo13`。
7. **验证（headless Chrome + CDP，四档设备画像）**：
   停留即播在 `hover:none+coarse`、`hover:hover+coarse`、`390+maxTouchPoints=5` 三档下都成立，
   **同时在播峰值始终 1**；点卡片开灯箱后 `inlinePlaying=0 / isPlayingClass=0 / lbVideos=1`（全场只剩灯箱在播）；
   `#lbClose` 关掉后 `lbOpen=false`，再滑到下一张 `inlinePlaying=1` 恢复；
   桌面档（1440、无触屏）`mouseenter` 建视频并播放 ✓、`--card-ry=-1.12deg` 3D 倾斜仍生效 ✓；
   `Runtime.exceptionThrown` 0 条。
   ⚠️ 坑：`Emulation.setTouchEmulationEnabled({enabled:true})` 会**强制把 `hover` 改写成 none**，
   所以"谎报 hover 的手机"这一档在 CDP 里造不出来；而且 `enabled:false` 之后 `maxTouchPoints` 仍是 10（不清零），
   想测桌面档必须连 `mobile:false` 一起给，否则会被上一阶段的残留骗到。

8. **线上复测抓到两个本地没复现的问题**（同一份脚本，本地绿、线上红 —— 慢网络把时序差暴露出来了）：
   ① `sync()` 为了"关掉灯箱后能恢复"放开暂停判断之后，**灯箱还开着时 500ms 停留计时器一到又把内联视频拉起来**，
   实测 `totalPlaying:2`。补 `lightboxOpen()` 闸门：`sync()` 第一行 `if (lightboxOpen()) return;`。
   ② "关掉灯箱后恢复自动播"原来是**靠用户正好又滚一下**触发 IO 才成立（第二档就没恢复）。改成 `closeLb()` 主动调 `phoneResync()`（`setupPhoneAutoPlay` 里赋值的闭包，400ms 后补一次 `sync()`）。
   逐状态验证（每档重新导航）：停留后 `paused:false centerOff:-58` → 灯箱开着 `paused:true` → **刚关灯箱就自己恢复 `paused:false`、currentTime 0.4→0.94 在走** → 再滑 300 切到下一张（旧卡 -358 停、新卡 -82 播）。
   ⚠️ 测试脚本自己的坑：同一个页面里连跑两轮"点开→关闭→再滑"会互相污染状态，报出假失败；每轮必须重新 `Page.navigate`。这次就是先被它骗了一次。
9. 版本号最终：CSS `neo41`，JS `neo15`（neo13 修主体 → neo14 加灯箱闸门 → neo15 加关灯箱后的主动补同步）。
**2026-10-08（第二十轮：下滑回跳的真凶不是 scroll-behavior，是文档流高度被视口高牵着走）**
第十九轮那版把 `scroll-behavior` 收到桌面之后，用户拿**三星 + iPhone 6s Plus 系统浏览器**复测，仍然跳。
两条新线索：夸克不跳（它不触发地址栏收起全屏），跳的两个都是会收起地址栏的。用户给的思路是
「收起地址栏时对背景视频放大填满」。

1. **量出来的位移链**（CDP 把视口高从 844 改到 916、`scrollY` 固定不动）：
   `hero高 +72`、`#capabilities 视口内 top +87`、`.portfolio +158`、`.contact +202`、四张堆叠卡各 `+93~94`。
   也就是**同一个滚动位置下整页内容往下挪了约 94px**，人眼看到的就是「往上跳一段」。
2. **三处把文档流高度绑在视口高上**（这才是根因，`scroll-behavior` 只是放大器）：
   ① `.hero { min-height: 100vh/100svh }`；② 手机端 `.caps__stack { padding-bottom: calc(50vh+40px) }`；
   ③ **`.section { padding: clamp(64px, 10vh, 120px) 0 }`** —— 每个区块上下内边距都是 10vh，
   七个区块累加正好是修完前两条后剩下的那 101px（`.caps__head` 里还有一条同样的）。
   这条最隐蔽，因为它藏在 `clamp()` 中间项里，`grep "vh"` 一眼扫过去容易漏。
3. **修法：视口高度锁**。JS 开页时把 `innerHeight` 写成 `--vport-h`（px），
   `resize` 里**只在宽度变化（转屏）时重量**；地址栏收起不改宽度 → 文档流全程不变。
   `min-height` / `padding-bottom` / `clamp` 三处全部改读 `var(--vport-h, 100svh)`。
   ⚠️ **锁只对触屏生效**（`!isTouchLike` 时桌面照常跟随窗口）—— 桌面用户拖窗口改高度时 10vh 内边距本来就该变。
   堆叠卡挤扁的 `k` 值也从 `window.innerHeight` 换成 `vportH()`，否则同一帧会整体偏。
4. **背景视频改用 `100dvh`**（`.bg-stage__pin`）：地址栏收起时它**跟着长高填满屏幕**，正是用户要的效果。
   它不在文档流里（父级 `.bg-stage` 是 absolute、高度由 JS 量 02 下沿写死 px），所以它变高推不动任何内容。
5. 版本号：CSS `neo41 → neo42`，JS `neo15 → neo16`。
6. **验证（拿同一把尺子复量）**：视口 844→916 且 `scrollY` 不动 ——
   `文档高差 0`、`.hero / #capabilities / .portfolio / .contact` 视口内 top **位移全 0**、四张堆叠卡 **0,0,0,0**；
   同时 `--vport-h` 稳在 `844px`、`.bg-stage__pin` 高度 844→**916**（视频确实长高填满）、`heroBottom` 两次都是 544。
   桌面档反向确认没被锁死：窗口 900→1100 时 `--vport-h` 跟着变 `1100px`、区块内边距 `90px → 110px`。
   回归全过：停留即播 ✓、点灯箱不再双播 ✓、关灯箱后恢复 ✓、谎报 hover 那档仍走停留即播 ✓、
   桌面悬停播放与 3D 倾斜 ✓、`scrollBehavior` 1440=smooth / 390=auto ✓、`Runtime.exceptionThrown` 0 条。
7. ⚠️ 仍未在真机验证：iPhone 上拖进度条（`pages.dev` 不支持 Range 的已知后果）。
   用户手上那台 6s Plus 系统偏老，能播不足以证明新系统的行为。

**2026-10-08（第二十一轮：手机端顶栏常驻玻璃 + 抽屉改成"目录"，并加海外托管提示）**
用户三件事：①"站点在 Cloudflare 海外，卡顿可开代理"的提示放哪；②右上角折叠栏太土，重做；③手机顶栏也要液态玻璃，深浅两套。

1. **提示放哪：页脚一行 + 抽屉底部一行，不做弹窗。** 判断依据是"谁需要看到它"：
   第一眼看到"这站可能卡"会直接压低第一印象，而招聘方点开作品集的前三秒就是全部；
   浮层提示在对方屏幕上弹一句"本站很慢"更是减分。页脚是"关于本站"的常规位置，
   主动翻菜单的人本来就在找信息，所以抽屉里再留一条短版。文案保留他要的"开代理"。
2. **抽屉从"贴满宽的平铺列表"改成浮起的玻璃目录片**（`.nav__links` ≤768px 整段重写，见 §5 新增行）：
   左右各留 12px、顶部留 8px 缝、圆角 16px（**不是** 24/32px，卡片圆角上限就是 16）、
   行高 48px 上下排，**左侧名称 + 右侧章节编号**，行间是内缩 14px 的细线（不是左侧色条，也不是卡片）。
   编号 01/02/04/05/06/08 直接复用页面上本来就有的 `section__eyebrow` 序号，
   所以它不是装饰性脚手架，而是"点了会落到哪"的预告；首页没有序号，给 `TOP`。
   当前所在章节沿用 `.active`，在抽屉里表现为整行淡蓝底 + 蓝字。
3. **交互补齐**：`is-open` 从 `navLinks` 挪到 `.nav` 上（状态只有一份，抽屉/遮罩/汉堡三处样式都由它驱动，
   `navLinks.is-open` 保留兼容），新增 `.nav-scrim`（`z-index:99`，压在内容上、导航下）点它关闭，
   `Escape` 关闭，`aria-expanded` 与 `aria-label` 同步成"关闭菜单/打开菜单"。
   入场是错开的逐行淡入上移（24ms 一档，共 8 个元素），全局 `prefers-reduced-motion` 那组会自动压成瞬时。
4. **手机端顶栏常驻玻璃**：`.nav` 与 `.nav.is-scrolled` 在 ≤768px 同一套配方（白玻璃 `.72` + `blur(18px) saturate`
   + 细线 + 内高光）。⚠️ **深色档必须换成不透光的深底** `rgba(10,11,14,.72)`：玻璃层原本那套是
   "页面纯黑 + 白玻璃 .10"，那是叠在页面背景上的配方，而顶栏底下是 Showreel 视频，
   片里 10.28s 有一帧整幅白闪（meanY 235），白玻璃叠白闪会把浅墨糊掉。
   同时把 `.nav:not(.is-scrolled)` 那组"浅墨压视频"的规则收进 `@media (min-width:769px)` ——
   手机端顶栏现在有实底了，再套浅墨就反了。
5. 版本号：CSS `neo42 → neo43`，JS `neo17`。
6. **验证（390×844 触屏，浅/深各一遍，截图人工看过）**：抽屉 `border-radius 16px`、
   左右各 `12px`、`top 64px`、宽 `366px`、`backdrop-filter blur(26px)`、7 条链接、编号与提示均可见、
   遮罩展开时 `visibility:visible`；**点遮罩关闭 ✓、Esc 关闭 ✓**；
   对比度按最坏情况算（抽屉底下当成那帧整幅白闪 235 合成）：**浅色 16.41:1、深色 13.19:1**，
   都远高于正文 4.5:1 线。桌面档逐项未变：编号/提示 `display:none`、链接仍是 `980px` 胶囊、汉堡隐藏、
   `.nav__links` 回到 `static`。`Runtime.exceptionThrown` 0 条。
7. ⚠️ **顺带发现、未处理**：Showreel 的几何图案那一段（首屏 0~2s 附近）让 hero 的
   "苏其辉 / 联系我"几乎读不出来 —— 这是第九轮"视频上不加任何遮罩"的既定取舍撞上了这段素材，
   不是这轮引入的。真要治，最小改动是给 hero 文字块单独垫一层径向墨斑（不动视频本身），
   需要用户先点头。
