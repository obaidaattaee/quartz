import { Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';

import LanguageSwitcher from '@/components/language-switcher';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useLocale } from '@/hooks/use-locale';

import QuartzMark from './quartz-mark';
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
            href: `/${locale}/services/development`,
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
            label: t('nav.blog') || 'Journal',
        },
        {
            key: 'about',
            href: `/${locale}/about`,
            label: t('nav.about') || 'About',
        },
    ];

    const ctaLabel = t('nav.ctaShort') || 'Book a demo';
    const arrow = isRTL ? '↖' : '↗';

    const navLabel = isRTL
        ? 'التنقّل الرئيسي'
        : 'Primary navigation';

    return (
        <nav
            aria-label={navLabel}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '22px 48px',
                position: 'sticky',
                top: 0,
                zIndex: 40,
                background: 'rgba(14,13,11,0.78)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderBottom: `1px solid ${B.line}`,
            }}
        >
            <Link
                href={`/${locale}`}
                className="flex shrink-0 items-center gap-3"
                aria-label="Quartz Solutions — home"
                style={{ color: B.cream, textDecoration: 'none' }}
            >
                <QuartzMark size={24} color={B.cream} />
                <span
                    style={{
                        fontFamily: B.serif,
                        fontSize: 22,
                        fontWeight: 500,
                        letterSpacing: '-0.01em',
                    }}
                >
                    Quartz
                </span>
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

                {/* Mobile hamburger */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button
                            type="button"
                            aria-label="Menu"
                            className="lg:hidden"
                            style={{
                                background: 'transparent',
                                color: B.cream,
                                border: `1px solid ${B.line}`,
                                padding: 10,
                                cursor: 'pointer',
                            }}
                        >
                            <Menu size={18} />
                        </button>
                    </SheetTrigger>
                    <SheetContent
                        side={isRTL ? 'left' : 'right'}
                        className="w-[320px] sm:w-[380px]"
                        style={{
                            background: B.bg,
                            color: B.cream,
                            borderColor: B.line,
                        }}
                    >
                        <SheetHeader>
                            <SheetTitle
                                style={{
                                    color: B.cream,
                                    fontFamily: B.serif,
                                    fontSize: 26,
                                    fontWeight: 500,
                                    textAlign: 'start',
                                }}
                            >
                                Quartz
                            </SheetTitle>
                        </SheetHeader>
                        <nav
                            style={{
                                padding: '24px 16px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 4,
                            }}
                        >
                            {links.map((l) => (
                                <Link
                                    key={l.key}
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    style={{
                                        padding: '14px 12px',
                                        fontFamily: B.serif,
                                        fontSize: 22,
                                        color: B.cream,
                                        textDecoration: 'none',
                                        borderBottom: `1px solid ${B.line}`,
                                    }}
                                >
                                    {l.label}
                                </Link>
                            ))}
                            <Link
                                href={`/${locale}/contact`}
                                onClick={() => setOpen(false)}
                                style={{
                                    marginTop: 24,
                                    background: B.accent,
                                    color: B.bg,
                                    padding: '14px 22px',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    fontSize: 14,
                                    fontWeight: 500,
                                }}
                            >
                                {ctaLabel} {arrow}
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
