#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
if ! command -v node >/dev/null && [ -x /tmp/node-v22.16.0-linux-x64/bin/node ]; then
  export PATH="/tmp/node-v22.16.0-linux-x64/bin:$PATH"
fi
(cd backend && if [ -f target/cargoshare-backend-1.0.0.jar ]; then java -jar target/cargoshare-backend-1.0.0.jar; else mvn spring-boot:run; fi) &
backend_pid=$!
trap 'kill "$backend_pid" 2>/dev/null || true' EXIT INT TERM
npm run dev
