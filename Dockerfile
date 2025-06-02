# Utiliser une image Node.js LTS
FROM node:18-alpine AS builder

# Activer le mode verbeux pour le débogage
ENV NPM_CONFIG_LOGLEVEL=info
ENV NODE_OPTIONS=--max_old_space_size=1024

# Créer et définir le répertoire de travail
WORKDIR /app

# Afficher les informations système
RUN echo "=== Informations système ===" && \
    echo "Node version: $(node -v)" && \
    echo "NPM version: $(npm -v)" && \
    echo "Current directory: $(pwd)" && \
    echo "Directory contents:" && \
    ls -la

# Créer la structure de dossiers
RUN mkdir -p frontend

# Copier uniquement les fichiers nécessaires pour l'installation des dépendances
COPY package.json ./
COPY frontend/package.json ./frontend/

# Afficher les fichiers de configuration
RUN echo "\n=== Fichiers de configuration ===" && \
    echo "\npackage.json (racine):" && \
    cat package.json && \
    echo "\npackage.json (frontend):" && \
    cat frontend/package.json

# Nettoyage complet avant installation
WORKDIR /app/frontend
RUN echo "\n=== Nettoyage complet avant installation ===" && \
    echo 'Suppression des caches NPM, node_modules et lockfiles...' && \
    rm -rf node_modules && \
    rm -f package-lock.json && \
    rm -rf ~/.npm && \
    npm cache clean --force

# Installation des dépendances avec plusieurs méthodes de secours
RUN echo "\n=== Installation des dépendances (méthode 1: standard) ===" && \
    npm install --legacy-peer-deps || (\
        echo "\n=== Échec méthode 1, tentative avec --force ===" && \
        npm install --force || (\
            echo "\n=== Échec méthode 2, affichage des logs d'erreur ===" && \
            cat /root/.npm/_logs/*-debug.log 2>/dev/null || true && \
            exit 1\
        )\
    )

# Si on arrive ici, l'installation a réussi, on peut construire l'application
RUN echo "\n=== Construction de l'application ===" && \
    npm run build || (echo "\n=== Échec de la construction, affichage des erreurs ===" && \
                     cat /root/.npm/_logs/*-debug.log && \
                     exit 1)

# Étape d'exécution
FROM node:18-alpine

# Définir les variables d'environnement
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max_old_space_size=1024

# Créer et définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour l'exécution
COPY --from=builder /app/package.json ./
COPY --from=builder /app/frontend/package.json ./frontend/

# Nettoyage avant installation des dépendances de production
WORKDIR /app/frontend
RUN echo "\n=== Nettoyage avant installation de production ===" && \
    rm -rf node_modules && \
    rm -f package-lock.json && \
    npm cache clean --force

# Installation des dépendances de production avec méthodes de secours
RUN echo "\n=== Installation des dépendances de production ===" && \
    npm install --production --legacy-peer-deps || (\
        echo "\n=== Échec méthode 1, tentative avec --force ===" && \
        npm install --production --force || (\
            echo "\n=== Échec méthode 2, affichage des logs d'erreur ===" && \
            cat /root/.npm/_logs/*-debug.log 2>/dev/null || true && \
            exit 1\
        )\
    )

# Copier les fichiers construits et les fichiers statiques
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public

# Exposer le port 3000
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
