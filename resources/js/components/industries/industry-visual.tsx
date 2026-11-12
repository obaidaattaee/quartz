import type { ReactNode } from 'react';

import { useLocale } from '@/hooks/use-locale';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

// Blueprint-style line diagrams, one per sector, drawn on a 480 x 400
// canvas in the same visual language as the services diagrams. Labels are
// real SVG text so they translate and pick up Almarai in Arabic, and every
// x coordinate goes through mx() so the flows mirror in RTL.

const W = 480;

type Tr = (en: string, ar: string) => string;
type Point = [number, number];

type DiagramProps = {
    tr: Tr;
    mx: (x: number) => number;
    path: (points: Point[]) => string;
    signal: (d: string, dur?: number) => ReactNode;
};

function Signal({ d, dur = 6 }: { d: string; dur?: number }) {
    return (
        <circle r="4.5" className="in-svg-dot">
            <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={d} />
        </circle>
    );
}

function Node({
    x,
    y,
    w = 140,
    label,
    sub,
    hi = false,
}: {
    x: number;
    y: number;
    w?: number;
    label: string;
    sub?: string;
    hi?: boolean;
}) {
    return (
        <g>
            <rect
                x={x - w / 2}
                y={y - 28}
                width={w}
                height={56}
                className={hi ? 'in-svg-face-hi' : 'in-svg-face'}
            />
            <text
                x={x}
                y={sub ? y - 3 : y + 5}
                textAnchor="middle"
                className="in-svg-text"
            >
                {label}
            </text>
            {sub && (
                <text
                    x={x}
                    y={y + 16}
                    textAnchor="middle"
                    className="in-svg-small"
                >
                    {sub}
                </text>
            )}
        </g>
    );
}

function Band({
    y,
    label,
    mx,
}: {
    y: number;
    label: string;
    mx: (x: number) => number;
}) {
    const x1 = Math.min(mx(40), mx(440));

    return (
        <g>
            <rect
                x={x1}
                y={y - 18}
                width={400}
                height={36}
                className="in-svg-dash"
            />
            <text
                x={W / 2}
                y={y + 5}
                textAnchor="middle"
                className="in-svg-small"
            >
                {label}
            </text>
        </g>
    );
}

function Retail({ tr, mx, path, signal }: DiagramProps) {
    const left = [
        {
            y: 80,
            label: tr('Branch till', 'كاشير الفرع'),
            sub: tr('Works offline', 'يعمل دون اتصال'),
        },
        {
            y: 180,
            label: tr('Warehouse', 'المستودع'),
            sub: tr('Counts and transfers', 'الجرد والتحويلات'),
        },
        {
            y: 280,
            label: tr('Online store', 'المتجر الإلكتروني'),
            sub: tr('Same stock', 'المخزون نفسه'),
        },
    ];
    const flow = path([
        [170, 80],
        [180, 80],
        [180, 180],
        [318, 180],
        [318, 110],
        [325, 110],
    ]);

    return (
        <>
            {left.map((n) => (
                <path
                    key={`l-${n.y}`}
                    d={path([
                        [170, n.y],
                        [180, n.y],
                        [180, 180],
                        [190, 180],
                    ])}
                    className="in-svg-line"
                />
            ))}
            <path
                d={path([
                    [310, 180],
                    [318, 180],
                    [318, 110],
                    [325, 110],
                ])}
                className="in-svg-accent"
            />
            <path
                d={path([
                    [318, 180],
                    [318, 250],
                    [325, 250],
                ])}
                className="in-svg-line"
            />
            <path
                d={path([
                    [250, 208],
                    [250, 322],
                ])}
                className="in-svg-dash"
            />
            {signal(flow, 5)}
            {left.map((n) => (
                <Node key={n.y} {...n} x={mx(100)} />
            ))}
            <Node
                x={mx(250)}
                y={180}
                w={120}
                hi
                label={tr('Stock ledger', 'سجل المخزون')}
                sub={tr('One record', 'سجل واحد')}
            />
            <Node
                x={mx(395)}
                y={110}
                label={tr('E-invoicing', 'الفوترة الإلكترونية')}
                sub={tr('E-invoices', 'الفواتير الإلكترونية')}
            />
            <Node
                x={mx(395)}
                y={250}
                label={tr('Accounting', 'المحاسبة')}
                sub={tr('Daily sales', 'المبيعات اليومية')}
            />
            <Band
                y={340}
                mx={mx}
                label={tr(
                    'Audit log: every sale, refund and price change',
                    'سجل تدقيق لكل بيع ومرتجع وتعديل سعر',
                )}
            />
        </>
    );
}

