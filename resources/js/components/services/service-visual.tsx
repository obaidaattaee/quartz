import type { ReactNode } from 'react';

import { useLocale } from '@/hooks/use-locale';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import type { ServiceSlug } from '@/types/service';

// Blueprint-style line diagrams, one per service, drawn on a 480 x 400
// canvas. Labels are real SVG text so they translate and pick up Almarai
// in Arabic. Flows mirror horizontally in RTL so they read right to left.

const W = 480;

type Tr = (en: string, ar: string) => string;

type DiagramProps = {
    tr: Tr;
    mx: (x: number) => number;
    /** Mirror a box of width w that starts at x (LTR coordinates). */
    bx: (x: number, w: number) => number;
    startAnchor: 'start' | 'end';
    signal: (path: string, dur?: number) => ReactNode;
};

function Signal({ path, dur = 5.5 }: { path: string; dur?: number }) {
    return (
        <circle r="4.5" className="sv-svg-dot">
            <animateMotion
                dur={`${dur}s`}
                repeatCount="indefinite"
                path={path}
                rotate="0"
            />
        </circle>
    );
}

function Plate({
    cx,
    cy,
    hi = false,
}: {
    cx: number;
    cy: number;
    hi?: boolean;
}) {
    const hw = 150;
    const hh = 52;
    const t = 10;

    return (
        <g>
            <polygon
                points={`${cx - hw},${cy} ${cx},${cy + hh} ${cx + hw},${cy} ${cx + hw},${cy + t} ${cx},${cy + hh + t} ${cx - hw},${cy + t}`}
                className="sv-svg-face"
            />
            <polygon
                points={`${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`}
                className={hi ? 'sv-svg-face-hi' : 'sv-svg-face'}
            />
        </g>
    );
}

function Development({ tr, mx, signal }: DiagramProps) {
    const cx = mx(220);
    const rail = mx(430);
    const layers = [
        {
            cy: 295,
            label: tr('Data', 'البيانات'),
            sub: tr('On your cloud', 'على حسابك السحابي'),
        },
        {
            cy: 200,
            label: tr('APIs and integrations', 'الواجهات والتكاملات'),
            sub: tr('ERP, payments, e-invoicing', 'ERP والدفع والفوترة'),
        },
        {
            cy: 105,
            label: tr('Interface', 'الواجهة'),
            sub: tr('Arabic and English', 'بالعربية والإنجليزية'),
        },
    ];

    return (
        <>
            {layers.map((l) => (
                <line
                    key={`tick-${l.cy}`}
                    x1={mx(370)}
                    y1={l.cy}
                    x2={rail}
                    y2={l.cy}
                    className="sv-svg-dash"
                />
            ))}
            <line
                x1={rail}
                y1={105}
                x2={rail}
                y2={295}
                className="sv-svg-line"
            />
            {signal(`M${rail} 105 L${rail} 295`, 4)}
            {layers.map((l, i) => (
                <g key={l.cy}>
                    <Plate cx={cx} cy={l.cy} hi={i === layers.length - 1} />
                    <text
                        x={cx}
                        y={l.cy - 2}
                        textAnchor="middle"
                        className="sv-svg-text"
                    >
                        {l.label}
                    </text>
                    <text
                        x={cx}
                        y={l.cy + 18}
                        textAnchor="middle"
                        className="sv-svg-small"
                    >
                        {l.sub}
                    </text>
                </g>
            ))}
        </>
    );
}

function FlowNode({
    x,
    y,
    label,
    sub,
    hi = false,
}: {
    x: number;
    y: number;
    label: string;
    sub: string;
    hi?: boolean;
}) {
    return (
        <g>
            <rect
                x={x - 78}
                y={y - 28}
                width={156}
                height={56}
                className={hi ? 'sv-svg-face-hi' : 'sv-svg-face'}
            />
            <text x={x} y={y - 3} textAnchor="middle" className="sv-svg-text">
                {label}
            </text>
            <text x={x} y={y + 16} textAnchor="middle" className="sv-svg-small">
                {sub}
            </text>
        </g>
    );
}

