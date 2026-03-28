# Testing Patterns

**Analysis Date:** 2026-03-28

## Test Framework

**Runner:**
- PHPUnit (Backend testing only)
- Config: `/Users/eagle/Downloads/personal-project/Ahmed/phpunit.xml`

**Assertion Library:**
- PHPUnit's built-in assertions (`$this->assertOk()`, `$this->assertTrue()`, etc.)
- Laravel test helpers (`$this->get()`, `$this->post()`, `$this->actingAs()`)

**Run Commands:**
```bash
php artisan test              # Run all tests
php artisan test --filter=TestName  # Run specific test
php artisan test --parallel   # Run tests in parallel
```

**Note:** No JavaScript/TypeScript test framework detected (Jest, Vitest, etc.). Frontend code currently untested via automated tests.

## Test File Organization

**Location:**
- Tests separated from source code in `/tests/` directory
- Frontend code (`resources/js/`) has no corresponding test files

**Naming:**
- Classes: PascalCase with `Test` suffix (e.g., `AuthenticationTest.php`, `DashboardTest.php`)
- Methods: `test_` prefix, snake_case description (e.g., `test_users_can_authenticate_using_the_login_screen`)
- Namespaces: `Tests\Feature\*` or `Tests\Unit\*`

**Structure:**
```
tests/
├── Feature/
│   ├── Auth/
│   │   ├── AuthenticationTest.php
│   │   ├── EmailVerificationTest.php
│   │   ├── PasswordConfirmationTest.php
│   │   ├── PasswordResetTest.php
│   │   ├── RegistrationTest.php
│   │   ├── TwoFactorChallengeTest.php
│   │   └── VerificationNotificationTest.php
│   ├── Settings/
│   │   ├── ProfileUpdateTest.php
│   │   └── SecurityTest.php
│   ├── DashboardTest.php
│   └── ExampleTest.php
├── Unit/
│   └── ExampleTest.php
└── TestCase.php
```

## Test Structure

**Suite Organization:**
- Features grouped by domain: `Auth/`, `Settings/`
- Feature tests: Integration tests that test full application flow
- Unit tests: (minimal; mostly feature-driven development)

**Patterns:**

### Test Class Pattern:
```php
namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_authenticate_using_the_login_screen()
    {
        // Arrange
        $user = User::factory()->create();

        // Act
        $response = $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'password',
        ]);

        // Assert
        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }
}
```

**Setup:**
- Each test class extends `TestCase` base class (`/Users/eagle/Downloads/personal-project/Ahmed/tests/TestCase.php`)
- `RefreshDatabase` trait used to reset database state between tests
- Database: SQLite in-memory (`:memory:`) per `phpunit.xml` configuration

**Teardown:**
- Automatic via `RefreshDatabase` trait; no manual cleanup needed
- Each test starts with fresh database schema

**Assertion Pattern:**
- Laravel's fluent assertion methods on response objects
- Direct assertions on authentication state: `$this->assertAuthenticated()`, `$this->assertGuest()`

## Mocking

**Framework:** Laravel's factory pattern and built-in mocking (no external mock library)

**Patterns:**

### Model Factories:
```php
$user = User::factory()->create();
```
- Creates actual database records for feature tests
- Full integration; not mocked

### Custom Test Helpers:
```php
// From TestCase.php
protected function skipUnlessFortifyHas(string $feature, ?string $message = null): void
{
    if (! Features::enabled($feature)) {
        $this->markTestSkipped($message ?? "Fortify feature [{$feature}] is not enabled.");
    }
}
```
- Used to conditionally skip tests based on feature flags
- Example: Two-factor authentication tests check if feature is enabled before running

### Example Conditional Test:
```php
public function test_users_with_two_factor_enabled_are_redirected_to_two_factor_challenge()
{
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $user = User::factory()->create();
    $user->forceFill([
        'two_factor_secret' => encrypt('test-secret'),
        'two_factor_recovery_codes' => encrypt(json_encode(['code1', 'code2'])),
        'two_factor_confirmed_at' => now(),
    ])->save();

    // ... assertions
}
```

