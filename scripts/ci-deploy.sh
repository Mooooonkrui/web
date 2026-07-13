#!/bin/bash
# Deploy only changed packages to Cloudflare Pages
set -e

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "❌ CLOUDFLARE_API_TOKEN not set"
  exit 1
fi

# First commit — deploy all
if ! git rev-parse HEAD^1 &>/dev/null; then
  echo "🏁 First commit — deploying all"
  for pkg in packages/site-* packages/main-site; do
    [ -d "$pkg" ] || continue
    name=$(basename "$pkg")
    echo "🚀 Deploying $name"
    (cd "$pkg" && pnpm deploy) || echo "⚠️  $name deploy failed (may need wrangler login)"
  done
  exit 0
fi

# Subsequent commits — deploy only changed
CHANGED=$(git diff --name-only HEAD^1 HEAD -- packages/ 2>/dev/null)

for pkg in packages/site-* packages/main-site; do
  [ -d "$pkg" ] || continue
  name=$(basename "$pkg")
  if echo "$CHANGED" | grep -q "^packages/$name/"; then
    echo "✅ $name — changed, deploying"
    (cd "$pkg" && pnpm deploy) || echo "⚠️  $name deploy failed"
  else
    echo "⏭️  $name — unchanged, skipped"
  fi
done

echo "🎉 Deploy complete"
