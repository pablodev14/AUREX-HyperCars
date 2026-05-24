#!/usr/bin/env bash
set -euo pipefail

SERVER_IP="${1:-}"
KEY_PATH="${2:-$HOME/.ssh/aurex-telematica}"
REMOTE_DIR="${3:-/opt/aurex}"

if [ -z "$SERVER_IP" ]; then
  echo "Uso: ./scripts/deploy-aws.sh <IP_PUBLICA_EC2> [KEY_PATH] [REMOTE_DIR]"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARCHIVE="/tmp/aurex-deploy.tar.gz"

cd "$ROOT_DIR"
tar \
  --exclude="./backend/node_modules" \
  --exclude="./frontend/node_modules" \
  --exclude="./frontend/dist" \
  --exclude="./.terraform" \
  --exclude="./infra/terraform/.terraform" \
  -czf "$ARCHIVE" .

scp -i "$KEY_PATH" "$ARCHIVE" "ubuntu@$SERVER_IP:/tmp/aurex-deploy.tar.gz"

ssh -i "$KEY_PATH" "ubuntu@$SERVER_IP" <<EOF
set -e
mkdir -p "$REMOTE_DIR"
tar -xzf /tmp/aurex-deploy.tar.gz -C "$REMOTE_DIR"
cd "$REMOTE_DIR"
docker compose up -d --build
docker compose ps
EOF
