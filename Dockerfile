# Étape de construction
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/

# Installer les dépendances
RUN npm install -g npm@latest
RUN npm install -g concurrently
RUN npm install

# Copier les fichiers sources
COPY . .

# Construire l'application
RUN npm run build

# Étape d'exécution
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Installer uniquement les dépendances de production
RUN npm install --production

# Copier les fichiers construits depuis l'étape de construction
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/shared/dist ./shared/dist

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