**What to Mock:**
- Feature flags when testing optional functionality
- Sensitive data (secrets, recovery codes) via data manipulation before assertions
- Rate limiting via `RateLimiter::increment()` to simulate rate-limited state

**What NOT to Mock:**
- User models (created via factory)
- HTTP requests (tested via `$this->get()`, `$this->post()`)
- Database operations (use real SQLite in-memory DB)
- Authentication helpers (use `$this->actingAs()` helper)

## Fixtures and Test Data

**Test Data:**
- Model factories (e.g., `User::factory()->create()`)
- Located in: Laravel's default factory directory (likely `database/factories/`)
- No explicit fixtures; factories generate fresh data per test

**Pattern:**
```php
$user = User::factory()
    ->create([
        'email' => 'specific@example.com',
        'name' => 'Test User',
    ]);
```

**Testing Encrypted Data:**
```php
$user->forceFill([
    'two_factor_secret' => encrypt('test-secret'),
    'two_factor_recovery_codes' => encrypt(json_encode(['code1', 'code2'])),
])->save();
```
- Direct attribute assignment for sensitive test data
- Uses Laravel's encryption helpers

## Coverage

**Requirements:** Not enforced; no coverage config in `phpunit.xml`

**View Coverage:**
```bash
php artisan test --coverage
```

## Test Types

**Feature Tests:**
- Path: `tests/Feature/`
- Scope: Full HTTP request/response cycle
- Tools: `$this->get()`, `$this->post()`, authentication assertions
- Examples: `AuthenticationTest.php`, `DashboardTest.php`, `PasswordResetTest.php`
- Coverage: Authentication flows, protected routes, form submissions, redirects

**Unit Tests:**
- Path: `tests/Unit/`
- Minimal usage; mostly placeholder
- Example: `ExampleTest.php` (basic assertion example)

**Integration Tests:**
- Tested via Feature tests (Laravel convention)
- Include database interactions, authentication, form validation

**E2E Tests:**
- Not detected in codebase
- Frontend interactions not covered by automated tests
- Manual testing or future implementation needed

## Common Patterns

### HTTP Request Testing:
```php
$response = $this->get(route('dashboard'));
$response->assertOk();

$response = $this->post(route('login.store'), [
    'email' => $user->email,
    'password' => 'password',
]);
```

### Authentication Testing:
```php
$this->actingAs($user)->post(route('logout'));
$this->assertGuest();

$this->assertAuthenticated();
```

### Rate Limiting:
```php
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::increment(md5('login'.implode('|', [$user->email, '127.0.0.1'])), amount: 5);
$response = $this->post(route('login.store'), [...]);
$response->assertTooManyRequests();
```

### Error State Testing:
```php
$response = $this->post(route('login.store'), [
    'email' => $user->email,
    'password' => 'wrong-password',
]);

$this->assertGuest();
```

## Configuration

**Environment Variables (Testing):**
- Defined in `phpunit.xml` `<php>` section
- Database: SQLite in-memory (`:memory:`)
- Mail: Array driver (in-memory)
- Cache: Array store
- Queue: Sync driver (immediate execution)
- Session: Array driver (in-memory)

**Key Test Environment Settings:**
```xml
<env name="APP_ENV" value="testing"/>
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
<env name="MAIL_MAILER" value="array"/>
<env name="CACHE_STORE" value="array"/>
<env name="QUEUE_CONNECTION" value="sync"/>
```

## Frontend Testing Gap

**Current State:**
- Zero automated tests for React/TypeScript code
- No Jest, Vitest, or other JavaScript test runner configured
- Frontend code in `resources/js/` has no `.test.ts`, `.spec.tsx` files

**Components Without Tests:**
- All React components (e.g., `AppShell`, `DeleteUser`, `AppHeader`)
- All custom hooks (e.g., `useAppearance`, `useTwoFactorAuth`, `useClipboard`)
- All utilities (e.g., `cn()`, `toUrl()`)

**Testing Attributes Present:**
- `data-test` attributes exist in some components for future E2E testing
- Examples: `data-test="update-profile-button"` in `resources/js/pages/settings/profile.tsx`
- Not currently used by any test runner

---

*Testing analysis: 2026-03-28*
