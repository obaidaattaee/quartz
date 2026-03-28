# Codebase Concerns

**Analysis Date:** 2026-03-28

## Security Issues

**XSS Vulnerability in QR Code Rendering:**
- Issue: `dangerouslySetInnerHTML` used without sanitization in `resources/js/components/two-factor-setup-modal.tsx` (line 81)
- Files: `resources/js/components/two-factor-setup-modal.tsx`
- Risk: QR code SVG from backend could be compromised if backend is vulnerable to injection attacks
- Current mitigation: Relies on backend to generate safe SVG
- Recommendation: Use a safe SVG parser or QR code library component instead of `dangerouslySetInnerHTML`. Consider: `npm install qrcode.react` or similar dedicated QR component

**Cookie Security - Missing HttpOnly and Secure Flags:**
- Issue: Client-side cookie setting in multiple places without proper security headers
- Files: `resources/js/hooks/use-appearance.tsx` (line 29), `resources/js/components/ui/sidebar.tsx` (line 84)
- Risk: Cookies can be accessed by JavaScript, increasing XSS impact
- Current mitigation: Inertia middleware also sets cookies server-side
- Recommendation: Ensure all sensitive cookies (especially those set from frontend) have `HttpOnly` and `Secure` flags. Move cookie setting to middleware exclusively

**Two-Factor Secret Storage:**
- Issue: `two_factor_secret` stored as plain `text` column in database
- Files: `database/migrations/2025_08_14_170933_add_two_factor_columns_to_users_table.php`
- Risk: Database breach exposes 2FA secrets
- Current mitigation: Laravel Fortify handles encryption via User model attributes
- Recommendation: Verify that secrets are encrypted using Laravel's `encryptable` attribute, not just stored as plain text. Check `app/Models/User.php` for encryption configuration

## Performance Bottlenecks

**Large Sidebar Component:**
- Problem: `resources/js/components/ui/sidebar.tsx` is 719 lines - monolithic component
- Files: `resources/js/components/ui/sidebar.tsx`
- Cause: All sidebar UI, state management, keyboard shortcuts, and animation logic in single file
- Impact: Difficult to test, maintain, and potentially creates unnecessary re-renders
- Improvement path: Break into smaller components (SidebarContext, SidebarMenu, SidebarToggle, etc.) following compound component pattern

**Welcome Page Complexity:**
- Problem: `resources/js/pages/welcome.tsx` is 400 lines with extensive inline HTML
- Files: `resources/js/pages/welcome.tsx`
- Cause: Heavy inlined styling and repetitive HTML structure
- Impact: Harder to maintain, larger bundle impact
- Improvement path: Extract UI components for marketing sections, use CSS modules for styling

**Two-Factor Setup Modal - Multiple Render Branches:**
- Problem: Complex conditional rendering in `resources/js/components/two-factor-setup-modal.tsx`
- Files: `resources/js/components/two-factor-setup-modal.tsx`
- Cause: Modal handles multiple states (setup, verification, enabled), each with different UI
- Impact: More branching paths = more bugs, harder to test
- Improvement path: Extract into separate components or use state machine pattern

**Promise.all() Race Conditions:**
- Problem: `fetchSetupData()` in `resources/js/hooks/use-two-factor-auth.ts` uses Promise.all without error handling
- Files: `resources/js/hooks/use-two-factor-auth.ts` (lines 87-95)
- Cause: Both `fetchQrCode()` and `fetchSetupKey()` can fail, but errors are silently caught
- Impact: If one fails, both qr and key state reset without user knowing which failed
- Improvement path: Handle individual promise rejections, provide specific error messages per endpoint

## Fragile Areas

**Two-Factor Authentication Flow:**
- Files: `resources/js/components/two-factor-setup-modal.tsx`, `resources/js/hooks/use-two-factor-auth.ts`, `app/Http/Controllers/Settings/SecurityController.php`
- Why fragile: Multiple steps across frontend/backend with ref-based state management (useRef), Promise-based async flow, and modal state coordination
- Safe modification: Any changes to 2FA flow require testing all paths: enable → QR scan → confirm, enable with recovery codes, disable, recovery code regeneration
- Test coverage: `tests/Feature/Settings/SecurityTest.php` (129 lines) covers main flows but missing edge cases
- Gaps: No test for failed QR fetch + manual key fallback, no test for concurrent 2FA requests, no test for state reset on modal close

