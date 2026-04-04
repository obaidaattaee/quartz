import { Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';

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

export default function SiteHeader() {
    const isScrolled = useScrollHeader();
    const { locale, isRTL, t } = useLocale();
    const [mobileOpen, setMobileOpen] = useState(false);

    const serviceItems = [
        { key: 'nav.services.dev', href: `/${locale}/services/development` },
        {
            key: 'nav.services.automation',
            href: `/${locale}/services/automation`,
        },
        { key: 'nav.services.qa', href: `/${locale}/services/qa` },
        {
            key: 'nav.services.cybersecurity',
            href: `/${locale}/services/cybersecurity`,
        },
    ];

    const navItems = [
        { key: 'nav.portfolio', href: `/${locale}/portfolio` },
        { key: 'nav.blog', href: `/${locale}/blog` },
        { key: 'nav.about', href: `/${locale}/about` },
    ];

    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-50 transition-all duration-300',
                isScrolled
                    ? 'border-border/50 bg-background/80 border-b backdrop-blur-lg'
                    : 'bg-transparent',
            )}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link
                    href={`/${locale}`}
                    className="flex items-center gap-2"
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

                {/* Desktop Navigation */}
                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList>
                        {/* Services dropdown */}
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                {t('nav.services')}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[280px] gap-1 p-2">
                                    {serviceItems.map((item) => (
                                        <li key={item.key}>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href={item.href}
                                                    className="hover:bg-accent/10 flex rounded-md p-2 text-sm transition-colors"
                                                >
                                                    {t(item.key)}
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        {/* Other nav items */}
                        {navItems.map((item) => (
                            <NavigationMenuItem key={item.key}>
                                <NavigationMenuLink asChild>
                                    <Link
                                        href={item.href}
                                        className="hover:bg-accent/10 inline-flex h-9 items-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
                                    >
                                        {t(item.key)}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Right side: CTA + Language + Theme */}
                <div className="flex items-center gap-2">
                    <Button
                        asChild
                        className="hidden sm:inline-flex"
                        size="sm"
                    >
                        <Link href={`/${locale}/contact`}>
                            {t('nav.contact')}
                        </Link>
                    </Button>

                    <LanguageSwitcher />
                    <ThemeToggle />

                    {/* Mobile hamburger */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                aria-label="Open menu"
                            >
                                <Menu className="size-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side={isRTL ? 'left' : 'right'}>
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
                            <nav className="flex flex-col gap-4 p-4">
                                <Link
                                    href={`/${locale}`}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-sm font-medium"
                                >
                                    {t('nav.home')}
                                </Link>
                                <div className="flex flex-col gap-2">
                                    <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                                        {t('nav.services')}
                                    </span>
                                    {serviceItems.map((item) => (
                                        <Link
                                            key={item.key}
                                            href={item.href}
                                            onClick={() =>
                                                setMobileOpen(false)
                                            }
                                            className="text-muted-foreground hover:text-foreground ps-3 text-sm transition-colors"
                                        >
                                            {t(item.key)}
                                        </Link>
                                    ))}
                                </div>
                                {navItems.map((item) => (
                                    <Link
                                        key={item.key}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="text-sm font-medium"
                                    >
                                        {t(item.key)}
                                    </Link>
                                ))}
                                <Button asChild className="mt-4" size="sm">
                                    <Link
                                        href={`/${locale}/contact`}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {t('nav.contact')}
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
