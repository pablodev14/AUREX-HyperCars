param(
  [Parameter(Mandatory = $true)]
  [string]$ServerIp,

  [Parameter(Mandatory = $false)]
  [string]$KeyPath = "$HOME\.ssh\aurex-telematica",

  [Parameter(Mandatory = $false)]
  [string]$RemoteDir = "/opt/aurex"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
  throw "No se encontro ssh en PATH."
}

if (-not (Get-Command scp -ErrorAction SilentlyContinue)) {
  throw "No se encontro scp en PATH."
}

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$archive = Join-Path $env:TEMP "aurex-deploy.tar.gz"

Push-Location $root
try {
  if (Test-Path $archive) {
    Remove-Item -LiteralPath $archive -Force
  }

  tar `
    --exclude="./backend/node_modules" `
    --exclude="./frontend/node_modules" `
    --exclude="./frontend/dist" `
    --exclude="./.terraform" `
    --exclude="./infra/terraform/.terraform" `
    -czf $archive .

  scp -i $KeyPath $archive "ubuntu@${ServerIp}:/tmp/aurex-deploy.tar.gz"

  ssh -i $KeyPath "ubuntu@${ServerIp}" @"
set -e
mkdir -p $RemoteDir
tar -xzf /tmp/aurex-deploy.tar.gz -C $RemoteDir
cd $RemoteDir
docker compose up -d --build
docker compose ps
"@
}
finally {
  Pop-Location
}
