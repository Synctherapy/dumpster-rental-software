#!/bin/sh
# RollOS — "The 7:40 on a Tuesday" (Whiteboard Explainer). Rebuild the whole film.
#   sh build.sh [--vo]       --vo also re-synthesises the narration and re-derives word times
#
# LIB is the Lemo-Opuscar library (what setup.sh printed). Override with LEMO_LIB.
set -e
LIB=${LEMO_LIB:-/root/lemo-opuscar}
HERE=$(cd "$(dirname "$0")" && pwd)
export LEMO_LIB="$LIB"
PY="$LIB/.venv/bin/python"
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LEMO_LIB to the Lemo-Opuscar library folder"; exit 1; }

if [ "$1" = "--vo" ]; then
  "$PY" "$LIB/core/tts/tts.py" "$HERE/lines.json" "$HERE/voices"          # Kokoro am_michael, en-us
  # The Whisper check (tools/asr_check.py) needs a model from Hugging Face, which this
  # environment's network policy blocks. gen_words.py derives the same word timings from
  # the rendered audio instead: clause boundaries measured, within-clause onsets interpolated.
  "$PY" "$HERE/tools/gen_words.py" "$HERE/lines.json" "$HERE/voices"
fi

cd "$LIB"
node core/render/events.mjs "$HERE"                                        # strokes, wipes, magnet, cues
node core/render/readcheck.mjs "$HERE"                                     # every on-screen text readable
"$PY" "$HERE/music.py"                                                     # score (reads events.json)
"$PY" "$HERE/mix.py"                                                       # foley + VO + ducked score
node core/render/video.mjs "$HERE" --fps 24 --workers 4 --out "$HERE/out/video24.mp4"

# ffmpeg 7+ is the supported path; on ffmpeg 6 use the local copy, which re-checks the
# audio length without loudnorm in the chain (6.x under-reports it and rejects good audio).
if ffmpeg -version 2>/dev/null | head -1 | awk '{split($3,v,"."); exit !(v[1] >= 7)}'; then
  sh core/render/mux.sh "$HERE/out/video24.mp4" "$HERE/mix.wav" "$HERE/rollos-whiteboard.mp4" 24 2
else
  sh "$HERE/tools/mux-ffmpeg6.sh" "$HERE/out/video24.mp4" "$HERE/mix.wav" "$HERE/rollos-whiteboard.mp4" 24 2
fi

node "$HERE/tools/subs.mjs"
"$PY" core/render/srt.py "$HERE/out/subs.json" "$HERE/rollos-whiteboard.srt"
node core/render/still.mjs "$HERE" 2.6 16.9 53.5 --q nosubs=1 --prefix sf_ --out "$HERE/out/stills"
node core/render/still.mjs "$HERE" 16.9 --q 'nosubs=1&nopens=1' --prefix po_ --out "$HERE/out/stills"
cp "$HERE/out/stills/po_16.9.jpg" "$HERE/poster.jpg"
echo "built $HERE/rollos-whiteboard.mp4"
