# 苏其辉 · 多媒体设计师作品集

一个 **Apple / DJI 风格** 的单页简历 / 作品集网站：大面积留白、滚动驱动叙事、视差滚动、3D 倾斜交互、暗 / 亮模式切换，完全离线可用、零依赖。

## 目录结构

```
.
├── index.html              # 单页主文件（全部区块）
├── css/style.css           # 双主题样式 / 排版 / 动画 / 响应式
├── js/main.js              # 主题 · 视差 · 钉住叙事 · 3D倾斜 · 揭示 · 计数 · Lightbox
├── assets/
│   ├── img/                # 作品图 / 简历图 / 抖音截图 / 图标
│   └── video/              # 转码后的 720p mp4 + poster 封面
└── tools/
    └── compress_videos.sh  # 视频转码 + 封面生成脚本（源含中文路径时自动 ASCII 暂存）
```

## 本地预览

方式一（推荐，避免浏览器 file:// 限制）：
```bash
cd 项目目录
python -m http.server 8765
# 浏览器打开 http://127.0.0.1:8765
```

方式二：直接双击 `index.html` 用浏览器打开（本站纯静态、无模块、可离线运行）。

## 功能一览

- **Hero 首屏**：姓名大字 + 产品卡 3D 缩放入场 + 滚动视差。
- **关于**：3D 倾斜交互卡 + 数字滚动统计 + 创作装备。
- **核心能力（钉住滚动）**：滚动时中央视觉体 3D 旋转、四个能力点依次切换、进度点指示。
- **技能**：滚动到视口时进度条与数字动画。
- **作品集**：标签筛选（全部 / AI 平面 / CDR 制版 / 视频）+ Lightbox 大图 / 视频灯箱（懒加载）。
- **抖音 / 经历 / 证书 / 联系**：极简卡片与时间线。
- **暗 / 亮模式**：右上角切换，记忆到 localStorage，跟随系统初值，无闪烁（防 FOUC）。
- **响应式**：手机 / 平板 / 桌面全适配，移动端汉堡菜单。
- **无障碍**：`prefers-reduced-motion` 下关闭动效；语义化标签 + 键盘可达（Lightbox 支持方向键 / Esc）。

## 替换素材

- **作品图**：放到 `assets/img/portfolio/ai` 或 `cdr`，并在 `index.html` 对应 gallery 中按相同结构添加 `<figure>`。
- **视频**：将 mp4 放 `assets/video/school` 或 `douyin`，命名 `school-01.mp4` / `school-01.jpg`（封面），再在 HTML 视频 gallery 添加卡片。也可重跑 `tools/compress_videos.sh`（见下）从源盘批量生成。
- **文案 / 联系方式**：直接编辑 `index.html` 中的文字。

## 视频转码（可选，从源盘重新生成）

源视频在 `F:\我的简历\简历作品\PR&AE-视频`，含中文 / `&` 路径，ffmpeg 直接读取会报
`Illegal byte sequence`。脚本已做 **ASCII 暂存** 处理：

```bash
bash tools/compress_videos.sh
```

输出 720p H.264 + faststart 的 web 友好 mp4 与 poster 封面到 `assets/video/`。
