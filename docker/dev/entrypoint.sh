#!/bin/sh
set -e
cd /var/www/html

# ---- .env bootstrap ---------------------------------------------------------
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
    else
        touch .env
    fi
fi

# ---- Composer autoloader ----------------------------------------------------
# The image installs vendor/ with --no-autoloader because app/ is only
# bind-mounted at runtime, so the autoloader is generated here on first boot
# of a fresh vendor volume.
if [ ! -f vendor/autoload.php ]; then
    composer dump-autoload --no-interaction
fi

if ! grep -q "^APP_KEY=base64:" .env 2>/dev/null; then
    php artisan key:generate --force --no-interaction || true
fi

# ---- Writable dirs ----------------------------------------------------------
mkdir -p \
    storage/logs \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    bootstrap/cache

# Bind-mount on macOS/Linux can land with unexpected owners; force permissive
# in dev so nginx worker and php-fpm worker (both www-data) can always write.
chmod -R 0777 storage bootstrap/cache 2>/dev/null || true

# ---- Public storage link ----------------------------------------------------
# Relative so it resolves both in the container and in the host checkout.
if [ ! -e public/storage ]; then
    ln -s ../storage/app/public public/storage
fi

# ---- Clear any stale caches (dev should never run cached config/routes) -----
php artisan config:clear  >/dev/null 2>&1 || true
php artisan route:clear   >/dev/null 2>&1 || true
php artisan view:clear    >/dev/null 2>&1 || true
php artisan cache:clear   >/dev/null 2>&1 || true

exec "$@"