**Profile Update with Email Change:**
- Files: `app/Http/Controllers/Settings/ProfileController.php`, `app/Concerns/ProfileValidationRules.php`
- Why fragile: Email change triggers `email_verified_at` reset (line 35-37 in ProfileController)
- Safe modification: Changes to email validation or verification flow could break email uniqueness, email verification email sending, or session state
- Test coverage: `tests/Feature/Settings/ProfileUpdateTest.php` (99 lines) covers basic update but may not test verification edge cases
- Gaps: No test for rapid email changes, no test for changing to already-used email (should fail validation)

**Password Update Validation Chain:**
- Files: `app/Http/Requests/Settings/PasswordUpdateRequest.php`, `app/Concerns/PasswordValidationRules.php`, `app/Http/Controllers/Settings/SecurityController.php`
- Why fragile: Uses `current_password` rule (Laravel built-in) which depends on user session state
- Safe modification: Touching validation rules or password hashing algorithm requires retesting. Current password verification could fail silently if hash algorithm changes
- Test coverage: `tests/Feature/Settings/SecurityTest.php` covers password update
- Gaps: No explicit test for password confirmation mismatch, no test for transition between password hashing algorithms

**Middleware Order for Settings Routes:**
- Files: `routes/settings.php`
- Why fragile: Profile delete (line 15) requires both `auth` and `verified`, but profile edit (line 10) only needs `auth`
- Safe modification: Any changes to email verification flow could accidentally allow unverified users to delete accounts
- Risk: Current code is correct (delete requires verified), but inconsistency could lead to bugs
- Recommendation: Add explicit comment explaining why delete is more restricted, or extract to separate route group

## Test Coverage Gaps

**Missing API Response Validation:**
- What's not tested: Two-factor API endpoints don't have explicit tests for response payload structure
- Files: No dedicated tests for endpoints returning QR code, secret key, recovery codes
- Risk: Backend could change response format and break frontend without detection
- Priority: Medium - Critical for two-factor flow

**Missing Browser Compatibility Tests:**
- What's not tested: Theme switching with system preference changes, sidebar keyboard shortcuts (Cmd+B), mobile sidebar behavior
- Files: `resources/js/hooks/use-appearance.tsx`, `resources/js/components/ui/sidebar.tsx`, hooks for mobile detection
- Risk: CSS media queries or keyboard event handling could break on edge cases
- Priority: Low - Not critical for functionality

**Missing Concurrent Operation Tests:**
- What's not tested: What happens if user submits password change while 2FA setup is in progress? Or rapid clicks on enable/disable 2FA?
- Files: Race conditions between `resources/js/components/two-factor-setup-modal.tsx` and security controller
- Risk: State inconsistency if concurrent requests complete out of order
- Priority: High - Could cause data integrity issues

**Profile Deletion Edge Cases:**
- What's not tested: User logged out mid-deletion, deletion with active 2FA, rapid deletion attempts
- Files: `app/Http/Controllers/Settings/ProfileController.php` destroy method
- Risk: Orphaned sessions, incomplete 2FA cleanup, rate limiting bypass
- Priority: Medium - Affects critical operation

## Known Issues

**React Compiler Warning Potential:**
- Issue: Babel `react-compiler` plugin enabled in vite config but not all components optimized
- Files: `vite.config.ts` (line 17), all React components
- Symptom: Some components may not get compiler optimization benefits
- Recommendation: Review `eslint-plugin-react-compiler` rules, ensure all components follow optimization patterns

