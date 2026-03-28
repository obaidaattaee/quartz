import { Monitor, Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { useLocale } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';

type Props = {
    className?: string;
};

const CYCLE_ORDER: Appearance[] = ['light', 'dark', 'system'];

export default function ThemeToggle({ className }: Props) {
    const { appearance, updateAppearance } = useAppearance();
    const { t } = useLocale();

    const cycleTheme = () => {
        const currentIndex = CYCLE_ORDER.indexOf(appearance);
        const nextIndex = (currentIndex + 1) % CYCLE_ORDER.length;
        updateAppearance(CYCLE_ORDER[nextIndex]);
    };

    const Icon =
        appearance === 'dark' ? Moon : appearance === 'light' ? Sun : Monitor;
    const label =
        appearance === 'dark'
            ? t('theme.dark')
            : appearance === 'light'
              ? t('theme.light')
              : t('theme.system');

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            className={cn('size-9', className)}
            aria-label={label}
        >
            <Icon className="size-4" />
        </Button>
    );
}
