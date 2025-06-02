# Étape de construction
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# D'abord, copier uniquement les fichiers de configuration
COPY package.json package-lock.json ./
COPY frontend/package*.json ./frontend/

# Installer uniquement les dépendances nécessaires pour la construction du frontend
WORKDIR /app/frontend
RUN npm ci --omit=dev

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
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/frontend/package*.json ./frontend/

# Installer uniquement les dépendances de production
WORKDIR /app/frontend
RUN npm ci --omit=dev --prefer-offline --no-audit --progress=false

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
