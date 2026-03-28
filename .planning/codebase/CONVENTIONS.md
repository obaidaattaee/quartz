# Coding Conventions

**Analysis Date:** 2026-03-28

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `AppShell.tsx`, `DeleteUser.tsx`)
- Hooks: lowercase kebab-case with `use-` prefix (e.g., `use-clipboard.ts`, `use-appearance.tsx`)
- Utility/helper files: lowercase kebab-case (e.g., `input-error.tsx`)
- Type definition files: lowercase (e.g., `auth.ts`, `ui.ts`, `navigation.ts`)
- UI component library exports: PascalCase wrapping primitive names (e.g., `Sidebar`, `Dialog`, `Button`)

**Functions:**
- React functional components: PascalCase (e.g., `AppLogo`, `AppShell`, `DeleteUser`)
- Custom hooks: starts with `use`, camelCase (e.g., `useAppearance()`, `useTwoFactorAuth()`)
- Utility functions: camelCase (e.g., `cn()`, `toUrl()`, `isDarkMode()`)
- Event handlers: camelCase starting with `on` or descriptive verb (e.g., `onError`, `handleSystemThemeChange()`)

**Variables:**
- State variables: camelCase (e.g., `currentAppearance`, `copiedText`, `qrCodeSvg`)
- Constants: UPPER_SNAKE_CASE (e.g., `OTP_MAX_LENGTH = 6`)
- Props objects: camelCase properties (e.g., `breadcrumbs`, `variant`, `className`)
- Ref objects: camelCase with `Input` or element suffix (e.g., `passwordInput`)

**Types:**
- Type/interface names: PascalCase (e.g., `AppShellProps`, `UseAppearanceReturn`, `User`, `Auth`)
- Exported from barrel files with `type` keyword: `export type * from './auth'`
- React props: named as `Props` or descriptive (e.g., `type Props = { children: ReactNode }`)
- Generic type parameters: Single letter or descriptive (e.g., `T`, `CopiedValue`)

## Code Style

**Formatting:**
- Prettier 3.4.2 enforces formatting
- Print width: 80 characters
- Tab width: 4 spaces (2 for YAML files)
- Semicolons: Always included
- Single quotes: Enforced for strings
- JSX: Single attribute per line is disabled (multiple attributes on one line allowed)

**Linting:**
- ESLint v9.17.0 with flat config
- TypeScript ESLint recommended rules
- React plugin with jsx-runtime (React 17+)
- React Hooks rules enabled
- Import ordering enforced
- Strict TypeScript checking

**Key ESLint Rules:**
- `@typescript-eslint/consistent-type-imports`: Type imports separated (`import type`)
- `import/order`: Alphabetically ordered imports (builtin → external → internal → parent → sibling → index)
- `@stylistic/brace-style`: 1tbs (one true brace style), no single-line blocks
- `@stylistic/padding-line-between-statements`: Blank lines around control statements (if, return, for, while, etc.)
- React prop-types: Disabled (TypeScript handles validation)
- `@typescript-eslint/no-explicit-any`: Disabled (allows any type if necessary)

## Import Organization

**Order:**
1. React/external libraries (e.g., `import { useSyncExternalStore } from 'react'`)
2. Inertia imports (e.g., `import { usePage } from '@inertiajs/react'`)
3. Third-party UI libraries (e.g., `import { BookOpen } from 'lucide-react'`)
4. Internal components (e.g., `import AppLogo from '@/components/app-logo'`)
5. Internal utilities and hooks (e.g., `import { useCurrentUrl } from '@/hooks/use-current-url'`)
6. Type imports at the top, separated (e.g., `import type { BreadcrumbItem }`)

**Path Aliases:**
- `@/*` maps to `./resources/js/*`
- Used consistently throughout (no relative imports like `../`)
- Supports TypeScript module resolution via `tsconfig.json` paths configuration

**Example:**
```typescript
import { useSyncExternalStore } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
```

## Error Handling

**Patterns:**
- Try-catch blocks wrap async operations (e.g., `fetchQrCode()`, `fetchSetupKey()`)
- Errors collected in state arrays: `const [errors, setErrors] = useState<string[]>([])`
- Error messages are user-friendly strings appended to error state
- Catch blocks don't re-throw; they set state with descriptive messages
- Validation errors displayed via `InputError` component with `message` prop
- No error logging to console; handled silently with user feedback

**Example from `use-two-factor-auth.ts`:**
```typescript
const fetchQrCode = useCallback(async (): Promise<void> => {
    try {
        const { svg } = (await submit(qrCode())) as {
            svg: string;
            url: string;
        };
        setQrCodeSvg(svg);
    } catch {
        setErrors((prev) => [...prev, 'Failed to fetch QR code']);
        setQrCodeSvg(null);
    }
}, [submit]);
```

## Logging

**Framework:** `console` methods (warn, log)

**Patterns:**
- `console.warn()` used for recoverable issues (e.g., clipboard API unavailable in `use-clipboard.ts`)
- No error-level logging in catch blocks
- Warnings provided with context: `console.warn('Clipboard not supported')`
- Client-side only; no backend logging configuration in frontend code

## Comments

**When to Comment:**
- Credit/attribution for borrowed code (e.g., `// Credit: https://usehooks-ts.com/`)
- Inline comments for complex logic or non-obvious intent
- JSDoc rarely used; TypeScript types provide documentation

**No JSDoc/TSDoc:**
- Types and function signatures are self-documenting via TypeScript
- Props documentation implicit through type definitions
- Return types explicitly declared

## Function Design

**Size:** Small, focused functions. Examples:
- `cn()`: 2 lines (utility wrapper)
- `isDarkMode()`: 1 line (boolean check)
- Component functions: 15-40 lines typically; larger components break into smaller pieces

**Parameters:**
- React components: Single `Props` type parameter or destructured inline
- Utilities: Explicit typed parameters (e.g., `text: string`, `days = 365`)
- Callbacks: Full type annotations (e.g., `callback: () => void`)

**Return Values:**
- Components: JSX or null (conditional renders return null)
- Hooks: Typed objects returned with `as const` for tuple immutability (e.g., `useClipboard()` returns `[CopiedValue, CopyFn]`)
- Async functions: Always return `Promise<T>`; void for set-state operations

**Example from `use-clipboard.ts`:**
```typescript
export type UseClipboardReturn = [CopiedValue, CopyFn];

export function useClipboard(): UseClipboardReturn {
    const [copiedText, setCopiedText] = useState<CopiedValue>(null);
    const copy: CopyFn = async (text) => { /* ... */ };
    return [copiedText, copy];
}
```

## Module Design

**Exports:**
- Default exports for components (e.g., `export default function AppLogo()`)
- Named exports for utility functions (e.g., `export function useAppearance()`)
- Barrel files re-export all types (e.g., `resources/js/types/index.ts`)
- Functions exported with explicit return types

**Barrel Files:**
- `resources/js/types/index.ts`: Re-exports all types with `export type * from './module'`
- Enables centralized type imports: `import type { User } from '@/types'`

**Module Structure Pattern:**
- Component file: Imports, type definitions, component logic, inline styles
- Hook file: Type definitions at top, helper functions, main hook export
- Type file: Type/interface definitions only
- Utility file: Utility functions, no state

## Testing Attributes

**Data Test IDs:**
- Used sparingly: `data-test="update-profile-button"`
- Applied to critical user interaction elements
- Pattern: kebab-case, descriptive of action or element purpose
- Example locations: `resources/js/pages/settings/profile.tsx`, `resources/js/components/delete-user.tsx`

---

*Convention analysis: 2026-03-28*