function Automation({ tr, mx, signal }: DiagramProps) {
    const a = mx(120);
    const b = mx(360);
    const path = `M${a} 70 L${b} 70 L${b} 180 L${a} 180 L${a} 290`;

    return (
        <>
            <path d={path} className="sv-svg-line" />
            <path d={`M${b} 98 L${b} 152`} className="sv-svg-line" />
            <path
                d={`M${mx(438)} 70 L${mx(458)} 70 L${mx(458)} 290 L${mx(438)} 290`}
                className="sv-svg-dash"
            />
            {signal(path, 6)}
            <FlowNode
                x={a}
                y={70}
                label={tr('New order', 'طلب جديد')}
                sub={tr('Website or email', 'من الموقع أو البريد')}
            />
            <FlowNode
                x={b}
                y={70}
                label={tr('Validate', 'التحقق')}
                sub={tr('Rules and AI reading', 'قواعد وقراءة آلية')}
            />
            <FlowNode
                x={b}
                y={180}
                label={tr('Create in ERP', 'إدخال في ERP')}
                sub={tr('No re-typing', 'دون إعادة كتابة')}
            />
            <FlowNode
                x={a}
                y={180}
                label={tr('Issue invoice', 'إصدار الفاتورة')}
                sub={tr('E-invoice format', 'فاتورة إلكترونية')}
            />
            <FlowNode
                x={a}
                y={290}
                label={tr('Notify the team', 'إشعار الفريق')}
                sub={tr('Email or Teams', 'بريد أو Teams')}
            />
            <FlowNode
                x={b}
                y={290}
                label={tr('Unsure?', 'غير متأكد؟')}
                sub={tr('A person reviews', 'يراجعه موظف')}
                hi
            />
        </>
    );
}

function BrowserWindow({
    x,
    y,
    rtl,
    url,
    front = false,
}: {
    x: number;
    y: number;
    rtl: boolean;
    url: string;
    front?: boolean;
}) {
    const w = 300;
    const h = 230;
    // Content lines anchor to the reading start of that window's language.
    const line = (offset: number, width: number, yy: number, hi = false) => (
        <rect
            x={rtl ? x + w - 20 - offset - width : x + 20 + offset}
            y={yy}
            width={width}
            height={hi ? 12 : 7}
            className={hi ? 'sv-svg-dot' : 'sv-svg-bar'}
        />
    );

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={h}
                className={front ? 'sv-svg-face' : 'sv-svg-face'}
                strokeOpacity={front ? 1 : 0.6}
            />
            <line
                x1={x}
                y1={y + 30}
                x2={x + w}
                y2={y + 30}
                className="sv-svg-line"
            />
            {[0, 1, 2].map((i) => (
                <circle
                    key={i}
                    cx={x + 16 + i * 12}
                    cy={y + 15}
                    r={3.5}
                    className="sv-svg-bar"
                />
            ))}
            <rect
                x={x + 70}
                y={y + 8}
                width={160}
                height={14}
                className="sv-svg-face"
            />
            <text
                x={x + 150}
                y={y + 19}
                textAnchor="middle"
                className="sv-svg-small"
                style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
            >
                {url}
            </text>
            {line(0, 110, y + 52, true)}
            {line(0, 200, y + 76)}
            {line(0, 160, y + 90)}
            {[0, 1, 2].map((i) => (
                <rect
                    key={i}
                    x={
                        rtl
                            ? x + w - 20 - (i + 1) * 80 - i * 10
                            : x + 20 + i * 90
                    }
                    y={y + 116}
                    width={80}
                    height={84}
                    className="sv-svg-face"
                />
            ))}
        </g>
    );
}

function Web({ tr }: DiagramProps) {
    return (
        <>
            <BrowserWindow x={40} y={46} rtl={false} url={tr('/en', '/en')} />
            <BrowserWindow x={140} y={124} rtl url={tr('/ar', '/ar')} front />
        </>
    );
}

