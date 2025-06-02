# Étape de construction
FROM node:18-alpine AS builder

# Activer le mode verbeux pour le débogage
ENV NPM_CONFIG_LOGLEVEL=verbose

# Définir le répertoire de travail
WORKDIR /app

# D'abord, copier uniquement les fichiers de configuration
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/

# Afficher la structure des dossiers pour le débogage
RUN ls -la && \
    ls -la frontend/ && \
    ls -la backend/ && \
    ls -la shared/

# Installer les dépendances globales
RUN npm install -g npm@latest
RUN npm install -g concurrently

# Installer les dépendances du workspace racine
RUN npm install

# Construire les packages dans l'ordre
WORKDIR /app/shared
RUN npm run build

WORKDIR /app/backend
RUN npm run build

WORKDIR /app/frontend
RUN npm run build

# Étape d'exécution
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Installer uniquement les dépendances de production
RUN npm install --production --prefix frontend

# Copier les fichiers construits depuis l'étape de construction
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/shared/dist ./shared/dist

# Exposer le port
EXPOSE 3000

# Définir le répertoire de travail pour l'exécution
WORKDIR /app/frontend

# Démarrer l'application
CMD ["npm", "start"]
