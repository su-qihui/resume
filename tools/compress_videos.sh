#!/usr/bin/env bash
# 视频转码 + 封面生成（修正版）
# 问题：源文件路径含中文/&，ffmpeg 报 "Illegal byte sequence"
# 解决：先拷到 ASCII 临时名，再转码
set -u
export LC_ALL=C.UTF-8 2>/dev/null || true
export LANG=C.UTF-8 2>/dev/null || true

SRC="/f/我的简历/简历作品/PR&AE-视频"
ROOT="C:/Users/Administrator/WorkBuddy/简历网站"
OUT="$ROOT/assets/video"
STAGE="$ROOT/assets/video/_staging"
LOG="$ROOT/tools/transcode.log"

mkdir -p "$OUT/school" "$OUT/douyin" "$STAGE/school" "$STAGE/douyin"
echo "=== transcode start $(date) ===" | tee "$LOG"

# 1) 拷贝源到 ASCII 临时名
stage_dir () {
  local src="$1" stage="$2" prefix="$3"
  local i=1
  for f in "$src"/*.mp4; do
    [ -e "$f" ] || continue
    local num; num=$(printf "%02d" "$i")
    cp "$f" "$stage/$prefix-$num.mp4"
    i=$((i+1))
  done
}
stage_dir "$SRC/学校" "$STAGE/school" "school"
stage_dir "$SRC/抖音" "$STAGE/douyin" "douyin"

# 2) 转码 + 抽帧
process () {
  local stage="$1" out="$2"
  for f in "$stage"/*.mp4; do
    [ -e "$f" ] || continue
    local base; base=$(basename "$f" .mp4)
    local poster="$out/$base.jpg"
    local mp4="$out/$base.mp4"
    echo "[$base]" | tee -a "$LOG"
    ffmpeg -y -loglevel error -ss 00:00:02 -i "$f" -vframes 1 -q:v 3 "$poster" 2>>"$LOG"
    ffmpeg -y -loglevel error -i "$f" -vf "scale=-2:720" -c:v libx264 -crf 28 -preset medium -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k "$mp4" 2>>"$LOG"
    local sz; sz=$(du -h "$mp4" 2>/dev/null | cut -f1)
    echo "  -> $mp4 ($sz)" | tee -a "$LOG"
  done
}
process "$STAGE/school" "$OUT/school"
process "$STAGE/douyin" "$OUT/douyin"

rm -rf "$STAGE"
echo "=== transcode done $(date) ===" | tee -a "$LOG"
total=$(du -sh "$OUT" 2>/dev/null | cut -f1)
echo "total output: $total" | tee -a "$LOG"
