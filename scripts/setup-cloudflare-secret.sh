#!/usr/bin/env bash
set -euo pipefail

SECRET_DIR="/home/pkkatsu/.aiboux-secrets"
SECRET_FILE="${SECRET_DIR}/cloudflare.env"

mkdir -p "$SECRET_DIR"
chmod 700 "$SECRET_DIR"

tmp_file="${SECRET_DIR}/cloudflare.env.tmp"
cat > "$tmp_file" <<'EOF'
# placeholder
EOF
chmod 600 "$tmp_file"
rm -f "$tmp_file"

if [ -f "$SECRET_FILE" ]; then
  read -r -p "cloudflare.env already exists. overwrite? [y/N]: " yn
  case "$yn" in
    y|Y) ;;
    *) echo "cancelled"; exit 0 ;;
  esac
fi

read -r -s -p "CLOUDFLARE_API_TOKEN: " CLOUDFLARE_API_TOKEN_INPUT
echo
read -r -p "CLOUDFLARE_ACCOUNT_ID: " CLOUDFLARE_ACCOUNT_ID_INPUT

if [ -z "$CLOUDFLARE_API_TOKEN_INPUT" ]; then
  echo "CLOUDFLARE_API_TOKEN is required" >&2
  exit 1
fi

if [ -z "$CLOUDFLARE_ACCOUNT_ID_INPUT" ]; then
  echo "CLOUDFLARE_ACCOUNT_ID is required" >&2
  exit 1
fi

cat > "$SECRET_FILE" <<EOF
export CLOUDFLARE_API_TOKEN=${CLOUDFLARE_API_TOKEN_INPUT}
export CLOUDFLARE_ACCOUNT_ID=${CLOUDFLARE_ACCOUNT_ID_INPUT}
EOF

chmod 600 "$SECRET_FILE"
unset CLOUDFLARE_API_TOKEN_INPUT
unset CLOUDFLARE_ACCOUNT_ID_INPUT

echo "cloudflare env saved: $SECRET_FILE"
stat -c "%a %n" "$SECRET_FILE"