function Healthcare({ tr, mx, path, signal }: DiagramProps) {
    const links: Point[][] = [
        [
            [160, 80],
            [168, 80],
            [168, 158],
            [175, 158],
        ],
        [
            [160, 260],
            [168, 260],
            [168, 184],
            [175, 184],
        ],
        [
            [320, 80],
            [312, 80],
            [312, 158],
            [305, 158],
        ],
        [
            [320, 260],
            [312, 260],
            [312, 184],
            [305, 184],
        ],
    ];

    return (
        <>
            {links.map((l, i) => (
                <path
                    key={i}
                    d={path(l)}
                    className={i === 3 ? 'in-svg-accent' : 'in-svg-line'}
                />
            ))}
            <path
                d={path([
                    [240, 199],
                    [240, 302],
                ])}
                className="in-svg-dash"
            />
            {signal(
                path([
                    [160, 80],
                    [168, 80],
                    [168, 158],
                    [312, 158],
                    [312, 260],
                    [320, 260],
                ]),
                6,
            )}
            <Node
                x={mx(90)}
                y={80}
                label={tr('Patient app', 'تطبيق المريض')}
                sub={tr('Arabic first', 'العربية أولاً')}
            />
            <Node
                x={mx(90)}
                y={260}
                label={tr('Reception', 'الاستقبال')}
                sub={tr('One schedule', 'جدول واحد')}
            />
            <Node
                x={mx(240)}
                y={171}
                w={130}
                hi
                label={tr('Clinic system', 'نظام العيادة')}
                sub={tr('Visits, referrals', 'الزيارات والإحالات')}
            />
            <Node
                x={mx(390)}
                y={80}
                label={tr('Lab results', 'نتائج المختبر')}
                sub="HL7 FHIR"
            />
            <Node
                x={mx(390)}
                y={260}
                label={tr('Insurance exchange', 'منصة التأمين')}
                sub={tr('Insurance claims', 'مطالبات التأمين')}
            />
            <Band
                y={330}
                mx={mx}
                label={tr(
                    'Access log: who opened which record',
                    'سجل الوصول: من فتح أي ملف',
                )}
            />
        </>
    );
}

function Financial({ tr, mx, path, signal }: DiagramProps) {
    const steps = [
        {
            x: 66,
            label: tr('Application', 'طلب العميل'),
            sub: tr('Web or mobile', 'ويب أو جوال'),
        },
        {
            x: 182,
            label: tr('Identity', 'التحقق'),
            sub: tr('National ID', 'الهوية الوطنية'),
        },
        {
            x: 298,
            label: tr('Review', 'المراجعة'),
            sub: tr('Compliance queue', 'قائمة الامتثال'),
        },
        {
            x: 414,
            label: tr('Decision', 'القرار'),
            sub: tr('Logged', 'موثّق'),
        },
    ];

    return (
        <>
            <path
                d={path([
                    [30, 90],
                    [450, 90],
                ])}
                className="in-svg-line"
            />
            <path
                d={path([
                    [30, 196],
                    [450, 196],
                ])}
                className="in-svg-accent"
            />
            {steps.map((s) => (
                <g key={`t-${s.x}`}>
                    <path
                        d={path([
                            [s.x, 118],
                            [s.x, 196],
                        ])}
                        className="in-svg-dash"
                    />
                    <circle
                        cx={mx(s.x)}
                        cy={196}
                        r={4}
                        className="in-svg-dot"
                    />
                </g>
            ))}
            <text
                x={W / 2}
                y={224}
                textAnchor="middle"
                className="in-svg-small"
            >
                {tr(
                    'Audit trail: who, when and why',
                    'سجل التدقيق: من ومتى ولماذا',
                )}
            </text>
            <path
                d={path([
                    [150, 196],
                    [150, 272],
                ])}
                className="in-svg-line"
            />
            <path
                d={path([
                    [330, 196],
                    [330, 272],
                ])}
                className="in-svg-line"
            />
            {signal(
                path([
                    [14, 90],
                    [466, 90],
                ]),
                5,
            )}
            {steps.map((s, i) => (
                <Node
                    key={s.x}
                    x={mx(s.x)}
                    y={90}
                    w={104}
                    hi={i === steps.length - 1}
                    label={s.label}
                    sub={s.sub}
                />
            ))}
            <Node
                x={mx(150)}
                y={300}
                w={150}
                label={tr('Reconciliation', 'التسوية')}
                sub={tr('Exceptions only', 'الاستثناءات فقط')}
            />
            <Node
                x={mx(330)}
                y={300}
                w={150}
                label={tr('Reports', 'التقارير')}
                sub={tr('Generated, not assembled', 'تُولَّد ولا تُجمع')}
            />
        </>
    );
}

