#!/bin/sh
set -e

echo "=== Vérification de la structure du projet..."

# Vérifier que le dossier src/app existe
if [ ! -d "src/app" ]; then
  echo "ERREUR: Le dossier src/app est introuvable"
  exit 1
fi

# Créer un lien symbolique temporaire pour la construction
if [ ! -L "app" ]; then
  echo "Création d'un lien symbolique de src/app vers app..."
  ln -s src/app app
fi

echo "=== Installation des dépendances..."
npm ci

echo "=== Construction de l'application..."
npm run build

echo "=== Nettoyage..."
rm -f app

echo "=== Construction terminée avec succès !"

# Lancer l'application en mode développement si l'option --dev est spécifiée
if [ "$1" = "--dev" ]; then
  echo "=== Démarrage du serveur de développement..."
  npm run dev
fi
