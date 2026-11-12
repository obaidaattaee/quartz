import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import LanguageSwitcher from '@/components/language-switcher';
import PublicThemeToggle from '@/components/public-theme-toggle';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useLocale } from '@/hooks/use-locale';
import { B } from './tokens';

type NavLink = {
    key: string;
    href: string;
    label: string;
};

export default function LandingNav() {
    const { locale, isRTL, t } = useLocale();
    const [open, setOpen] = useState(false);

    const links: NavLink[] = [
        {
            key: 'services',
            href: `/${locale}/services`,
            label: t('nav.services') || 'Services',
        },
        {
            key: 'work',
            href: `/${locale}/portfolio`,
            label: t('nav.work') || 'Work',
        },
        {
            key: 'industries',
            href: `/${locale}/industries`,
            label: t('nav.industries') || 'Industries',
        },
        {
            key: 'blog',
            href: `/${locale}/blog`,
            label: t('nav.blog') || 'Blog',
        },
        {
            key: 'about',
            href: `/${locale}/about`,
            label: t('nav.about') || 'About',
        },
    ];

    const ctaLabel = t('nav.ctaShort') || 'Request a call';
    const arrow = isRTL ? '↖' : '↗';

    const navLabel = isRTL ? 'التنقّل الرئيسي' : 'Primary navigation';
    const menuLabel = isRTL ? 'القائمة' : 'Menu';
    const closeLabel = isRTL ? 'إغلاق القائمة' : 'Close menu';

    return (
        <nav
            aria-label={navLabel}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '22px clamp(16px, 4vw, 48px)',
                position: 'sticky',
                top: 0,
                zIndex: 40,
                background: 'var(--q-nav-bg)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderBottom: `1px solid ${B.line}`,
            }}
        >
            <Link
                href={`/${locale}`}
                className="flex shrink-0 items-center"
                aria-label={
                    isRTL
                        ? 'كوارتز — الصفحة الرئيسية'
                        : 'Quartz Solutions — home'
                }
                style={{ color: B.cream, textDecoration: 'none' }}
            >
                <img
                    src="/logo.svg"
                    alt="Quartz"
                    width={132}
                    height={34}
                    className="q-logo-dark"
                    style={{ height: 30, width: 'auto' }}
                />
                <img
                    src="/logo-dark.svg"
                    alt="Quartz"
                    width={132}
                    height={34}
                    className="q-logo-light"
                    style={{ height: 30, width: 'auto' }}
                />
            </Link>

            <div
                className="hidden lg:flex"
                style={{ gap: 36, fontSize: 14, color: B.dim }}
            >
                {links.map((l) => (
                    <Link
                        key={l.key}
                        href={l.href}
                        style={{
                            color: 'inherit',
                            textDecoration: 'none',
                            transition: 'color 160ms ease',
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.color = B.cream)
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.color = B.dim)
                        }
                    >
                        {l.label}
                    </Link>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <PublicThemeToggle />
                <LanguageSwitcher />

                <Link
                    href={`/${locale}/contact`}
                    className="hidden sm:inline-flex"
                    style={{
                        background: 'transparent',
                        color: B.cream,
                        border: `1px solid ${B.cream}`,
                        padding: '12px 22px',
                        fontSize: 13,
                        textDecoration: 'none',
                        fontFamily: B.sans,
                        transition: 'all 160ms ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = B.accent;
                        e.currentTarget.style.borderColor = B.accent;
                        e.currentTarget.style.color = B.bg;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = B.cream;
                        e.currentTarget.style.color = B.cream;
                    }}
                >
                    {ctaLabel} {arrow}
                </Link>

                {/* Mobile menu. The sheet is portalled outside the layout, so it
                    carries .public-theme itself to resolve the --q-* tokens
                    (dark and light). It opens from the reading-start edge. */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button
                            type="button"
                            aria-label={menuLabel}
                            className="inline-grid place-items-center lg:hidden"
                            style={{
                                background: 'transparent',
                                color: B.cream,
                                border: `1px solid ${B.line}`,
                                width: 44,
                                height: 44,
                                cursor: 'pointer',
                            }}
                        >
                            <Menu size={18} aria-hidden="true" />
                        </button>
                    </SheetTrigger>
                    <SheetContent
                        side={isRTL ? 'right' : 'left'}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        aria-describedby={undefined}
                        className="public-theme q-mobile-menu w-[86vw] max-w-[360px] gap-0 p-0 shadow-2xl [&>button:last-child]:hidden"
                        style={{
                            background: B.bg,
                            color: B.cream,
                            borderColor: B.lineStrong,
                        }}
                    >
                        <SheetHeader
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingBlock: 12,
                                paddingInlineStart: 20,
                                paddingInlineEnd: 12,
                                borderBottom: `1px solid ${B.line}`,
                            }}
                        >
                            <SheetTitle
                                style={{
                                    color: B.cream,
                                    fontFamily: B.serif,
                                    fontSize: 24,
                                    fontWeight: 500,
                                    margin: 0,
                                }}
                            >
                                {isRTL ? 'كوارتز' : 'Quartz'}
                            </SheetTitle>
                            <SheetClose
                                className="q-menu-close"
                                aria-label={closeLabel}
                            >
                                <X size={20} aria-hidden="true" />
                            </SheetClose>
                        </SheetHeader>
                        <nav
                            aria-label={menuLabel}
                            style={{
                                padding: '8px 20px 24px',
                                display: 'flex',
                                flexDirection: 'column',
                                overflowY: 'auto',
                                flex: 1,
                            }}
                        >
                            {links.map((l) => (
                                <Link
                                    key={l.key}
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className="q-menu-link"
                                >
                                    {l.label}
                                </Link>
                            ))}
                            <Link
                                href={`/${locale}/contact`}
                                onClick={() => setOpen(false)}
                                className="q-menu-cta"
                            >
                                {ctaLabel} {arrow}
                            </Link>
                            <div className="q-menu-tools">
                                <LanguageSwitcher className="q-menu-lang" />
                                <PublicThemeToggle />
                            </div>
                        </nav>
                        <style>{`
                            .q-mobile-menu .q-menu-close { display: inline-grid; place-items: center; width: 44px; height: 44px; background: transparent; color: var(--q-cream); border: 1px solid var(--q-line-strong); cursor: pointer; }
                            .q-mobile-menu .q-menu-close:hover { border-color: var(--q-accent); color: var(--q-accent); }
                            .q-mobile-menu .q-menu-link { display: flex; align-items: center; min-height: 56px; padding: 8px 4px; font-family: var(--font-display); font-size: 22px; color: var(--q-cream); text-decoration: none; border-bottom: 1px solid var(--q-line); }
                            [dir='rtl'] .q-mobile-menu .q-menu-link { font-family: var(--font-arabic); }
                            .q-mobile-menu .q-menu-link:hover { color: var(--q-accent); }
                            .q-mobile-menu .q-menu-cta { display: flex; align-items: center; justify-content: center; min-height: 48px; margin-top: 24px; padding: 12px 22px; background: var(--q-accent); color: var(--q-bg); text-decoration: none; font-size: 15px; font-weight: 500; }
                            .q-mobile-menu .q-menu-tools { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--q-line); }
                            .q-mobile-menu .q-menu-lang { display: inline-flex; align-items: center; min-height: 44px; padding: 0 16px; border: 1px solid var(--q-line-strong); color: var(--q-cream); text-decoration: none; }
                            .q-mobile-menu .q-menu-close:focus-visible, .q-mobile-menu .q-menu-link:focus-visible, .q-mobile-menu .q-menu-cta:focus-visible, .q-mobile-menu .q-menu-lang:focus-visible { outline: 2px solid var(--q-accent); outline-offset: 2px; }
                        `}</style>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
