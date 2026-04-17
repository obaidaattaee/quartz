import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Banknote,
    BookOpen,
    Bot,
    Code2,
    Globe,
    GraduationCap,
    HeartPulse,
    HelpCircle,
    Landmark,
    Lock,
    Mail,
    Menu,
    ShieldCheck,
    ShoppingCart,
    Smartphone,
    Sparkles,
    Users,
} from 'lucide-react';
import { useState, type ComponentType } from 'react';

import LanguageSwitcher from '@/components/language-switcher';
import ThemeToggle from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useLocale } from '@/hooks/use-locale';
import { useScrollHeader } from '@/hooks/use-scroll-header';
import { cn } from '@/lib/utils';

type IconType = ComponentType<{ className?: string }>;

type MegaLink = {
    icon: IconType;
    titleKey: string;
    briefKey: string;
    href: string;
};

export default function SiteHeader() {
    const isScrolled = useScrollHeader();
    const { locale, isRTL, t } = useLocale();
    const [mobileOpen, setMobileOpen] = useState(false);

    const serviceBuild: MegaLink[] = [
        {
            icon: Code2,
            titleKey: 'nav.services.dev',
            briefKey: 'nav.services.dev.brief',
            href: `/${locale}/services/development`,
        },
        {
            icon: Globe,
            titleKey: 'nav.services.web',
            briefKey: 'nav.services.web.brief',
            href: `/${locale}/services/web-development`,
        },
        {
            icon: Smartphone,
            titleKey: 'nav.services.mobile',
            briefKey: 'nav.services.mobile.brief',
            href: `/${locale}/services/mobile-apps`,
        },
    ];

    const serviceRun: MegaLink[] = [
        {
            icon: Bot,
            titleKey: 'nav.services.automation',
            briefKey: 'nav.services.automation.brief',
            href: `/${locale}/services/automation`,
        },
        {
            icon: ShieldCheck,
            titleKey: 'nav.services.qa',
            briefKey: 'nav.services.qa.brief',
            href: `/${locale}/services/qa`,
        },
        {
            icon: Lock,
            titleKey: 'nav.services.cybersecurity',
            briefKey: 'nav.services.cybersecurity.brief',
            href: `/${locale}/services/cybersecurity`,
        },
    ];

    const industryLinks: MegaLink[] = [
        {
            icon: ShoppingCart,
            titleKey: 'industries.retail-pos.title',
            briefKey: 'industries.retail-pos.brief',
            href: `/${locale}/industries/retail-pos`,
        },
        {
            icon: HeartPulse,
            titleKey: 'industries.healthcare.title',
            briefKey: 'industries.healthcare.brief',
            href: `/${locale}/industries/healthcare`,
        },
        {
            icon: Banknote,
            titleKey: 'industries.financial-services.title',
            briefKey: 'industries.financial-services.brief',
            href: `/${locale}/industries/financial-services`,
        },
        {
            icon: Landmark,
            titleKey: 'industries.government.title',
            briefKey: 'industries.government.brief',
            href: `/${locale}/industries/government`,
        },
        {
            icon: GraduationCap,
            titleKey: 'industries.education.title',
            briefKey: 'industries.education.brief',
            href: `/${locale}/industries/education`,
        },
    ];

    const resourceLinks: MegaLink[] = [
        {
            icon: BookOpen,
            titleKey: 'nav.resources.blog',
            briefKey: 'nav.resources.blog.brief',
            href: `/${locale}/blog`,
        },
        {
            icon: HelpCircle,
            titleKey: 'nav.resources.faq',
            briefKey: 'nav.resources.faq.brief',
            href: `/${locale}/faq`,
        },
    ];

    const companyLinks: MegaLink[] = [
        {
            icon: Users,
            titleKey: 'nav.company.about',
            briefKey: 'nav.company.about.brief',
            href: `/${locale}/about`,
        },
        {
            icon: Mail,
            titleKey: 'nav.company.contact',
            briefKey: 'nav.company.contact.brief',
            href: `/${locale}/contact`,
        },
    ];

    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-50 transition-all duration-300',
                isScrolled
                    ? 'border-border/60 bg-background/85 border-b backdrop-blur-lg'
                    : 'bg-background/60 backdrop-blur-sm',
            )}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link
                    href={`/${locale}`}
                    className="flex shrink-0 items-center gap-2"
                    aria-label="Quartz Solutions — home"
                >
                    <picture>
                        <source
                            srcSet="/images/logo-full-transparent.webp"
                            type="image/webp"
                        />
                        <img
                            src="/images/logo-full-transparent.png"
                            alt="Quartz Solutions"
                            width={88}
                            height={40}
                            className="h-8 w-auto dark:brightness-0 dark:invert"
                        />
                    </picture>
                </Link>

                {/* Desktop mega-menu */}
                <NavigationMenu
                    className="hidden lg:flex"
                    viewport={false}
                    dir={isRTL ? 'rtl' : 'ltr'}
                >
                    <NavigationMenuList className="gap-1">
                        {/* Services — two-column mega panel with a right rail */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="text-sm font-medium">
                                {t('nav.services')}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent
                                dir={isRTL ? 'rtl' : 'ltr'}
                            >
                                <div className="grid w-[720px] grid-cols-[1fr_1fr_260px] gap-6 p-6">
                                    <div>
                                        <p className="text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-[0.12em]">
                                            {t('nav.services.buildGroup')}
                                        </p>
                                        <ul className="flex flex-col gap-1">
                                            {serviceBuild.map((item) => (
                                                <MegaMenuRow
                                                    key={item.href}
                                                    item={item}
                                                    t={t}
                                                />
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-[0.12em]">
                                            {t('nav.services.runGroup')}
                                        </p>
                                        <ul className="flex flex-col gap-1">
                                            {serviceRun.map((item) => (
                                                <MegaMenuRow
                                                    key={item.href}
                                                    item={item}
                                                    t={t}
                                                />
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Right rail: tagline + CTA */}
                                    <div className="bg-muted/60 flex flex-col justify-between rounded-xl p-5">
                                        <div>
                                            <Sparkles className="text-accent mb-3 size-5" />
                                            <p className="text-foreground text-sm leading-relaxed">
                                                {t('nav.services.tagline')}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/${locale}/contact`}
                                            className="text-accent hover:text-accent/80 mt-4 inline-flex items-center gap-1 text-sm font-semibold"
                                        >
                                            {t('nav.cta')}
                                            <ArrowRight className="size-4 rtl:rotate-180" />
                                        </Link>
                                    </div>
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        {/* Industries — two-column mega panel */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="text-sm font-medium">
                                {t('nav.industries')}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent
                                dir={isRTL ? 'rtl' : 'ltr'}
                            >
                                <div className="grid w-[560px] grid-cols-2 gap-2 p-4">
                                    {industryLinks.map((item) => (
                                        <MegaMenuRow
                                            key={item.href}
                                            item={item}
                                            t={t}
                                        />
                                    ))}
                                    <Link
                                        href={`/${locale}/industries`}
                                        className="text-accent hover:text-accent/80 col-span-2 mt-2 inline-flex items-center gap-1 px-3 text-sm font-semibold"
                                    >
                                        {locale === 'ar'
                                            ? 'استكشف كل القطاعات'
                                            : 'Explore all industries'}
                                        <ArrowRight className="size-4 rtl:rotate-180" />
                                    </Link>
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        {/* Work — direct link, no dropdown */}
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href={`/${locale}/portfolio`}
                                    className="hover:bg-muted inline-flex h-9 items-center rounded-md px-4 text-sm font-medium transition-colors"
                                >
                                    {t('nav.work')}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {/* Resources */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="text-sm font-medium">
                                {t('nav.resources')}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent
                                dir={isRTL ? 'rtl' : 'ltr'}
                            >
                                <div className="w-[360px] p-4">
                                    <p className="text-muted-foreground mb-3 px-3 text-xs font-semibold uppercase tracking-[0.12em]">
                                        {t('nav.resources.tagline')}
                                    </p>
                                    <ul className="flex flex-col gap-1">
                                        {resourceLinks.map((item) => (
                                            <MegaMenuRow
                                                key={item.href}
                                                item={item}
                                                t={t}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        {/* Company */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="text-sm font-medium">
                                {t('nav.company')}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent
                                dir={isRTL ? 'rtl' : 'ltr'}
                            >
                                <div className="w-[360px] p-4">
                                    <p className="text-muted-foreground mb-3 px-3 text-xs font-semibold uppercase tracking-[0.12em]">
                                        {t('nav.company.tagline')}
                                    </p>
                                    <ul className="flex flex-col gap-1">
                                        {companyLinks.map((item) => (
                                            <MegaMenuRow
                                                key={item.href}
                                                item={item}
                                                t={t}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Right cluster */}
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeToggle />

                    <Button
                        asChild
                        size="sm"
                        className="hidden bg-accent text-accent-foreground shadow-sm hover:bg-accent/90 sm:inline-flex"
                    >
                        <Link href={`/${locale}/contact`}>
                            {t('nav.ctaShort')}
                        </Link>
                    </Button>

                    {/* Mobile hamburger */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                aria-label={t('nav.services')}
                            >
                                <Menu className="size-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side={isRTL ? 'left' : 'right'}
                            className="w-[320px] sm:w-[380px]"
                        >
                            <SheetHeader>
                                <SheetTitle className="text-start">
                                    <picture>
                                        <source
                                            srcSet="/images/logo-full-transparent.webp"
                                            type="image/webp"
                                        />
                                        <img
                                            src="/images/logo-full-transparent.png"
                                            alt="Quartz Solutions"
                                            width={88}
                                            height={40}
                                            className="h-7 w-auto dark:brightness-0 dark:invert"
                                        />
                                    </picture>
                                </SheetTitle>
                            </SheetHeader>

                            <nav className="flex flex-col gap-6 px-4 pb-6">
                                <MobileGroup
                                    label={t('nav.services')}
                                    items={[...serviceBuild, ...serviceRun]}
                                    t={t}
                                    onNavigate={() => setMobileOpen(false)}
                                />

                                <MobileGroup
                                    label={t('nav.industries')}
                                    items={industryLinks}
                                    t={t}
                                    onNavigate={() => setMobileOpen(false)}
                                />

                                <Link
                                    href={`/${locale}/portfolio`}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-foreground text-sm font-semibold"
                                >
                                    {t('nav.work')}
                                </Link>

                                <MobileGroup
                                    label={t('nav.resources')}
                                    items={resourceLinks}
                                    t={t}
                                    onNavigate={() => setMobileOpen(false)}
                                />

                                <MobileGroup
                                    label={t('nav.company')}
                                    items={companyLinks}
                                    t={t}
                                    onNavigate={() => setMobileOpen(false)}
                                />

                                <Button
                                    asChild
                                    className="mt-2 w-full bg-accent text-accent-foreground hover:bg-accent/90"
                                >
                                    <Link
                                        href={`/${locale}/contact`}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {t('nav.cta')}
                                    </Link>
                                </Button>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

type MegaMenuRowProps = {
    item: MegaLink;
    t: (key: string) => string;
};

function MegaMenuRow({ item, t }: MegaMenuRowProps) {
    const Icon = item.icon;

    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={item.href}
                    className="hover:bg-muted group flex items-start gap-3 rounded-md p-3 text-start transition-colors"
                >
                    <span className="bg-primary/5 text-primary group-hover:bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-md transition-colors">
                        <Icon className="size-4" />
                    </span>
                    <span className="flex min-w-0 flex-col text-start">
                        <span className="text-foreground text-sm font-semibold">
                            {t(item.titleKey)}
                        </span>
                        <span className="text-muted-foreground text-xs leading-snug">
                            {t(item.briefKey)}
                        </span>
                    </span>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}

type MobileGroupProps = {
    label: string;
    items: MegaLink[];
    t: (key: string) => string;
    onNavigate: () => void;
};

function MobileGroup({ label, items, t, onNavigate }: MobileGroupProps) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.12em]">
                {label}
            </p>
            <ul className="flex flex-col gap-1">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                onClick={onNavigate}
                                className="hover:bg-muted flex items-center gap-3 rounded-md p-2 transition-colors"
                            >
                                <span className="bg-primary/5 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
                                    <Icon className="size-4" />
                                </span>
                                <span className="flex flex-col">
                                    <span className="text-foreground text-sm font-medium">
                                        {t(item.titleKey)}
                                    </span>
                                    <span className="text-muted-foreground text-xs">
                                        {t(item.briefKey)}
                                    </span>
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

