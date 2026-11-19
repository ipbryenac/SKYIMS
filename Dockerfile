# ===========================================================
# Stage 1: Build Frontend Assets with Node.js
# ===========================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Install npm dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy frontend source files
COPY resources/ ./resources/
COPY public/ ./public/
COPY vite.config.js postcss.config.js tailwind.config.js jsconfig.json ./

# Build production bundle
RUN npm run build

# ===========================================================
# Stage 2: PHP 8.4 Apache Production Runtime
# ===========================================================
FROM php:8.4-apache AS runner

# Install system dependencies & PHP extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libpq-dev \
    libsqlite3-dev \
    libzip-dev \
    libonig-dev \
    libicu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        pdo_sqlite \
        mbstring \
        bcmath \
        gd \
        zip \
        intl \
        opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Configure Apache DocumentRoot to /var/www/html/public
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf \
    && sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# Set working directory
WORKDIR /var/www/html

# Copy composer definition files first for layer caching
COPY composer.json composer.lock ./

# Install PHP dependencies without running scripts
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Copy full application source code
COPY . .

# Copy compiled Vite assets from Stage 1
COPY --from=frontend-builder /app/public/build ./public/build

# Re-dump optimized autoloader with full class tree
RUN composer dump-autoload --optimize

# Ensure directory permissions for Apache user
RUN mkdir -p /var/www/html/database /var/www/html/storage /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80 10000

ENTRYPOINT ["docker-entrypoint.sh"]