function Phone({
    x,
    y,
    children,
}: {
    x: number;
    y: number;
    children?: ReactNode;
}) {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={150}
                height={290}
                rx={22}
                className="sv-svg-face"
            />
            <rect
                x={x + 55}
                y={y + 12}
                width={40}
                height={6}
                rx={3}
                className="sv-svg-bar"
            />
            {children}
        </g>
    );
}

function Mobile({ tr, bx, mx, startAnchor }: DiagramProps) {
    const back = bx(270, 150);
    const front = bx(90, 150);
    const rtl = startAnchor === 'end';

    return (
        <>
            <Phone x={back} y={36}>
                {[0, 1, 2].map((i) => (
                    <rect
                        key={i}
                        x={back + 18}
                        y={86 + i * 40}
                        width={114}
                        height={28}
                        className="sv-svg-face"
                    />
                ))}
                <rect
                    x={back + 18}
                    y={212}
                    width={114}
                    height={30}
                    className="sv-svg-dot"
                />
            </Phone>
            <Phone x={front} y={70}>
                <rect
                    x={rtl ? front + 52 : front + 18}
                    y={106}
                    width={80}
                    height={10}
                    className="sv-svg-dot"
                />
                {[0, 1, 2, 3].map((i) => (
                    <g key={i}>
                        <circle
                            cx={rtl ? front + 120 : front + 30}
                            cy={148 + i * 40}
                            r={10}
                            className="sv-svg-face"
                        />
                        <rect
                            x={rtl ? front + 30 : front + 48}
                            y={142 + i * 40}
                            width={72}
                            height={6}
                            className="sv-svg-bar"
                        />
                        <rect
                            x={rtl ? front + 54 : front + 48}
                            y={154 + i * 40}
                            width={48}
                            height={5}
                            className="sv-svg-bar"
                        />
                    </g>
                ))}
                <line
                    x1={front}
                    y1={322}
                    x2={front + 150}
                    y2={322}
                    className="sv-svg-line"
                />
                {[0, 1, 2, 3].map((i) => (
                    <circle
                        key={i}
                        cx={rtl ? front + 120 - i * 30 : front + 30 + i * 30}
                        cy={341}
                        r={4}
                        className={i === 0 ? 'sv-svg-dot' : 'sv-svg-bar'}
                    />
                ))}
            </Phone>
            <rect
                x={bx(250, 200)}
                y={344}
                width={200}
                height={36}
                className="sv-svg-face-hi"
            />
            <text
                x={mx(350)}
                y={367}
                textAnchor="middle"
                className="sv-svg-text"
            >
                {tr('Saved offline, syncing', 'محفوظ دون اتصال')}
            </text>
        </>
    );
}