function Government({ tr, mx, path, signal }: DiagramProps) {
    const desks = [
        {
            x: 110,
            label: tr('Intake', 'استلام الطلب'),
            sub: tr('Registered', 'تسجيل'),
        },
        {
            x: 240,
            label: tr('Review', 'الدراسة'),
            sub: tr('Service level', 'مستوى الخدمة'),
        },
        {
            x: 370,
            label: tr('Approval', 'الاعتماد'),
            sub: tr('E-signed', 'توقيع إلكتروني'),
        },
    ];
    const route = path([
        [155, 90],
        [165, 90],
        [315, 90],
        [325, 90],
        [390, 90],
        [390, 160],
        [110, 160],
        [110, 230],
        [370, 230],
    ]);

    return (
        <>
            <path
                d={path([
                    [155, 90],
                    [165, 90],
                ])}
                className="in-svg-line"
            />
            <path
                d={path([
                    [315, 90],
                    [325, 90],
                ])}
                className="in-svg-accent"
            />
            <path
                d={path([
                    [390, 118],
                    [390, 160],
                    [110, 160],
                    [110, 202],
                ])}
                className="in-svg-line"
            />
            <path
                d={path([
                    [165, 230],
                    [185, 230],
                ])}
                className="in-svg-line"
            />
            <path
                d={path([
                    [295, 230],
                    [315, 230],
                ])}
                className="in-svg-line"
            />
            <path
                d={path([
                    [240, 258],
                    [240, 302],
                ])}
                className="in-svg-dash"
            />
            {signal(route, 7)}
            <Node
                x={mx(90)}
                y={90}
                w={130}
                label={tr('Citizen', 'المواطن')}
                sub={tr('Any device', 'أي جهاز')}
            />
            <Node
                x={mx(240)}
                y={90}
                w={150}
                hi
                label={tr('Identity sign-in', 'الدخول بالهوية')}
                sub={tr('SAML / OpenID Connect', 'SAML / OpenID Connect')}
            />
            <Node
                x={mx(390)}
                y={90}
                w={130}
                label={tr('E-service', 'الخدمة الإلكترونية')}
                sub="WCAG 2.2 AA"
            />
            {desks.map((d) => (
                <Node key={d.x} {...d} x={mx(d.x)} y={230} w={110} />
            ))}
            <Band
                y={322}
                mx={mx}
                label={tr(
                    'Every step logged for audit',
                    'كل خطوة موثّقة للتدقيق',
                )}
            />
        </>
    );
}

function Education({ tr, mx, path, signal }: DiagramProps) {
    const spokes: { x: number; y: number; label: string; sub: string }[] = [
        {
            x: 90,
            y: 70,
            label: tr('Parents', 'أولياء الأمور'),
            sub: tr('App and alerts', 'تطبيق وتنبيهات'),
        },
        {
            x: 390,
            y: 70,
            label: tr('Teachers', 'المعلمون'),
            sub: tr('Grades, homework', 'الدرجات والواجبات'),
        },
        {
            x: 90,
            y: 310,
            label: tr('Students', 'الطلاب'),
            sub: tr('Courses, exams', 'المقررات والاختبارات'),
        },
        {
            x: 390,
            y: 310,
            label: tr('Administration', 'الإدارة'),
            sub: tr('Admissions, fees', 'القبول والرسوم'),
        },
    ];

    return (
        <>
            {spokes.map((s) => {
                const toward = s.x < 240 ? 165 : 315;
                const hubY = s.y < 190 ? 170 : 210;

                return (
                    <path
                        key={`p-${s.x}-${s.y}`}
                        d={path([
                            [s.x, s.y < 190 ? s.y + 28 : s.y - 28],
                            [s.x, hubY],
                            [toward, hubY],
                        ])}
                        className={
                            s.y < 190 && s.x < 240
                                ? 'in-svg-accent'
                                : 'in-svg-line'
                        }
                    />
                );
            })}
            {signal(
                path([
                    [90, 98],
                    [90, 170],
                    [390, 170],
                    [390, 98],
                ]),
                6,
            )}
            <Node
                x={mx(240)}
                y={190}
                w={150}
                hi
                label={tr('School platform', 'منصة المدرسة')}
                sub={tr('One student record', 'سجل واحد للطالب')}
            />
            {spokes.map((s) => (
                <Node key={`${s.x}-${s.y}`} {...s} x={mx(s.x)} />
            ))}
        </>
    );
}

