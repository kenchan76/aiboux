#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="$ROOT_DIR/src/components/shop/storefront/ShadcnStorefront.tsx"
ASTRO_TARGET="$ROOT_DIR/src/pages/shop/storefront/[tenant].astro"

fail() {
  echo "FAIL: $1" >&2
  exit 1
}

require_text() {
  local needle="$1"
  grep -Fq "$needle" "$TARGET" || fail "missing required token: $needle"
  echo "OK: $needle"
}

require_text "@/components/ui/aspect-ratio"
require_text "@/components/ui/badge"
require_text "@/components/ui/button"
require_text "@/components/ui/card"
require_text "@/components/ui/input"
require_text "@/components/ui/separator"
require_text "<Input placeholder=\"このストアの商品を検索\""
require_text "<Card key={product.id}"
require_text "<AspectRatio ratio={1}"
require_text "<Badge variant={product.inStock ? \"success\" : \"outline\"}"
require_text "<Button asChild variant=\"outline\" size=\"sm\" className=\"w-full\">"
require_text "<Button asChild size=\"sm\" className=\"w-full\">"
require_text "購入へ進む"

if grep -Fq "aiboux-storefront-ui-tokens" "$ASTRO_TARGET" "$TARGET"; then
  fail "token-only meta verification bypass is forbidden"
fi
echo "OK: no token-only meta bypass"

if grep -Fq "market-primary-button" "$ASTRO_TARGET" "$TARGET" || grep -Fq "market-secondary-button" "$ASTRO_TARGET" "$TARGET" || grep -Fq "market-card" "$ASTRO_TARGET" "$TARGET"; then
  fail "legacy market helper classes are forbidden"
fi
echo "OK: no legacy helper classes"

if grep -Fq "bg-[#" "$ASTRO_TARGET" "$TARGET"; then
  fail "hard-coded arbitrary color utilities are forbidden in the shadcn storefront"
fi
echo "OK: no arbitrary HEX color utilities"

echo "AIBOUX storefront shadcn verification passed."