function Qa({ tr, mx, bx, startAnchor, signal }: DiagramProps) {
    const rows = [
        { label: tr('Sign in', 'تسجيل الدخول'), ok: true },
        { label: tr('Search', 'البحث'), ok: true },
        { label: tr('Add to cart', 'إضافة إلى السلة'), ok: true },
        { label: tr('Checkout', 'إتمام الشراء'), ok: true },
        { label: tr('Arabic invoice PDF', 'فاتورة PDF بالعربية'), ok: false },
        { label: tr('Refund', 'الاسترجاع'), ok: true },
    ];
    const endAnchor = startAnchor === 'start' ? 'end' : 'start';

    return (
        <>
            <rect
                x={36}
                y={36}
                width={408}
                height={320}
                className="sv-svg-face"
            />
            <text
                x={mx(60)}
                y={68}
                textAnchor={startAnchor}
                className="sv-svg-text"
            >
                {tr('Regression run', 'اختبار الانحدار')}
            </text>
            <text
                x={mx(420)}
                y={68}
                textAnchor={endAnchor}
                className="sv-svg-small"
            >
                {tr('Release candidate', 'مرشّح للإصدار')}
            </text>
            <line x1={36} y1={84} x2={444} y2={84} className="sv-svg-line" />
            {rows.map((r, i) => {
                const yy = 112 + i * 34;

                return (
                    <g key={r.label}>
                        <text
                            x={mx(60)}
                            y={yy + 5}
                            textAnchor={startAnchor}
                            className={r.ok ? 'sv-svg-small' : 'sv-svg-text'}
                        >
                            {r.label}
                        </text>
                        {r.ok ? (
                            <path
                                d={`M${bx(406, 14)} ${yy} l5 5 l9 -10`}
                                className="sv-svg-accent"
                            />
                        ) : (
                            <>
                                <path
                                    d={`M${bx(406, 10)} ${yy - 5} l10 10 m0 -10 l-10 10`}
                                    className="sv-svg-accent"
                                />
                                <text
                                    x={mx(380)}
                                    y={yy + 5}
                                    textAnchor={endAnchor}
                                    className="sv-svg-small"
                                >
                                    {tr('Blocking', 'خلل معيق')}
                                </text>
                            </>
                        )}
                        <line
                            x1={60}
                            y1={yy + 17}
                            x2={420}
                            y2={yy + 17}
                            className="sv-svg-line"
                            strokeOpacity={0.4}
                        />
                    </g>
                );
            })}
            <rect
                x={60}
                y={322}
                width={360}
                height={6}
                className="sv-svg-bar"
            />
            <rect
                x={bx(60, 300)}
                y={322}
                width={300}
                height={6}
                className="sv-svg-dot"
            />
            {signal(`M60 325 L420 325`, 4.5)}
        </>
    );
}

function Cyber({ tr, mx, bx, signal }: DiagramProps) {
    const cx = 240;
    const cy = 205;
    const rings = [
        { r: 150, label: tr('Internet-facing', 'المكشوف على الإنترنت') },
        { r: 102, label: tr('Application', 'التطبيق') },
        { r: 54, label: tr('Data', 'البيانات') },
    ];
    const nodes = [40, 125, 180, 235];
    const finding = 65;
    const pt = (deg: number, r: number) => ({
        x: cx + r * Math.sin((deg * Math.PI) / 180),
        y: cy - r * Math.cos((deg * Math.PI) / 180),
    });
    const fp = pt(finding, 150);
    const f = { x: mx(fp.x), y: fp.y };

    return (
        <>
            {rings.map((ring) => (
                <g key={ring.r}>
                    <circle
                        cx={cx}
                        cy={cy}
                        r={ring.r}
                        className="sv-svg-line"
                    />
                    <text
                        x={cx}
                        y={cy - ring.r + 22}
                        textAnchor="middle"
                        className="sv-svg-small"
                    >
                        {ring.label}
                    </text>
                </g>
            ))}
            {signal(
                `M${cx} ${cy - 150} A150 150 0 1 1 ${cx - 0.1} ${cy - 150}`,
                9,
            )}
            {nodes.map((d) => {
                const p = pt(d, 150);

                return (
                    <rect
                        key={d}
                        x={p.x - 6}
                        y={p.y - 6}
                        width={12}
                        height={12}
                        className="sv-svg-face"
                    />
                );
            })}
            <rect
                x={f.x - 8}
                y={f.y - 8}
                width={16}
                height={16}
                className="sv-svg-face-hi"
            />
            <path
                d={`M${f.x} ${f.y + 8} L${f.x} 322`}
                className="sv-svg-dash"
            />
            <g>
                <rect
                    x={bx(292, 176)}
                    y={322}
                    width={176}
                    height={52}
                    className="sv-svg-face-hi"
                />
                <text
                    x={mx(380)}
                    y={344}
                    textAnchor="middle"
                    className="sv-svg-text"
                >
                    {tr('Exposed admin panel', 'لوحة إدارة مكشوفة')}
                </text>
                <text
                    x={mx(380)}
                    y={363}
                    textAnchor="middle"
                    className="sv-svg-small"
                >
                    {tr('Fixed and retested', 'أُصلحت وأُعيد فحصها')}
                </text>
            </g>
        </>
    );
}

