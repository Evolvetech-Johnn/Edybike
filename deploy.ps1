#!/usr/bin/env pwsh
# Script de Deploy Automático para Netlify
# Uso: .\deploy.ps1 [--prod]

param(
    [switch]$prod = $false
)

Write-Host "🚀 Iniciando Deploy Edy-Bike..." -ForegroundColor Cyan

# Navegar para frontend
Set-Location -Path "$PSScriptRoot\frontend"

# Verificar se node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# Executar predeploy (build + verificação)
Write-Host "🔨 Executando build e verificações..." -ForegroundColor Yellow
npm run predeploy

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build falhou! Deploy cancelado." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build verificado com sucesso!" -ForegroundColor Green

# Deploy
if ($prod) {
    Write-Host "🌐 Fazendo deploy para PRODUÇÃO..." -ForegroundColor Magenta
    netlify deploy --prod --dir=dist
} else {
    Write-Host "🧪 Fazendo deploy para PREVIEW..." -ForegroundColor Yellow
    netlify deploy --dir=dist
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Deploy concluído com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Deploy falhou!" -ForegroundColor Red
    exit 1
}

Set-Location -Path $PSScriptRoot
