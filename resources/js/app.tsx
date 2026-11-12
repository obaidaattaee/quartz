import '@fontsource-variable/instrument-sans';
import '@fontsource-variable/inter';
import '@fontsource/almarai/arabic-300.css';
import '@fontsource/almarai/arabic-400.css';
import '@fontsource/almarai/arabic-700.css';
import '@fontsource/almarai/arabic-800.css';
import '@fontsource/fraunces/400.css';
import '@fontsource/fraunces/400-italic.css';
import '@fontsource/fraunces/500.css';
import '@fontsource/fraunces/600.css';
import '@fontsource/fraunces/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';

import { createInertiaApp } from '@inertiajs/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import PublicLayout from '@/layouts/public-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Quartz';

// SEO titles from the server already end in "| Quartz"; only brand titles
// that don't mention the app name yet (e.g. admin pages).
function formatTitle(title: string): string {
    if (!title) {
        return appName;
    }

    // The Arabic brand name counts as the app name too.
    return title.includes(appName) || title.includes('كوارتز')
        ? title
        : `${title} - ${appName}`;
}

createInertiaApp({
    title: formatTitle,
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('errors/'):
                return null;
            case name.startsWith('public/'):
                return PublicLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return <TooltipProvider delayDuration={0}>{app}</TooltipProvider>;
    },
    progress: {
        color: '#14B8A6',
    },
});

// This will set light / dark mode on load...
initializeTheme();
