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

# Nettoyage profond avant installation
WORKDIR /app/frontend
RUN echo "\n=== Nettoyage profond des dépendances et caches ===" && \
    echo 'Suppression complète de node_modules, package-lock.json et caches...' && \
    rm -rf node_modules && \
    rm -f package-lock.json && \
    rm -rf ~/.npm && \
    rm -rf /root/.npm && \
    npm cache clean --force

# Vérification du package.json
RUN echo "\n=== Vérification du package.json ===" && \
    echo 'Contenu du package.json :' && \
    cat package.json && \
    (jq . package.json || echo "jq non disponible, affichage brut")

# Installation propre des dépendances
RUN echo "\n=== Installation propre des dépendances ===" && \
    npm install --legacy-peer-deps || (\
        echo "\n=== ÉCHEC DE L'INSTALLATION, AFFICHAGE DES LOGS ===" && \
        cat /root/.npm/_logs/*-debug.log 2>/dev/null || true && \
        exit 1\
    )

# Affichage du diff du package-lock.json (si versionné)
RUN if [ -d .git ]; then \
        echo "\n=== Diff du package-lock.json (si modifié) ===" && \
        git diff package-lock.json || true; \
    fi

# Construction de l'application avec vérification
RUN echo "\n=== Construction de l'application ===" && \
    npm run build || (\
        echo "\n=== ÉCHEC DE LA CONSTRUCTION, AFFICHAGE DES LOGS ===" && \
        cat /root/.npm/_logs/*-debug.log 2>/dev/null || true && \
        echo "\n=== Affichage des erreurs de construction ===" && \
        cat /app/frontend/.next/logs/error.log 2>/dev/null || echo "Fichier d'erreur non trouvé" && \
        exit 1\
    )

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
