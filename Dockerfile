# Étape de construction
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app/frontend

# Copier les fichiers de configuration
COPY package.json ./
COPY frontend/package.json ./

# Installer les dépendances et construire l'application
RUN npm install && npm run build

# Étape d'exécution
FROM node:18-alpine

# Définir les variables d'environnement
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max_old_space_size=1024

# Définir le répertoire de travail
WORKDIR /app/frontend

# Copier les fichiers de configuration
COPY --from=builder /app/frontend/package.json ./

# Installer uniquement les dépendances de production
RUN npm install --production

# Copier les fichiers construits
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/public ./public

# Exposer le port 3000
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
