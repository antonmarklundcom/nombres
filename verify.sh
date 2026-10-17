#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="$ROOT"
if [[ "${1:-}" == "--root" ]]; then TARGET="$(cd "$2" && pwd)"; fi
command -v php >/dev/null || { echo 'PHP 8.2+ is required' >&2; exit 2; }
php -r 'exit(PHP_VERSION_ID >= 80200 ? 0 : 1);'
while IFS= read -r -d '' file; do php -l "$file" >/dev/null; done < <(find "$TARGET" -path '*/dist' -prune -o -path '*/.git' -prune -o -name '*.php' -print0)
php -r 'require $argv[1]."/lib/bootstrap.php"; $errors=catalog_errors($names); if ($errors) {fwrite(STDERR,implode("\n",$errors)."\n"); exit(1);} echo "PASS: ".count($names)." valid catalog records in selected target\n";' "$TARGET"
python3 "$ROOT/tests/catalog_workflow.py"
RUN_TMP="$(mktemp -d)"
SERVER_PID=''
cleanup() { if [[ -n "$SERVER_PID" ]]; then kill "$SERVER_PID" 2>/dev/null || true; wait "$SERVER_PID" 2>/dev/null || true; fi; rm -rf "$RUN_TMP"; }
trap cleanup EXIT
PORT="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1",0)); print(s.getsockname()[1]); s.close()')"
(cd "$TARGET" && exec php -d display_errors=1 -d error_reporting=32767 -S "127.0.0.1:$PORT" router.php) >"$RUN_TMP/server.log" 2>&1 &
SERVER_PID=$!
python3 - "$PORT" <<'PY'
import sys,time,urllib.request
for attempt in range(50):
    try:
        with urllib.request.urlopen('http://127.0.0.1:'+sys.argv[1]+'/',timeout=1) as r:
            assert r.status==200
        break
    except OSError:time.sleep(.1)
else:raise SystemExit('PHP server did not become ready')
PY
python3 "$ROOT/tests/crawl.py" --base "http://127.0.0.1:$PORT" --root "$ROOT" --report "$RUN_TMP/crawl.json"
if rg -i 'PHP (Warning|Notice|Fatal error|Parse error|Deprecated)' "$RUN_TMP/server.log"; then exit 1; fi
echo 'PASS: PHP lint, catalog validation, full crawl and clean server log'
