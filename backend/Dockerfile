# backend/Dockerfile

FROM php:8.2-cli

# 1. Installation des dépendances système requises par Laravel
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# 2. Nettoyage du cache pour alléger l'image
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# 3. Installation des extensions PHP (notamment PDO pour MySQL)
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# 4. Récupération de Composer (le gestionnaire de paquets PHP)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Définition du dossier de travail
WORKDIR /app

# 6. Copie de tous les fichiers du backend dans le conteneur
COPY . /app

# 7. Installation des dépendances PHP
RUN composer install --no-interaction --optimize-autoloader

# 8. Donner les bonnes permissions aux dossiers critiques
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

# 9. Ouverture du port 8000
EXPOSE 8000

# 10. Commande de démarrage par défaut de l'API
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]