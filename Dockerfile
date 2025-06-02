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

# Essayer d'installer les dépendances avec des options minimales
WORKDIR /app/frontend
RUN echo "\n=== Essai d'installation avec npm install simple ===" && \
    npm install || (echo "\n=== Échec de l'installation simple, affichage des erreurs ===" && \
                   cat /root/.npm/_logs/*-debug.log && \
                   exit 1)

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

# Installer uniquement les dépendances de production
WORKDIR /app/frontend
RUN echo "\n=== Installation des dépendances de production ===" && \
    npm install --production || (echo "\n=== Échec de l'installation de production ===" && \
                               cat /root/.npm/_logs/*-debug.log && \
                               exit 1)

# Copier les fichiers construits et les fichiers statiques
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public

# Exposer le port 3000
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
