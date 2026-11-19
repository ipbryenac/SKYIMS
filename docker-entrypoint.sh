#!/bin/bash
set -e

PORT=${PORT:-80}
echo "==> Configuring Apache to listen on port ${PORT}..."
echo "Listen ${PORT}" > /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:.*>/<VirtualHost \*:${PORT}>/g" /etc/apache2/sites-available/*.conf

# Validate APP_KEY (Render's generateValue creates a 64-char string that breaks Laravel's 32-byte AES-256 cipher)
if [ -z "$APP_KEY" ] || [ "${APP_KEY:0:7}" != "base64:" -a ${#APP_KEY} -ne 32 ]; then
    echo "==> APP_KEY missing or invalid for AES-256 (${#APP_KEY} chars). Generating valid Laravel base64 key..."
    APP_KEY=$(php artisan key:generate --show)
    export APP_KEY
fi

# Setup SQLite if using sqlite connection
if [ "${DB_CONNECTION:-sqlite}" = "sqlite" ]; then
    DB_PATH="${DB_DATABASE:-/var/www/html/database/database.sqlite}"
    echo "==> Checking SQLite database at ${DB_PATH}..."
    mkdir -p "$(dirname "$DB_PATH")"
    if [ ! -f "$DB_PATH" ]; then
        echo "==> Creating new SQLite database file..."
        touch "$DB_PATH"
    fi
    chown -R www-data:www-data "$(dirname "$DB_PATH")"
    chmod -R 775 "$(dirname "$DB_PATH")"
    chmod 664 "$DB_PATH" || true
fi

# Ensure storage directories and permissions
echo "==> Setting up storage permissions..."
mkdir -p storage/framework/{sessions,views,cache} storage/logs storage/app/public/id_proofs
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Create storage symlink
echo "==> Linking storage for public uploads..."
php artisan storage:link --force || true

# Wait for database if using external connection (e.g. pgsql)
if [ "${DB_CONNECTION:-sqlite}" != "sqlite" ]; then
    echo "==> Verifying database connection (${DB_CONNECTION})..."
    for i in $(seq 1 15); do
        if php artisan db:monitor > /dev/null 2>&1; then
            echo "==> Database connection verified!"
            break
        fi
        echo "    Waiting for database to be ready ($i/15)..."
        sleep 2
    done
fi

# Run database migrations
echo "==> Running database migrations..."
php artisan migrate --force

# Seed database with presentation demo data (fully idempotent using updateOrCreate)
echo "==> Seeding presentation demo data..."
php artisan db:seed --force

# Clear and cache configurations for optimal performance
echo "==> Optimizing configurations and routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> SKYIMS is ready! Starting Apache web server on port ${PORT}..."
exec apache2-foreground
