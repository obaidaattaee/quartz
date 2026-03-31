#!/bin/sh
set -e

cd /var/www/html

# Create .env from environment variables if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env from environment variables..."
    cat > .env << EOF
APP_NAME=${APP_NAME:-Quartz}
APP_ENV=${APP_ENV:-production}
APP_DEBUG=${APP_DEBUG:-false}
APP_URL=${APP_URL:-http://localhost}
APP_KEY=${APP_KEY:-}

APP_LOCALE=en
APP_FALLBACK_LOCALE=en

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=error

DB_CONNECTION=${DB_CONNECTION:-mysql}
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-3306}
DB_DATABASE=${DB_DATABASE:-quartz}
DB_USERNAME=${DB_USERNAME:-quartz}
DB_PASSWORD=${DB_PASSWORD:-quartz_secret}

SESSION_DRIVER=${SESSION_DRIVER:-file}
SESSION_LIFETIME=120

CACHE_STORE=${CACHE_STORE:-file}
QUEUE_CONNECTION=${QUEUE_CONNECTION:-database}
FILESYSTEM_DISK=local

MAIL_MAILER=${MAIL_MAILER:-log}
MAIL_HOST=${MAIL_HOST:-}
MAIL_PORT=${MAIL_PORT:-587}
MAIL_USERNAME=${MAIL_USERNAME:-}
MAIL_PASSWORD=${MAIL_PASSWORD:-}
MAIL_ENCRYPTION=${MAIL_ENCRYPTION:-tls}
MAIL_FROM_ADDRESS=${MAIL_FROM_ADDRESS:-noreply@quartz.com}
MAIL_FROM_NAME="${MAIL_FROM_NAME:-Quartz Solutions}"

VITE_APP_NAME=${APP_NAME:-Quartz}
EOF
fi

# Generate app key if not set
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null; then
    php artisan key:generate --force
fi

# Wait for database
echo "Waiting for database..."
while ! php artisan db:monitor --databases=mysql > /dev/null 2>&1; do
    sleep 2
done
echo "Database is ready."

# Run migrations
php artisan migrate --force

# Seed if database is empty (first run)
USER_COUNT=$(php artisan tinker --execute="echo App\Models\User::count();" 2>/dev/null || echo "0")
if [ "$USER_COUNT" = "0" ]; then
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
