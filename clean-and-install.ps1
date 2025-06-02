Write-Host "🧹 Nettoyage des dépendances existantes..." -ForegroundColor Cyan

# Supprimer les dossiers node_modules et les fichiers de verrouillage
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue backend\node_modules
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue frontend\node_modules
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue shared\node_modules

Remove-Item -Force -ErrorAction SilentlyContinue package-lock.json
Remove-Item -Force -ErrorAction SilentlyContinue backend\package-lock.json
Remove-Item -Force -ErrorAction SilentlyContinue frontend\package-lock.json
Remove-Item -Force -ErrorAction SilentlyContinue shared\package-lock.json

Write-Host "🔄 Réinstallation des dépendances..." -ForegroundColor Cyan

# Installer les dépendances racine
npm install

# Installer les dépendances de chaque package
Set-Location backend
npm install
Set-Location ..

Set-Location frontend
npm install
Set-Location ..

Set-Location shared
npm install
Set-Location ..

Write-Host "✅ Nettoyage et réinstallation terminés avec succès !" -ForegroundColor Green
