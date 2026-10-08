#!/bin/sh
set -e

mkdir -p "${DATA_DIR:-/app/storage}/uploads"

# 1) apply schema migrations
node node_modules/prisma/build/index.js migrate deploy
# 2) first-run data: default settings, logo/favicon import, first admin user (idempotent)
node prisma/seed.mjs

exec "$@"
