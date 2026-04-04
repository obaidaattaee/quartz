import { cn } from '@/lib/utils';

type ServiceType = 'development' | 'automation' | 'qa' | 'cybersecurity';

type Props = {
    service: ServiceType;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
};

const SIZE_MAP = {
    sm: 'size-6',
    md: 'size-12',
    lg: 'size-16',
} as const;

export default function ServiceIcon({
    service,
    size = 'md',
    className,
}: Props) {
    return (
        <img
            src={`/assets/icons/services/${service}.svg`}
            alt=""
            className={cn(SIZE_MAP[size], className)}
            aria-hidden="true"
        />
    );
}

export type { ServiceType };
