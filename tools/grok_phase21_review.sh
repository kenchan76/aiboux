#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT_DIR/all_log"
mkdir -p "$LOG_DIR"

run_grok_review() {
  local name="$1"
  local prompt="$2"
  local output="$LOG_DIR/24_phase21_grok_${name}_review.md"

  timeout 60s grok \
    --no-subagents \
    --disable-web-search \
    --effort low \
    --always-approve \
    --permission-mode bypassPermissions \
    --no-plan \
    --max-turns 1 \
    -p "$prompt" > "$output" 2>&1

  local code=$?
  {
    echo
    echo "GROK_EXIT:$code"
  } >> "$output"

  if [ "$code" -eq 124 ]; then
    {
      echo
      echo "## Timeout Fallback"
      echo
      echo "Grok timed out for this small chunk. External approval was not obtained."
    } >> "$output"
  fi
}

run_grok_review "header" "AIBOUX Shop Phase 21 UX chunk review: storefront header only. Review dark marketplace header (#131921 / #232F3E), white search area, compact navigation, no decorative noise. AIBOUX policy forbids copying competitor UI exactly, so judge as original marketplace-style UX. Return APPROVAL or BLOCKERS in concise Japanese."

run_grok_review "product_card" "AIBOUX Shop Phase 21 UX chunk review: product card only. Review white card, 1px #DDDDDD border, square product image, blue product title (#007185), red price (#B12704), yellow primary CTA (#FFD814), orange secondary CTA (#FFA41C), compact spacing, no fake cart behavior. AIBOUX policy forbids copying competitor UI exactly, so judge as original marketplace-style UX. Return APPROVAL or BLOCKERS in concise Japanese."

cat "$LOG_DIR"/24_phase21_grok_*_review.md > "$LOG_DIR/24_phase21_grok_chunked_review.md"
