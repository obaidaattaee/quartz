type Props = {
    size?: number;
    color?: string;
    strokeWidth?: number;
};

export default function QuartzMark({
    size = 22,
    color = 'currentColor',
    strokeWidth = 1.6,
}: Props) {
    return (
        <svg
            width={size}
            height={size * 1.15}
            viewBox="0 0 40 46"
            fill="none"
            aria-hidden
        >
            <path
                d="M20 2 L36 12 L36 34 L20 44 L4 34 L4 12 Z"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
            />
            <path
                d="M20 2 L20 44 M4 12 L36 34 M4 34 L36 12"
                stroke={color}
                strokeWidth={strokeWidth * 0.6}
                opacity="0.45"
            />
        </svg>
    );
}
