# AGENTS.md — 苏其辉作品集站点 · 速读文档

> 供 AI agent 快速建立上下文用。读完本文即可直接改代码，无需再通读全部源码。
> **本目录 = `mbl-resume-neo`：在 `resume-main` 基础上增加毛玻璃（Frosted Glass）主题层的变体。**
> 基底版本：`HTTP/resume-34f.pages.dev/resume-main`（含 2026-09-12 三轮改动）
> 与线上 https://resume-34f.pages.dev 的关系：基底同源，本目录未部署
> 更新日期：2026-09-28

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
| `assets/img/resume/` | cv.jpg / headshot.png | 简历（2.8.1 版，「关于」区）、导航 logo 头像 | ✅ |
| `assets/img/resume/cover.jpg` | 133 KB | **首屏封面卡图 —— 2026-09-28 该卡已删，此图现无人引用**（`v2.html` 那份是 v1 遗留副本，不算） | ❌ 可删 |
| `assets/pdf/` | resume-su-qihui.pdf | 供导航「导出简历」下载的 PDF（1.5 MB） | ✅ |
| `assets/video/{douyin,school}/` | 15 段 mp4 + 同名 jpg 封面 | 视频与封面 | ⚠️ 仅 9 段被用 |
| `assets/video/vibecoding/` | 2 段 mp4 + 2 张 jpg 封面 | VibeCoding 栏：Trace / 简历视频（源 4K 已压到 720p，合计 4.5 MB） | ✅ |
| `assets/video/douyin/douyin-quanzhou.*` | 1 段 mp4 + 1 张 jpg | 泉州旅行-DJInano（源 4K 已压到 720p，5.8 MB） | ✅ |
| `assets/video/hero/` | hero-bg.mp4 (1080p30 / **8.5 MB**) + hero-bg-m.mp4 (720×1280 / **5.6 MB**，手机端) + hero-bg.jpg 封面，均 30s 循环 | **首屏背景视频**，`<source media>` 按视口二选一（源 `Final V2_30s_4K60.mp4` 横屏 / `Final V1_30s_1080x1920_60.mp4` 竖屏）；**调色必须和原片一致，不许加任何 curves/brightness 滤镜**（见 §10 第九轮） | ✅ |
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
| 首屏背景视频 | `.bg-stage` > `.bg-stage__pin`（`position:sticky`）> `.hero__video` + `.hero__scrim`，另有 `.bg-stage__end` | 视频**不在 `.hero` 里**，是 body 级跟随层；高度由 `sizeBgStage()` 量 `#capabilities` 下沿写进 `--bg-stage-h`（挂 ResizeObserver），到那里自然滚走掐断。桌面 `brightness(.88)`+径向斑，手机 `.80`+纯线性。`reduceMotion` 时 `pause()` 停在封面。**`.bg-stage` 必须 `pointer-events:none`** |
| 01/02 压在视频上 | `section.on-video`（加在 `#about`、`#capabilities` 上） | 重绑 `--text/--text-2/--line/--accent` **且写 `color:var(--text)`**；另叠 `background:rgba(6,7,10,.22)` 均匀垫底（必须带 `section` 前缀才压得过 `.caps`）。`.caps` 底色已改 transparent |
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
| **改完资源记得升版本号** | `index.html` 里 CSS / JS / 资源都带 `?v=` 查询串（当前 `css/v2-style.css?v=neo28`、`js/v2-main.js?v=neo7`、`cv.jpg?v=2.8.1`、`hero-bg.mp4?v=3`；`cover.jpg` 已随首屏封面卡移除，不再被引用）。同名文件覆盖后浏览器仍会吃缓存，**不升版本号页面看起来"没变"**（2026-09-28 一天内踩过两次：改完 CSS 没升号，量到的还是旧值）。换图 / 改样式 / 改脚本后把对应 `?v=` 递增即可 |
| 换首屏背景视频 | 覆盖 `assets/video/hero/hero-bg.mp4`（手机端另有 `hero-bg-m.mp4`，两条都要重导）+ 重新抽 `hero-bg.jpg`，并递增 `index.html` 里三处 `?v=`。转码命令：`ffmpeg -i in.mp4 -vf "scale=1920:-2:in_range=full:out_range=limited:flags=lanczos,fps=30" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -an -movflags +faststart out.mp4`（`-an` 去音轨；`in_range/out_range` 是因为源是 `yuvj420p` 全量程，配合输出的 `tv` 标记它是外观无损的往返映射）。⛔ **链里绝不许加 `curves` / `brightness` / `eq` 等调色滤镜** —— 第九轮查明"看着有层膜"就是上一轮加的 curves 把全片亮度压掉 25%、饱和度压掉 32%。导完用 `signalstats` 对照片源与成片的**全片** meanY / SATAVG，两边要对得上 |
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

- **首屏～02（深色带）**：30s 循环的个人 Showreel 当背景，`brightness(.88)` + 中央径向暗斑，视频透过率约 .44（能认出是支片子）；`.bg-stage` sticky 跟随，**到 02 核心能力 下沿掐掉**，03 起回到白底。姓名/标语/正文全转浅色墨 + 文字投影。片源明暗交替（横屏版有 3.7 秒单帧亮度 >200、峰值 218），所以遮罩必须按最亮那一帧定，不是按平均。
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