const DIAGRAMS: Record<string, (props: DiagramProps) => ReactNode> = {
    'retail-pos': Retail,
    healthcare: Healthcare,
    'financial-services': Financial,
    government: Government,
    education: Education,
};

type Props = {
    slug: string;
    label: string;
};

/** Hero diagram for a sector page; renders nothing for unknown slugs. */
export default function IndustryVisual({ slug, label }: Props) {
    const { isRTL, t } = useLocale();
    const reduced = useReducedMotion();
    const Diagram = DIAGRAMS[slug];

    if (!Diagram) {
        return null;
    }

    const mx = (x: number) => (isRTL ? W - x : x);
    const props: DiagramProps = {
        tr: (en, ar) => (isRTL ? ar : en),
        mx,
        path: (points) =>
            points
                .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${mx(x)} ${y}`)
                .join(' '),
        signal: (d, dur) => (reduced ? null : <Signal d={d} dur={dur} />),
    };

    return (
        <figure className="in-figure">
            <svg viewBox="0 0 480 400" role="img" aria-label={label}>
                <Diagram {...props} />
            </svg>
            <figcaption>{t('industries.page.diagram')}</figcaption>
        </figure>
    );
}

// Small sector marks for the index rows, on a 64 x 64 canvas.
const GLYPHS: Record<string, ReactNode> = {
    'retail-pos': (
        <>
            <rect
                x="10"
                y="12"
                width="12"
                height="10"
                className="in-svg-line"
            />
            <rect
                x="10"
                y="27"
                width="12"
                height="10"
                className="in-svg-line"
            />
            <rect
                x="10"
                y="42"
                width="12"
                height="10"
                className="in-svg-line"
            />
            <path d="M22 17 H30 V47 H22 M22 32 H40" className="in-svg-line" />
            <rect
                x="40"
                y="25"
                width="14"
                height="14"
                className="in-svg-face-hi"
            />
        </>
    ),
    healthcare: (
        <>
            <rect
                x="20"
                y="20"
                width="24"
                height="24"
                className="in-svg-face-hi"
            />
            <path d="M32 26 V38 M26 32 H38" className="in-svg-accent" />
            <path
                d="M8 32 H20 M44 32 H56 M32 8 V20 M32 44 V56"
                className="in-svg-dash"
            />
        </>
    ),
    'financial-services': (
        <>
            <path d="M8 22 H56" className="in-svg-line" />
            <rect x="8" y="16" width="10" height="12" className="in-svg-face" />
            <rect
                x="27"
                y="16"
                width="10"
                height="12"
                className="in-svg-face"
            />
            <rect
                x="46"
                y="16"
                width="10"
                height="12"
                className="in-svg-face-hi"
            />
            <path d="M8 44 H56" className="in-svg-accent" />
            <path
                d="M13 28 V44 M32 28 V44 M51 28 V44"
                className="in-svg-dash"
            />
        </>
    ),
    government: (
        <>
            <path d="M10 22 L32 10 L54 22 Z" className="in-svg-line" />
            <path
                d="M16 26 V46 M27 26 V46 M37 26 V46 M48 26 V46"
                className="in-svg-line"
            />
            <path d="M10 50 H54" className="in-svg-accent" />
        </>
    ),
    education: (
        <>
            <rect
                x="24"
                y="26"
                width="16"
                height="12"
                className="in-svg-face-hi"
            />
            <circle cx="12" cy="12" r="5" className="in-svg-line" />
            <circle cx="52" cy="12" r="5" className="in-svg-line" />
            <circle cx="12" cy="52" r="5" className="in-svg-line" />
            <circle cx="52" cy="52" r="5" className="in-svg-line" />
            <path
                d="M16 16 L24 26 M48 16 L40 26 M16 48 L24 38 M48 48 L40 38"
                className="in-svg-line"
            />
        </>
    ),
};

export function IndustryGlyph({ slug }: { slug: string }) {
    const { isRTL } = useLocale();
    const glyph = GLYPHS[slug];

    if (!glyph) {
        return null;
    }

    return (
        <svg
            viewBox="0 0 64 64"
            aria-hidden="true"
            focusable="false"
            style={isRTL ? { transform: 'scaleX(-1)' } : undefined}
        >
            {glyph}
        </svg>
    );
}
