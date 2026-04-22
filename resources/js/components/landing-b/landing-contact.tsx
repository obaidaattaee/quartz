import { useState } from 'react';

import { useLocale } from '@/hooks/use-locale';

import { B, monoStyle } from './tokens';

type FormState = {
    name: string;
    company: string;
    email: string;
    scope: string;
    msg: string;
};

function Field({
    label,
    value,
    onChange,
    type = 'text',
}: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}) {
    return (
        <div
            style={{
                padding: '16px 0',
                borderBottom: `1px solid ${B.line}`,
            }}
        >
            <div style={monoStyle}>{label}</div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder="—"
                style={{
                    width: '100%',
                    marginTop: 10,
                    background: 'transparent',
                    color: B.cream,
                    border: 'none',
                    padding: '4px 0',
                    fontFamily: B.serif,
                    fontSize: 22,
                    outline: 'none',
                    fontWeight: 400,
                }}
            />
        </div>
    );
}

export default function LandingContact() {
    const { isRTL } = useLocale();
    const defaultScope = isRTL ? 'بناء برمجيات' : 'Software build';
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState<FormState>({
        name: '',
        company: '',
        email: '',
        scope: defaultScope,
        msg: '',
    });

    const set =
        (k: keyof FormState) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm({ ...form, [k]: e.target.value });

    const scopes = isRTL
        ? [
              'بناء برمجيات',
              'جودة واختبار',
              'أمن سيبراني',
              'أتمتة',
              'Quartz POS',
              'Quartz Cyber',
          ]
        : [
              'Software build',
              'QA & testing',
              'Cybersecurity',
              'Automation',
              'Quartz POS',
              'Quartz Cyber',
          ];

    return (
        <section
            style={{
                padding: '100px 48px',
                background: B.bgElev,
                borderTop: `1px solid ${B.line}`,
            }}
        >
            <div style={{ maxWidth: 1240, margin: '0 auto' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 80,
                        alignItems: 'start',
                    }}
                    className="contact-grid"
                >
                    <div>
                        <div style={monoStyle}>
                            {isRTL
                                ? 'سادساً.\u00a0\u00a0\u00a0لنبدأ الحديث'
                                : 'VI.\u00a0\u00a0\u00a0Start a conversation'}
                        </div>
                        <h2
                            style={{
                                fontFamily: B.serif,
                                fontSize: 80,
                                lineHeight: 0.98,
                                fontWeight: 400,
                                letterSpacing: '-0.03em',
                                margin: '18px 0 28px',
                                textWrap:
                                    'balance' as React.CSSProperties['textWrap'],
                            }}
                            className="contact-title"
                        >
                            {isRTL ? 'أخبرنا أين' : 'Tell us where'}
                            <br />
                            <em
                                style={{
                                    color: B.accent,
                                    fontWeight: 300,
                                }}
                            >
                                {isRTL ? 'تؤلمك المشكلة.' : 'it hurts.'}
                            </em>
                        </h2>
                        <p
                            style={{
                                fontSize: 18,
                                color: B.dim,
                                lineHeight: 1.6,
                                margin: '0 0 40px',
                                maxWidth: 500,
                            }}
                        >
                            {isRTL
                                ? 'ردّ كتابي خلال 48 ساعة — بالنطاق والملاءمة، ومع مهندس رئيسي معيّن بالاسم. دون التزام.'
                                : 'A written response in 48h — with scope, fit, and a named principal engineer. No obligation.'}
                        </p>
                        <div
                            style={{
                                borderTop: `1px solid ${B.line}`,
                                paddingTop: 28,
                            }}
                        >
                            {(isRTL
                                ? [
                                      ['01', 'نقرأ طلبك خلال 24 ساعة.'],
                                      [
                                          '02',
                                          'مهندس رئيسي يرد — ليس مندوب تطوير أعمال.',
                                      ],
                                      [
                                          '03',
                                          'إن كان هناك ملاءمة، نحدّد مكالمة مدتها 30 دقيقة.',
                                      ],
                                      [
                                          '04',
                                          'تحصل على خارطة طريق مكتوبة. دون التزام.',
                                      ],
                                  ]
                                : [
                                      ['01', 'We read your brief within 24h.'],
                                      [
                                          '02',
                                          'A principal engineer replies — not a BD rep.',
                                      ],
                                      [
                                          '03',
                                          'If there’s fit, we schedule a 30-min call.',
                                      ],
                                      [
                                          '04',
                                          'You get a written roadmap. No obligation.',
                                      ],
                                  ]
                            ).map(([n, text]) => (
                                <div
                                    key={n}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '40px 1fr',
                                        gap: 16,
                                        padding: '14px 0',
                                        borderBottom: `1px solid ${B.line}`,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: B.mono,
                                            fontSize: 11,
                                            color: B.accent,
                                            letterSpacing: '0.14em',
                                        }}
                                    >
                                        {n}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 15,
                                            color: B.cream,
                                        }}
                                    >
                                        {text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setSent(true);
                        }}
                        style={{
                            border: `1px solid ${B.line}`,
                            padding: 36,
                            background: B.bg,
                        }}
                    >
                        {sent ? (
                            <div
                                style={{
                                    padding: 40,
                                    textAlign: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 56,
                                        color: B.accent,
                                        fontFamily: B.serif,
                                    }}
                                >
                                    ✓
                                </div>
                                <h3
                                    style={{
                                        fontFamily: B.serif,
                                        fontSize: 32,
                                        margin: '12px 0 8px',
                                        fontWeight: 400,
                                    }}
                                >
                                    {isRTL ? 'تمّ الاستلام.' : 'Received.'}
                                </h3>
                                <p
                                    style={{
                                        color: B.dim,
                                        fontSize: 15,
                                        margin: 0,
                                    }}
                                >
                                    {isRTL
                                        ? 'سيتواصل معك مهندس رئيسي خلال 24 ساعة.'
                                        : 'A principal engineer will reach out within 24h.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <Field
                                    label={isRTL ? 'اسمك' : 'Your name'}
                                    value={form.name}
                                    onChange={set('name')}
                                />
                                <Field
                                    label={isRTL ? 'الشركة' : 'Company'}
                                    value={form.company}
                                    onChange={set('company')}
                                />
                                <Field
                                    label={
                                        isRTL
                                            ? 'بريد العمل'
                                            : 'Work email'
                                    }
                                    value={form.email}
                                    onChange={set('email')}
                                    type="email"
                                />
                                <div
                                    style={{
                                        padding: '16px 0',
                                        borderBottom: `1px solid ${B.line}`,
                                    }}
                                >
                                    <div style={monoStyle}>
                                        {isRTL ? 'النطاق' : 'Scope'}
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 8,
                                            marginTop: 12,
                                        }}
                                    >
                                        {scopes.map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() =>
                                                    setForm({
                                                        ...form,
                                                        scope: s,
                                                    })
                                                }
                                                style={{
                                                    padding: '8px 14px',
                                                    background:
                                                        form.scope === s
                                                            ? B.accent
                                                            : 'transparent',
                                                    color:
                                                        form.scope === s
                                                            ? B.bg
                                                            : B.cream,
                                                    border: `1px solid ${form.scope === s ? B.accent : B.line}`,
                                                    fontSize: 12,
                                                    cursor: 'pointer',
                                                    borderRadius: 999,
                                                }}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ padding: '16px 0' }}>
                                    <div style={monoStyle}>
                                        {isRTL
                                            ? 'ما الذي تحتاج بناءه أو تأمينه؟'
                                            : 'What do you need built or secured?'}
                                    </div>
                                    <textarea
                                        value={form.msg}
                                        onChange={set('msg')}
                                        rows={4}
                                        style={{
                                            width: '100%',
                                            marginTop: 12,
                                            background: 'transparent',
                                            color: B.cream,
                                            border: `1px solid ${B.line}`,
                                            padding: 14,
                                            fontFamily: B.sans,
                                            fontSize: 15,
                                            resize: 'vertical',
                                        }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    style={{
                                        marginTop: 12,
                                        background: B.accent,
                                        color: B.bg,
                                        border: 'none',
                                        padding: '16px 24px',
                                        fontSize: 14,
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                    }}
                                >
                                    {isRTL
                                        ? 'أرسل الطلب ↖'
                                        : 'Send brief ↗'}
                                </button>
                            </>
                        )}
                    </form>
                </div>
            </div>
            <style>{`
                @media (max-width: 900px) {
                    .contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
                    .contact-title { font-size: 56px !important; }
                }
            `}</style>
        </section>
    );
}