**Sidebar State Not Persisted on Server:**
- Issue: Sidebar state stored in cookie (`sidebar_state`) and Inertia props, but mismatch could occur
- Files: `resources/js/components/ui/sidebar.tsx` (line 84), `app/Http/Middleware/HandleInertiaRequests.php` (line 44)
- Symptom: Sidebar state differs between page loads if cookie and backend state diverge
- Impact: User sees sidebar in different state on page refresh in edge cases
- Workaround: Middleware provides initial state from cookie, frontend keeps in sync

**Appearance Consistency:**
- Issue: Theme managed in both localStorage and cookie, potential for divergence
- Files: `resources/js/hooks/use-appearance.tsx`
- Symptom: If localStorage and cookie get out of sync, theme could flash
- Current mitigation: Both updated together in `updateAppearance()`, server also validates
- Recommendation: Use single source of truth - either rely on cookie (server) or localStorage (client), not both

## Scaling Limits

**User Table Growth:**
- Current capacity: Database design supports unlimited users (standard Laravel setup)
- No explicit indexes on email beyond unique constraint
- Limit: When user base exceeds 100k+, queries without specific optimization could slow down
- Scaling path: Add indexes on frequently queried columns (email_verified_at, two_factor_confirmed_at), consider user activity table for analytics

**Two-Factor Secret Encryption:**
- Current capacity: No per-user encryption key rotation
- Limit: If encryption key is compromised, all user 2FA secrets exposed at once
- Scaling path: Implement key rotation strategy, per-user key derivation, or hardware security module integration for production

**API Rate Limiting:**
- Current: Fixed 5 requests/minute for 2FA attempts and login
- Files: `app/Providers/FortifyServiceProvider.php` (lines 81-89)
- Limit: No per-endpoint tuning, same rate for QR generation and code verification (different security implications)
- Recommendation: Different limits for each endpoint (QR generation could be more generous, verification stricter)

## Missing Critical Features

**Audit Logging:**
- Problem: No logging of security-sensitive operations (password changes, 2FA enable/disable, profile deletion)
- Impact: Can't track who did what when for compliance or forensics
- Files: No audit log table or logging in `app/Http/Controllers/Settings/*`
- Recommendation: Create audit_logs table, log all sensitive operations with user ID, timestamp, operation type, IP address

**Account Lockout:**
- Problem: No account lockout after failed password attempts (only rate limiting)
- Impact: Brute force attacks can continue with increasing sophistication
- Files: Missing from `app/Providers/FortifyServiceProvider.php`
- Recommendation: Track failed attempts per user, lock account after N failures, require admin unlock or email verification

**Email Verification Notification:**
- Problem: Profile update with email change doesn't trigger verification email
- Files: `app/Http/Controllers/Settings/ProfileController.php` (line 36 resets but doesn't notify)
- Impact: User can change email to non-existent address indefinitely
- Recommendation: Add `sendEmailVerificationNotification()` when email changes

**Session Management:**
- Problem: No way to view active sessions or log out other devices
- Files: No session listing in security settings
- Impact: User can't detect unauthorized access or revoke old sessions
- Recommendation: Add session tracking, allow invalidating specific sessions from settings

## Dependencies at Risk

**React 19:**
- Risk: Version 19.2.0 is very recent, still stabilizing. React Compiler is experimental
- Impact: Breaking changes in minor releases possible
- Files: `package.json` (line 59)
- Migration plan: Pin to ^19.2.0 with regular testing, monitor React release notes, have downgrade plan to 18.x

**Vite 8:**
- Risk: Major version, some plugins may have compatibility issues
- Impact: Build failures with dependency updates
- Files: `package.json` (line 65)
- Migration plan: Monitor Vite release notes, test builds regularly, have rollback commit ready

**Laravel 13:**
- Risk: Cutting edge Laravel version, may have undiscovered issues
- Impact: Security patches slower, fewer community solutions
- Files: `composer.json` (line 15)
- Recommendation: Consider using LTS version (11.x) for production stability

**TypeScript 5.7:**
- Risk: Recent version, may have edge cases in type checking
- Impact: Type errors could appear after updates
- Files: `package.json` (line 64)
- Mitigation: `npm run types:check` in CI catches these, recommend running before commits

---

*Concerns audit: 2026-03-28*
