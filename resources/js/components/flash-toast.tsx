import { router, usePage } from '@inertiajs/react';
import { CircleAlert, CircleCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

type Flash = {
    success?: string | null;
    error?: string | null;
};

type Toast = {
    kind: 'success' | 'error';
    message: string;
};

const DISMISS_AFTER_MS = 5000;

function toToast(flash: Flash | undefined): Toast | null {
    if (flash?.error) {
        return { kind: 'error', message: flash.error };
    }

    if (flash?.success) {
        return { kind: 'success', message: flash.success };
    }

    return null;
}

export default function FlashToast() {
    const { flash } = usePage<{ flash?: Flash }>().props;
    // Inertia keeps the same `flash` object when its values don't change, so
    // saving twice would look like "nothing new". Count completed visits
    // instead: every visit re-shows whatever the server flashed for it.
    const [visit, setVisit] = useState(0);
    const [dismissedVisit, setDismissedVisit] = useState(-1);
    const toast = dismissedVisit === visit ? null : toToast(flash);
    const visible = toast !== null;

    useEffect(
        () => router.on('success', () => setVisit((count) => count + 1)),
        [],
    );

    useEffect(() => {
        if (!visible) {
            return;
        }

        const timer = window.setTimeout(
            () => setDismissedVisit(visit),
            DISMISS_AFTER_MS,
        );

        return () => window.clearTimeout(timer);
    }, [visit, visible]);

    if (!toast) {
        return null;
    }

    const Icon = toast.kind === 'success' ? CircleCheck : CircleAlert;

    return (
        <div
            role={toast.kind === 'error' ? 'alert' : 'status'}
            aria-live={toast.kind === 'error' ? 'assertive' : 'polite'}
            data-test="flash-toast"
            className={cn(
                'fixed end-4 bottom-4 z-50 flex max-w-sm animate-in items-start gap-3 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg fade-in slide-in-from-bottom-2',
                toast.kind === 'success'
                    ? 'border-emerald-500/40'
                    : 'border-destructive/50',
            )}
        >
            <Icon
                className={cn(
                    'mt-0.5 size-4 shrink-0',
                    toast.kind === 'success'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-destructive',
                )}
            />
            <p className="flex-1 text-foreground">{toast.message}</p>
            <button
                type="button"
                onClick={() => setDismissedVisit(visit)}
                className="-me-1 rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                aria-label="Dismiss"
            >
                <X className="size-4" />
            </button>
        </div>
    );
}
