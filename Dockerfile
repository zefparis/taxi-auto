# Utiliser une image Node.js LTS
FROM node:18-alpine AS builder

# Activer le mode verbeux pour le débogage
ENV NPM_CONFIG_LOGLEVEL=info
ENV NODE_OPTIONS=--max_old_space_size=1024

# Créer et définir le répertoire de travail
WORKDIR /app

# Afficher les versions
RUN echo "Node version: $(node -v)" && \
    echo "NPM version: $(npm -v)"

# Créer la structure de dossiers
RUN mkdir -p frontend

# Copier uniquement les fichiers nécessaires pour l'installation des dépendances
COPY package.json ./
COPY frontend/package.json ./frontend/

# Afficher la structure des dossiers et le contenu des fichiers de configuration
RUN echo "=== Structure du projet ===" && \
    ls -la && \
    echo "\n=== Contenu du package.json racine ===" && \
    cat package.json && \
    echo "\n=== Contenu du package.json frontend ===" && \
    cat frontend/package.json

# Installer les dépendances du frontend
WORKDIR /app/frontend
RUN echo "\n=== Installation des dépendances frontend ===" && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install --legacy-peer-deps --no-optional --no-fund --no-audit --prefer-offline

# Copier le reste des fichiers
WORKDIR /app
COPY . .

# Construire le frontend
WORKDIR /app/frontend
RUN echo "\n=== Construction du frontend ===" && \
    npm run build

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

# Installer les dépendances de production
WORKDIR /app/frontend
RUN echo "\n=== Installation des dépendances de production ===" && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install --production --legacy-peer-deps --no-optional --no-fund --no-audit --prefer-offline

# Copier les fichiers construits et les fichiers statiques
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public

# Exposer le port 3000
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
