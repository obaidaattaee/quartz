import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';

import { B } from '@/components/landing-b/tokens';
import { useLocale } from '@/hooks/use-locale';

type PublicTheme = 'dark' | 'light';

const STORAGE_KEY = 'qz-public-theme';

// The public site is dark by default. The choice is stored per visitor and
// applied before first paint by the inline script in app.blade.php.
export function applyPublicTheme(theme: PublicTheme): void {
    if (theme === 'light') {
        document.documentElement.dataset.publicTheme = 'light';
    } else {
        delete document.documentElement.dataset.publicTheme;
    }

    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // Storage can be unavailable (private mode); the toggle still works for this page.
    }
}

function subscribe(onChange: () => void): () => void {
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-public-theme'],
    });

    return () => observer.disconnect();
}

function getSnapshot(): PublicTheme {
    return document.documentElement.dataset.publicTheme === 'light'
        ? 'light'
        : 'dark';
}

function getServerSnapshot(): PublicTheme {
    return 'dark';
}

export default function PublicThemeToggle() {
    const { isRTL } = useLocale();
    const theme = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot,
    );

    const next: PublicTheme = theme === 'dark' ? 'light' : 'dark';
    const label = isRTL
        ? next === 'light'
            ? 'التبديل إلى الوضع الفاتح'
            : 'التبديل إلى الوضع الداكن'
        : next === 'light'
          ? 'Switch to light theme'
          : 'Switch to dark theme';
    const Icon = theme === 'dark' ? Sun : Moon;

    return (
        <button
            type="button"
            onClick={() => applyPublicTheme(next)}
            aria-label={label}
            title={label}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                background: 'transparent',
                color: B.cream,
                border: `1px solid ${B.line}`,
                cursor: 'pointer',
            }}
        >
            <Icon size={16} aria-hidden="true" />
        </button>
    );
}
