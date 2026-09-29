#!/bin/sh
# 推送 mbl-resume-neo 到 github.com/su-qihui/resume（main 分支）
set -e
export GIT_TERMINAL_PROMPT=0
export GCM_INTERACTIVE=Never
unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY

G="/c/Program Files/Git/cmd/git.exe"
REPO="/e/vibe coding/Resume/HTTP/mbl-resume-neo"
cd "$REPO"

echo "== 1. 抓取远端 main =="
"$G" -c http.https://github.com/.proxy= fetch origin main 2>&1 | tail -3

echo "== 2. 以远端 main 为父提交，重建本地提交 =="
"$G" reset --soft FETCH_HEAD
"$G" add -A
echo "-- 相对远端的变更 --"
"$G" diff --cached --stat FETCH_HEAD | tail -8

echo "== 3. 提交 =="
"$G" commit -m "毛玻璃主题与移动端适配优化；新增 VibeCoding 栏与泉州旅行视频

- 精选案例新增 VibeCoding 筛选栏（Trace + 简历视频，4K 源已压至 720p）
- Trace 卡片挂开源地址，图库底部注明使用 Codex + Hyperframes 制作
- 视频作品新增「泉州旅行-DJInano」（4K 源压至 720p）
- 首屏新增「导出简历」按钮；简历卡可点击查看大图
- 教育经历日期 2026.06 → 2027.06；删除抖音区宣传标语
- 首屏封面更新为 1.2 版；修复首屏姓名下沿被裁的问题
- 装备区新增 DJI Osmo 360 II；移动端排成上4下5并保留散开效果
- 移动端浅色模式开启毛玻璃，深色模式关闭；关闭 emoji 与蓝点追踪" 2>&1 | tail -4

echo "== 4. 推送到 origin/main =="
"$G" -c http.https://github.com/.proxy= push origin main 2>&1 | tail -6

echo "== 5. 最近提交 =="
"$G" log --oneline -3
echo "== DONE =="
