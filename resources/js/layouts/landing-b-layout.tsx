import type { ReactNode } from 'react';

import LandingFooter from '@/components/landing-b/landing-footer';
import LandingNav from '@/components/landing-b/landing-nav';
import { B } from '@/components/landing-b/tokens';
import { useLocale } from '@/hooks/use-locale';

type Props = {
    children: ReactNode;
};

export default function LandingBLayout({ children }: Props) {
    const { isRTL } = useLocale();
    const skipLabel = isRTL ? 'تخطَّ إلى المحتوى' : 'Skip to content';

    return (
        <div
            className="public-theme"
            style={{
                background: B.bg,
                color: B.cream,
                minHeight: '100vh',
                fontFamily: B.sans,
            }}
        >
            <a
                href="#main"
                className="q-skip-link"
                style={{
                    position: 'absolute',
                    left: -9999,
                    top: 12,
                    background: B.accent,
                    color: B.bg,
                    padding: '10px 16px',
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: 'none',
                    zIndex: 100,
                }}
                onFocus={(e) => {
                    e.currentTarget.style.left = '16px';
                }}
                onBlur={(e) => {
                    e.currentTarget.style.left = '-9999px';
                }}
            >
                {skipLabel}
            </a>
            <LandingNav />
            <main id="main">{children}</main>
            <LandingFooter />
        </div>
    );
}
