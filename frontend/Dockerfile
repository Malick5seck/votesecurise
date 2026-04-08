# frontend/Dockerfile

# --- ÉTAPE 1 : Compilation de l'application React ---
FROM node:20 AS build
WORKDIR /app

# Copie des fichiers de configuration NPM
COPY package*.json ./
RUN npm install

# Copie du reste du code et compilation (Vite)
COPY . .
RUN npm run build

# --- ÉTAPE 2 : Serveur Web (Nginx) pour la production ---
FROM nginx:alpine

# On copie les fichiers compilés depuis l'Étape 1 vers Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuration spéciale pour React Router (permet d'actualiser la page sans erreur 404)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Ouverture du port 80
EXPOSE 80

# Démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"]