# External Integrations

**Analysis Date:** 2026-03-28

## APIs & External Services

**Email Services:**
- Postmark - Email delivery service
  - SDK/Client: `laravel/framework` (built-in mailer)
  - Auth: `POSTMARK_API_KEY` (env var in `config/services.php`)

- Resend - Email API alternative
  - SDK/Client: `laravel/framework` (built-in mailer)
  - Auth: `RESEND_API_KEY` (env var in `config/services.php`)

- AWS SES - Amazon Simple Email Service
  - SDK/Client: `laravel/framework` (built-in mailer)
  - Auth: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` (env vars)
  - Region: `AWS_DEFAULT_REGION` (default: `us-east-1`)

**Notification Services:**
- Slack - Messaging platform for notifications
  - Auth: `SLACK_BOT_USER_OAUTH_TOKEN`
  - Channel: `SLACK_BOT_USER_DEFAULT_CHANNEL`
  - Config location: `config/services.php`

## Data Storage

**Databases:**
- **SQLite** (default for development)
  - Connection: Database file at `database/database.sqlite`
  - Client: Laravel Eloquent ORM
  - PDO driver for low-level operations

- **MySQL** (8.0+)
  - Connection: `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` env vars
  - Client: Laravel Eloquent ORM
  - PDO driver with SSL support configurable via `MYSQL_ATTR_SSL_CA`

- **MariaDB** (10.3+)
  - Connection: `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` env vars
  - Client: Laravel Eloquent ORM

- **PostgreSQL**
  - Connection: `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` env vars
  - Client: Laravel Eloquent ORM
  - SSL mode: `DB_SSLMODE` (default: `prefer`)

- **SQL Server** (Azure SQL compatible)
  - Connection: `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` env vars
  - Client: Laravel Eloquent ORM

**Core Tables:**
- `users` - User accounts with email, name, password, timestamps
- `password_reset_tokens` - Password reset token storage
- `sessions` - Session data storage
- `cache` - Cache table with TTL expiration
- `cache_locks` - Distributed locking for cache operations
- `jobs` - Queued jobs (if using database queue driver)

**File Storage:**
- Local filesystem only - `FILESYSTEM_DISK=local` default
- Alternative: AWS S3 (not currently configured)
  - Env vars present: `AWS_BUCKET`, `AWS_USE_PATH_STYLE_ENDPOINT`
  - Would require `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

**Caching:**
- **Database cache** (default) - Uses `cache` table
- **Redis** (alternative)
  - Connection: Redis client configured in `config/database.php`
  - Host: `REDIS_HOST` (default: `127.0.0.1`)
  - Port: `REDIS_PORT` (default: `6379`)
  - Password: `REDIS_PASSWORD` (optional)
  - Prefix: Automatically generated from app name
  - Client type: `REDIS_CLIENT` - PhpRedis (default: `phpredis`)
  - DB: Cache uses DB 1, Default uses DB 0

- **Memcached** (alternative)
  - Host: `MEMCACHED_HOST` (default: `127.0.0.1`)

## Authentication & Identity

**Auth Provider:** Custom/Built-in Laravel Authentication

**Implementation:**
- Laravel Fortify 1.34 - Authentication scaffolding
  - Location: `laravel/fortify` package
  - Configuration: `config/fortify.php`
  - Features enabled:
    - User registration
    - Password reset
    - Email verification
    - Two-factor authentication (2FA with TOTP)
  - Guard: Web guard (`config/auth.php`)
  - Username field: Email (configurable to username)
  - Redirect: `/dashboard` on successful auth

**Two-Factor Authentication (2FA):**
- TOTP-based (Time-based One-Time Password)
- Recovery codes for backup access
- Stored in `users` table:
  - `two_factor_secret` - Encrypted secret
  - `two_factor_recovery_codes` - Backup codes
  - `two_factor_confirmed_at` - Confirmation timestamp

