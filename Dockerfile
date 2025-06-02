# Étape de construction
FROM node:18-alpine AS builder

# Activer le mode verbeux pour le débogage
ENV NPM_CONFIG_LOGLEVEL=verbose

# Définir le répertoire de travail
WORKDIR /app

# Afficher la version de npm et node
RUN npm --version && node --version

# Copier les fichiers de configuration
COPY package.json ./
COPY frontend/package.json ./frontend/

# Afficher la structure des dossiers
RUN ls -la && ls -la frontend/

# Installer les dépendances globales
RUN npm install -g npm@latest

# Installer les dépendances du frontend
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps --no-optional

# Copier le reste des fichiers
WORKDIR /app
COPY . .

# Construire le frontend
WORKDIR /app/frontend
RUN npm run build

# Étape d'exécution
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY --from=builder /app/package.json ./
COPY --from=builder /app/frontend/package.json ./frontend/

# Installer les dépendances de production
WORKDIR /app/frontend
RUN npm install --production --legacy-peer-deps --no-optional

# Copier les fichiers construits depuis l'étape de construction
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public

# Exposer le port
EXPOSE 3000

# Définir les variables d'environnement
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max_old_space_size=1024

# Démarrer l'application
CMD ["npm", "start"]
