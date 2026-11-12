import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

import { cn } from '@/lib/utils';

type Props = {
    href: string;
    label: string;
    title: string;
    heroRef: RefObject<HTMLElement | null>;
    endRef: RefObject<HTMLElement | null>;
};

// Phone-only CTA bar (CSS hides it from 900px up). It appears once the hero
// has scrolled away and hides again when the closing CTA comes into view,
// so it never duplicates a visible button or covers the footer.
export default function StickyCta({
    href,
    label,
    title,
    heroRef,
    endRef,
}: Props) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let frame = 0;

        const update = () => {
            frame = 0;
            const hero = heroRef.current?.getBoundingClientRect();
            const end = endRef.current?.getBoundingClientRect();

            if (!hero || !end) {
                return;
            }

            setVisible(hero.bottom < 0 && end.top > window.innerHeight);
        };

        const onScroll = () => {
            if (!frame) {
                frame = requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            cancelAnimationFrame(frame);
        };
    }, [heroRef, endRef]);

    return (
        <div
            className={cn('sv-sticky', visible && 'is-visible')}
            aria-hidden={!visible}
            inert={!visible}
        >
            <span>{title}</span>
            <Link href={href} className="sv-btn" tabIndex={visible ? 0 : -1}>
                {label}
            </Link>
        </div>
    );
}
