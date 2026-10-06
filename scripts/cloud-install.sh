#!/usr/bin/env bash
set -euo pipefail
cd /workspace/dumpster-rental-software
export npm_config_cache=/workspace/.npm-cache
export NEXT_TELEMETRY_DISABLED=1
export ROLLOS_DEMO="${ROLLOS_DEMO:-true}"
npm ci --no-audit --no-fund
npm run check
npm run build
