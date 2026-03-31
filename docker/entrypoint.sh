#!/bin/sh
set -e

cd /var/www/html

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Wait for database
echo "Waiting for database..."
until php artisan db:monitor --databases=mysql > /dev/null 2>&1; do
    sleep 2
done
echo "Database is ready."

# Run migrations
php artisan migrate --force

# Seed if database is empty (first run)
if [ "$(php artisan tinker --execute='echo App\Models\User::count();' 2>/dev/null)" = "0" ]; then
    echo "First run detected — seeding database..."
    php artisan db:seed --force
fi

# Create storage link
php artisan storage:link 2>/dev/null || true

# Cache config for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Fix permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

echo "Quartz is ready!"

exec "$@"