**User Model:**
- Location: `app/Models/User.php`
- Traits:
  - `HasFactory` - Model factory for testing
  - `Notifiable` - Laravel notification support
  - `TwoFactorAuthenticatable` - Fortify 2FA support
- Hidden fields: `password`, `two_factor_secret`, `two_factor_recovery_codes`, `remember_token`
- Fillable: `name`, `email`, `password`

**Session Management:**
- Driver: Database-backed (default)
- Lifetime: 120 minutes (configurable via `SESSION_LIFETIME`)
- Storage: `sessions` table
- Encrypted: `SESSION_ENCRYPT=false` (default)
- Domain: Not restricted (`SESSION_DOMAIN=null`)

## Monitoring & Observability

**Error Tracking:**
- Collision 8.9 - Exception handler for PHPUnit (testing only)
- No external error tracking configured (e.g., Sentry, Rollbar)

**Logs:**
- **Approach:** Stack-based logging via Laravel
  - Channel: `LOG_CHANNEL=stack` (default)
  - Stack: `LOG_STACK=single` (single file)
  - Level: `LOG_LEVEL=debug` (default)
  - Deprecations channel: `null` (not logged)

**Debugging:**
- Laravel Pail 1.2.5 - Real-time log viewer and formatter
- Debug mode: `APP_DEBUG=true` (development only)
- Maintenance mode: File-based driver (`APP_MAINTENANCE_DRIVER=file`)

## CI/CD & Deployment

**Hosting:**
- Not configured - Framework-agnostic setup
- Supports: Traditional servers, Laravel Sail (Docker), cloud platforms

**CI Pipeline:**
- GitHub Actions (`.github/` directory present)
- No CI configuration visible yet

**Deployment:**
- Vite builds assets to `public` directory
- Laravel serves via public/index.php or web server
- Database migrations via `php artisan migrate`
- Asset compilation via `npm run build` (Vite)

## Environment Configuration

**Required env vars:**
- `APP_NAME` - Application name (default: `Laravel`)
- `APP_ENV` - Environment (local, production, testing)
- `APP_KEY` - Encryption key (generated via `php artisan key:generate`)
- `APP_DEBUG` - Debug mode toggle
- `APP_URL` - Application URL (for URL generation)
- `DB_CONNECTION` - Database driver
- `DB_DATABASE` - Database name/path
- `MAIL_MAILER` - Mail driver (log, postmark, resend, ses)

**Optional but Recommended:**
- `POSTMARK_API_KEY` - For Postmark email
- `RESEND_API_KEY` - For Resend email
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION` - For AWS SES/S3
- `SLACK_BOT_USER_OAUTH_TOKEN`, `SLACK_BOT_USER_DEFAULT_CHANNEL` - For Slack notifications

**Database Specifics:**
- SQLite: `DB_DATABASE=database/database.sqlite`
- MySQL/MariaDB/PostgreSQL/SQL Server: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`

**Secrets Location:**
- `.env` file (not committed to git, see `.gitignore`)
- `.env.example` - Template for required variables
- Secrets are loaded by Laravel's env() helper at runtime
- No secrets vault integration (e.g., HashiCorp Vault, AWS Secrets Manager)

## Webhooks & Callbacks

**Incoming Webhooks:**
- Not configured - No webhook endpoints visible

**Outgoing Webhooks:**
- Not configured - No outgoing webhook implementations visible

**Available but Unused:**
- Queue system (`QUEUE_CONNECTION=database`) supports queued notifications and jobs
- Broadcast system (`BROADCAST_CONNECTION=log`) available but not configured

## API Endpoints

**Frontend-Backend Communication:**
- Inertia.js adapter handles all routing and data passing
- Routes defined in `routes/web.php` and `routes/settings.php`
- Public routes: `/` (welcome page)
- Protected routes: `/dashboard` (requires authentication and email verification)
- Settings routes: Profile and security management

**No REST/GraphQL API:**
- Application is server-side rendered via Inertia (SSR capable)
- No explicit API routes in `routes/api.php` configuration

---

*Integration audit: 2026-03-28*
