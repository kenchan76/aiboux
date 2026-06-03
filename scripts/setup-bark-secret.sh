#!/usr/bin/env bash
set -euo pipefail

SECRET_DIR="/home/pkkatsu/.aiboux-secrets"
SECRET_FILE="${SECRET_DIR}/bark.env"
DEFAULT_ENDPOINT="https://api.day.app"
CONFIRM_RECEIVED="false"

for arg in "$@"; do
  case "$arg" in
    --confirm-received) CONFIRM_RECEIVED="true" ;;
    *) echo "unknown argument: $arg" >&2; exit 2 ;;
  esac
done

normalize_endpoint() {
  local raw="${1:-}"
  if [ -z "$raw" ]; then
    printf '%s\n' "$DEFAULT_ENDPOINT"
    return
  fi

  if [[ "$raw" =~ ^https?:// ]]; then
    local scheme="${raw%%://*}"
    local without_scheme="${raw#*://}"
    local host="${without_scheme%%/*}"
    printf '%s://%s\n' "$scheme" "$host"
    return
  fi

  printf '%s\n' "${raw%/}"
}

extract_device_key() {
  local raw="${1:-}"
  if [ -z "$raw" ]; then
    printf '\n'
    return
  fi

  if [[ "$raw" =~ ^https?:// ]]; then
    local without_scheme="${raw#*://}"
    local rest="${without_scheme#*/}"
    local key="${rest%%/*}"
    printf '%s\n' "$key"
    return
  fi

  raw="${raw#/}"
  raw="${raw%/}"
  printf '%s\n' "$raw"
}

mkdir -p "$SECRET_DIR"
chmod 700 "$SECRET_DIR"

if [ -f "$SECRET_FILE" ]; then
  read -r -p "bark.env already exists. overwrite? [y/N]: " yn
  case "$yn" in
    y|Y) ;;
    *) echo "cancelled"; exit 0 ;;
  esac
fi

read -r -p "BARK_ENDPOINT [https://api.day.app]: " BARK_ENDPOINT_INPUT
read -r -s -p "BARK_DEVICE_KEY or Bark full URL: " BARK_DEVICE_KEY_INPUT
echo

BARK_ENDPOINT_NORMALIZED="$(normalize_endpoint "${BARK_ENDPOINT_INPUT:-$DEFAULT_ENDPOINT}")"
BARK_DEVICE_KEY_NORMALIZED="$(extract_device_key "$BARK_DEVICE_KEY_INPUT")"

if [ -z "$BARK_DEVICE_KEY_NORMALIZED" ]; then
  echo "BARK_DEVICE_KEY is required" >&2
  exit 1
fi

if [[ "$BARK_DEVICE_KEY_NORMALIZED" =~ ^https?:// ]] || [[ "$BARK_DEVICE_KEY_NORMALIZED" == *"/"* ]]; then
  echo "BARK_DEVICE_KEY could not be safely normalized" >&2
  exit 1
fi

cat > "$SECRET_FILE" <<EOF
export BARK_ENABLED=true
export BARK_ENDPOINT=${BARK_ENDPOINT_NORMALIZED}
export BARK_DEVICE_KEY=${BARK_DEVICE_KEY_NORMALIZED}
EOF

chmod 600 "$SECRET_FILE"
unset BARK_ENDPOINT_INPUT
unset BARK_DEVICE_KEY_INPUT
unset BARK_DEVICE_KEY_NORMALIZED

echo "bark env saved: $SECRET_FILE"
stat -c "%a %n" "$SECRET_FILE"

SMOKE_ARGS=(
  --title "AIBOUX Bark Auth Test"
  --body "Bark認証テストです。届いたら認証成功です。"
  --url "https://core.aiboux.com/core/deliveries"
  --required
  --probe-auth
)

if [ "$CONFIRM_RECEIVED" = "true" ]; then
  SMOKE_ARGS+=(--confirm-received)
fi

node scripts/notify-bark.mjs "${SMOKE_ARGS[@]}"
