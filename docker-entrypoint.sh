#!/bin/bash
set -e

PORT=${PORT:-80}
echo "==> Configuring Apache to listen on port ${PORT}..."
echo "Listen ${PORT}" > /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:.*>/<VirtualHost \*:${PORT}>/g" /etc/apache2/sites-available/*.conf

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
    chmod 664 "$DB_PATH" || true
fi

# Ensure storage directories and permissions
echo "==> Setting up storage permissions..."
mkdir -p storage/framework/{sessions,views,cache} storage/logs storage/app/public
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Create storage symlink
echo "==> Linking storage for public uploads..."
php artisan storage:link --force || true

# Check / Generate APP_KEY if missing
if [ -z "$APP_KEY" ]; then
    echo "==> Generating application encryption key..."
    php artisan key:generate --force
fi

# Run database migrations
echo "==> Running database migrations..."
php artisan migrate --force

# Seed database if users table is empty (perfect for presentation setup)
echo "==> Checking database seeding..."
USER_COUNT=$(php artisan tinker --execute 'echo App\Models\User::count();' 2>/dev/null || echo "0")
if [ "$USER_COUNT" = "0" ]; then
    echo "==> Database is empty. Seeding presentation demo data..."
    php artisan db:seed --force
fi

# Clear and cache configurations for optimal performance
echo "==> Optimizing configurations and routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> SKYIMS is ready! Starting Apache web server on port ${PORT}..."
exec apache2-foreground
