param(
    [switch]$c,
    [switch]$r,
    [switch]$h
)

if ($h) {
    Write-Host "Usage: ./run.ps1 [-c] [-r] [-h]"
    Write-Host "Options:"
    Write-Host "  -c    Nettoie l'écran avant l'exécution"
    Write-Host "  -r    Arrête les conteneurs Docker avant le redémarrage"
    Write-Host "  -h    Affiche ce message d'aide"
    exit 0
}

if ($c) {
    Clear-Host
}

if ($r) {
    docker-compose down
}

Set-Location -Path "./APP/ClubMaster-APP"

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur de build"
    exit 1
}

Set-Location -Path "../../"

docker-compose up -d --build 