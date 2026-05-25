import type { ReactNode } from 'react';

import LandingFooter from '@/components/landing-b/landing-footer';
import LandingNav from '@/components/landing-b/landing-nav';
import { B } from '@/components/landing-b/tokens';
import WebMcpTools from '@/components/web-mcp-tools';
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
                // Defensive: any descendant that overflows (e.g. the logos
                // marquee, decorative oversized SVGs) must not extend the
                // document's scrollable width. `clip` is preferred over
                // `hidden` because it doesn't create a new scroll container.
                overflowX: 'clip',
            }}
        >
            <a
                href="#main"
                className="q-skip-link"
                style={{
                    // Standard "visually hidden" pattern — works the same in
                    // LTR and RTL, doesn't add to the document scroll area
                    // (left:-9999px does in RTL).
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    padding: 0,
                    margin: -1,
                    overflow: 'hidden',
                    clip: 'rect(0,0,0,0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                    background: B.accent,
                    color: B.bg,
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: 'none',
                    zIndex: 100,
                }}
                onFocus={(e) => {
                    Object.assign(e.currentTarget.style, {
                        width: 'auto',
                        height: 'auto',
                        padding: '10px 16px',
                        margin: 0,
                        overflow: 'visible',
                        clip: 'auto',
                        insetInlineStart: '16px',
                        top: '12px',
                    });
                }}
                onBlur={(e) => {
                    Object.assign(e.currentTarget.style, {
                        width: '1px',
                        height: '1px',
                        padding: '0',
                        margin: '-1px',
                        overflow: 'hidden',
                        clip: 'rect(0,0,0,0)',
                        insetInlineStart: 'auto',
                    });
                }}
            >
                {skipLabel}
            </a>
            <LandingNav />
            <main id="main">{children}</main>
            <LandingFooter />
            <WebMcpTools />
        </div>
    );
}
