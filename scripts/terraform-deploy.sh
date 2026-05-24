#!/usr/bin/env bash
set -euo pipefail

REGION="${1:-us-east-1}"
INSTANCE_TYPE="${2:-t3.small}"
KEY_PATH="${HOME}/.ssh/aurex-telematica"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v terraform >/dev/null 2>&1; then
  echo "Terraform no esta instalado o no esta en PATH."
  exit 1
fi

if ! command -v aws >/dev/null 2>&1; then
  echo "AWS CLI no esta instalado o no esta en PATH."
  exit 1
fi

mkdir -p "${HOME}/.ssh"

if [ ! -f "${KEY_PATH}" ] || [ ! -f "${KEY_PATH}.pub" ]; then
  ssh-keygen -t rsa -b 4096 -f "${KEY_PATH}" -N "" -C "aurex-telematica"
fi

chmod 400 "${KEY_PATH}"

MY_IP="$(curl -fsSL https://checkip.amazonaws.com | tr -d '[:space:]')"

cd "${ROOT_DIR}/infra/terraform"
terraform init
terraform apply -auto-approve \
  -var "aws_region=${REGION}" \
  -var "instance_type=${INSTANCE_TYPE}" \
  -var "public_key_path=${KEY_PATH}.pub" \
  -var "private_key_path=${KEY_PATH}" \
  -var "allowed_ssh_cidr=${MY_IP}/32"

terraform output