/** Index hero: one system with the four disciplines around it. */
function System({ tr, mx, signal }: DiagramProps) {
    const cx = 240;
    const cy = 200;
    const r = 132;
    const nodes = [
        { x: cx, y: cy - r, label: tr('Build', 'بناء'), hi: true },
        { x: mx(cx + r), y: cy, label: tr('Test', 'اختبار') },
        { x: cx, y: cy + r, label: tr('Secure', 'تأمين') },
        { x: mx(cx - r), y: cy, label: tr('Automate', 'أتمتة'), hi: true },
    ];

    return (
        <>
            <circle cx={cx} cy={cy} r={r} className="sv-svg-dash" />
            <line
                x1={cx}
                y1={cy - r}
                x2={cx}
                y2={cy + r}
                className="sv-svg-line"
                strokeOpacity={0.5}
            />
            <line
                x1={cx - r}
                y1={cy}
                x2={cx + r}
                y2={cy}
                className="sv-svg-line"
                strokeOpacity={0.5}
            />
            {signal(
                `M${cx} ${cy - r} A${r} ${r} 0 1 ${mx(1) === 1 ? 1 : 0} ${cx - (mx(1) === 1 ? 0.1 : -0.1)} ${cy - r}`,
                10,
            )}
            <polygon
                points={`${cx},${cy - 56} ${cx + 56},${cy} ${cx},${cy + 56} ${cx - 56},${cy}`}
                className="sv-svg-face-hi"
            />
            <text x={cx} y={cy + 5} textAnchor="middle" className="sv-svg-text">
                {tr('Your system', 'نظامك')}
            </text>
            {nodes.map((n) => (
                <g key={n.label}>
                    {/* Opaque underlay so the orbiting signal passes behind. */}
                    <rect
                        x={n.x - 50}
                        y={n.y - 20}
                        width={100}
                        height={40}
                        className="sv-svg-face"
                    />
                    <rect
                        x={n.x - 50}
                        y={n.y - 20}
                        width={100}
                        height={40}
                        className={n.hi ? 'sv-svg-face-hi' : 'sv-svg-face'}
                    />
                    <text
                        x={n.x}
                        y={n.y + 5}
                        textAnchor="middle"
                        className="sv-svg-text"
                    >
                        {n.label}
                    </text>
                </g>
            ))}
        </>
    );
}

const DIAGRAMS: Record<ServiceSlug | 'system', (p: DiagramProps) => ReactNode> =
    {
        development: Development,
        automation: Automation,
        'web-development': Web,
        'mobile-apps': Mobile,
        qa: Qa,
        cybersecurity: Cyber,
        system: System,
    };

// Diagrams that depict a specific example rather than a structure.
const ILLUSTRATIVE = new Set(['automation', 'qa', 'cybersecurity']);

type Props = {
    kind: ServiceSlug | 'system';
    label: string;
};

export default function ServiceVisual({ kind, label }: Props) {
    const { isRTL, t } = useLocale();
    const reduced = useReducedMotion();
    const tr: Tr = (en, ar) => (isRTL ? ar : en);
    const Diagram = DIAGRAMS[kind];

    const props: DiagramProps = {
        tr,
        mx: (x) => (isRTL ? W - x : x),
        bx: (x, w) => (isRTL ? W - x - w : x),
        startAnchor: isRTL ? 'end' : 'start',
        signal: (path, dur) =>
            reduced ? null : <Signal path={path} dur={dur} />,
    };

    return (
        <figure className="sv-figure">
            <svg viewBox="0 0 480 400" role="img" aria-label={label}>
                <Diagram {...props} />
            </svg>
            {ILLUSTRATIVE.has(kind) && (
                <figcaption>{t('services.page.illustrative')}</figcaption>
            )}
        </figure>
    );
}
