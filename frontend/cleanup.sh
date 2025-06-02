#!/bin/bash

echo "=== Nettoyage des fichiers TypeScript ==="

# 1. Suppression des imports inutilisés
echo "Suppression des imports inutilisés..."
npx ts-prune --error | grep "unused" | awk '{print $2}' | while read -r module; do
  find ./src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i -E "/import.*$module.*from/d" {} \;
done

# 2. Suppression des variables non utilisées
echo "Suppression des variables non utilisées..."
find ./src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i -E '/(const|let|var) [a-zA-Z0-9_]+[^=]*$/d' {} \;

# 3. Correction des retours manquants
echo "Correction des retours manquants..."
find ./src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i -E '/function[^(]*\([^)]*\)[^{]*\{[^}]*$/ {N; /[^}]\s*$/!b; s/}/  return null;\n}/; }' {} \;

# 4. Vérification du build
echo "Vérification du build..."
npm run build

echo "=== Nettoyage terminé ==="
