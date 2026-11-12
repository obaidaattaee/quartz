import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useId, useRef, useState } from 'react';

import { useContactDraft } from '@/hooks/use-contact-draft';
import { useLocale } from '@/hooks/use-locale';
import { serviceFromUrl } from '@/lib/contact-service';
import { contactErrors, focusContactError } from '@/lib/contact-validation';
import { B, monoStyle } from './tokens';

type Service =
    | 'development'
    | 'qa'
    | 'cybersecurity'
    | 'automation'
    | 'general';

type FormData = {
    name: string;
    email: string;
    phone: string;
    company: string;
    service: Service;
    message: string;
    _honeypot: string;
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    marginTop: 10,
    background: 'transparent',
    color: B.cream,
    border: 'none',
    padding: '4px 0',
    fontFamily: B.serif,
    fontSize: 22,
    fontWeight: 400,
    minHeight: 44,
};

function FieldError({ id, message }: { id: string; message?: string }) {
    if (!message) {
        return null;
    }

    return (
        <p
            id={id}
            role="alert"
            style={{ margin: '8px 0 0', fontSize: 13, color: B.accent }}
        >
            {message}
        </p>
    );
}

function Field({
    name,
    label,
    value,
    onChange,
    error,
    type = 'text',
    required = false,
    autoComplete,
}: {
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    type?: string;
    required?: boolean;
    autoComplete?: string;
}) {
    const id = useId();
    const errorId = `${id}-error`;

    return (
        <div
            style={{
                padding: '16px 0',
                borderBottom: `1px solid ${error ? B.accent : B.line}`,
            }}
        >
            <label htmlFor={id} style={{ ...monoStyle, display: 'block' }}>
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                autoComplete={autoComplete}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className="q-contact-input"
                style={inputStyle}
            />
            <FieldError id={errorId} message={error} />
        </div>
    );
}

export default function LandingContact() {
    const { locale, isRTL, t } = useLocale();
    const tr = (en: string, ar: string) => (isRTL ? ar : en);
    const formRef = useRef<HTMLFormElement>(null);
    const successRef = useRef<HTMLHeadingElement>(null);
    const [sent, setSent] = useState(false);
    const scopeLabelId = useId();
    const messageId = useId();

    const { url } = usePage();

    const form = useForm<FormData>({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: serviceFromUrl(url) ?? 'development',
        message: '',
        _honeypot: '',
    });
    const { data, setData, processing, errors } = form;

    const clearDraft = useContactDraft(
        'quartz-home-contact-draft',
        data,
        setData,
    );
    const fieldErrors = errors;
    useEffect(() => {
        if (sent) {
            successRef.current?.focus();
        }
    }, [sent]);

    const scopes: Array<[Service, string]> = [
        ['development', tr('Software build', 'بناء برمجيات')],
        ['qa', tr('QA & testing', 'جودة واختبار')],
        ['cybersecurity', tr('Cybersecurity', 'أمن سيبراني')],
        ['automation', tr('Automation', 'أتمتة')],
        ['general', tr('Not sure yet', 'لم أحدّد بعد')],
    ];

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        form.clearErrors();
        const validation = contactErrors(data, t);

        if (Object.keys(validation).length) {
            form.setError(validation);
            focusContactError(formRef.current, validation);

            return;
        }

        // The contacts table has no company column; carry it in the message.
        const companyName = data.company.trim();
        form.transform((d) => ({
            ...d,
            message:
                companyName && d.message.trim()
                    ? `${tr('Company', 'الشركة')}: ${companyName}\n\n${d.message}`
                    : d.message,
        }));
        form.post(`/${locale}/contact`, {
            preserveScroll: true,
            onError: (serverErrors) =>
                focusContactError(formRef.current, serverErrors),
            onSuccess: () => {
                clearDraft();
                form.reset();
                setSent(true);
            },
        });
    }

    return (
        <section
            id="contact"
            className="q-sec"
            style={{
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
                            {tr('Start a conversation', 'لنبدأ الحديث')}
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
                            {isRTL ? 'حدّثنا عن' : 'Tell us what'}
                            <br />
                            <em
                                style={{
                                    color: B.accent,
                                    fontWeight: 300,
                                }}
                            >
                                {isRTL
                                    ? 'المشكلة التي تريد حلّها.'
                                    : 'you need to solve.'}
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
                                ? 'يردّ عليك مهندس خلال 24 ساعة ليوضّح مدى ملاءمة المشروع والخطوة التالية، دون التزام.'
                                : 'An engineer will reply within 24 hours to confirm whether we can help and suggest the next step. No obligation.'}
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
                                      ['02', 'يردّ عليك مهندس من الفريق.'],
                                      [
                                          '03',
                                          'إذا كان المشروع مناسباً، نتفق على مكالمة مجانية مدتها 30 دقيقة.',
                                      ],
                                      [
                                          '04',
                                          'تحصل على خارطة طريق مكتوبة. دون التزام.',
                                      ],
                                  ]
                                : [
                                      [
                                          '01',
                                          'We read your brief within 24 hours.',
                                      ],
                                      [
                                          '02',
                                          'An engineer from the team replies to your inquiry.',
                                      ],
                                      [
                                          '03',
                                          'If it’s a fit, we agree a free 30-minute call.',
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
                        ref={formRef}
                        noValidate
                        onSubmit={submit}
                        aria-label={tr('Project brief', 'طلب مشروع')}
                        className="q-contact-form"
                        style={{
                            border: `1px solid ${B.line}`,
                            background: B.bg,
                        }}
                    >
                        {sent ? (
                            <div
                                role="status"
                                style={{
                                    padding: 40,
                                    textAlign: 'center',
                                }}
                            >
                                <div
                                    aria-hidden="true"
                                    style={{
                                        fontSize: 56,
                                        color: B.accent,
                                        fontFamily: B.serif,
                                    }}
                                >
                                    ✓
                                </div>
                                <h3
                                    ref={successRef}
                                    tabIndex={-1}
                                    style={{
                                        fontFamily: B.serif,
                                        fontSize: 32,
                                        margin: '12px 0 8px',
                                        fontWeight: 400,
                                    }}
                                >
                                    {tr('Received.', 'تمّ الاستلام.')}
                                </h3>
                                <p
                                    style={{
                                        color: B.dim,
                                        fontSize: 15,
                                        margin: 0,
                                    }}
                                >
                                    {tr(
                                        'A principal engineer will reach out within 24 hours.',
                                        'سيتواصل معك مهندس رئيسي خلال 24 ساعة.',
                                    )}
                                </p>
                            </div>
                        ) : (
                            <>
                                <Field
                                    name="name"
                                    label={tr('Your name', 'اسمك')}
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    error={fieldErrors.name}
                                    autoComplete="name"
                                    required
                                />
                                <Field
                                    name="company"
                                    label={tr(
                                        'Company (optional)',
                                        'الشركة (اختياري)',
                                    )}
                                    value={data.company}
                                    onChange={(e) =>
                                        setData('company', e.target.value)
                                    }
                                    autoComplete="organization"
                                />
                                <Field
                                    name="email"
                                    label={tr('Work email', 'بريد العمل')}
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    error={fieldErrors.email}
                                    type="email"
                                    autoComplete="email"
                                    required
                                />
                                <div
                                    style={{
                                        padding: '16px 0',
                                        borderBottom: `1px solid ${B.line}`,
                                    }}
                                >
                                    <div id={scopeLabelId} style={monoStyle}>
                                        {tr(
                                            'Service you need',
                                            'الخدمة التي تحتاجها',
                                        )}
                                    </div>
                                    <div
                                        role="radiogroup"
                                        aria-labelledby={scopeLabelId}
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 8,
                                            marginTop: 12,
                                        }}
                                    >
                                        {scopes.map(([value, label]) => {
                                            const on = data.service === value;

                                            return (
                                                <label
                                                    key={value}
                                                    className="q-contact-chip"
                                                    style={{
                                                        minHeight: 40,
                                                        padding: '8px 14px',
                                                        background: on
                                                            ? B.accent
                                                            : 'transparent',
                                                        color: on
                                                            ? B.bg
                                                            : B.cream,
                                                        border: `1px solid ${on ? B.accent : B.line}`,
                                                        fontSize: 13,
                                                        cursor: 'pointer',
                                                        borderRadius: 999,
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="service"
                                                        value={value}
                                                        checked={on}
                                                        onChange={() =>
                                                            setData(
                                                                'service',
                                                                value,
                                                            )
                                                        }
                                                        aria-invalid={
                                                            !!fieldErrors.service
                                                        }
                                                        aria-describedby={
                                                            fieldErrors.service
                                                                ? `${scopeLabelId}-error`
                                                                : undefined
                                                        }
                                                        className="sr-only"
                                                    />
                                                    {label}
                                                </label>
                                            );
                                        })}
                                    </div>
                                    <FieldError
                                        id={`${scopeLabelId}-error`}
                                        message={fieldErrors.service}
                                    />
                                </div>
                                <div style={{ padding: '16px 0' }}>
                                    <label
                                        htmlFor={messageId}
                                        style={{
                                            ...monoStyle,
                                            display: 'block',
                                        }}
                                    >
                                        {tr(
                                            'What do you need help with?',
                                            'ما المشكلة التي تريد حلّها؟',
                                        )}
                                    </label>
                                    <textarea
                                        id={messageId}
                                        name="message"
                                        value={data.message}
                                        onChange={(e) =>
                                            setData('message', e.target.value)
                                        }
                                        rows={4}
                                        required
                                        minLength={10}
                                        maxLength={4800}
                                        aria-invalid={
                                            fieldErrors.message
                                                ? true
                                                : undefined
                                        }
                                        aria-describedby={`${messageId}-hint ${fieldErrors.message ? `${messageId}-error` : ''}`}
                                        className="q-contact-input"
                                        style={{
                                            width: '100%',
                                            marginTop: 12,
                                            background: 'transparent',
                                            color: B.cream,
                                            border: `1px solid ${fieldErrors.message ? B.accent : B.line}`,
                                            padding: 14,
                                            fontFamily: B.sans,
                                            fontSize: 15,
                                            resize: 'vertical',
                                        }}
                                    />
                                    <p
                                        id={`${messageId}-hint`}
                                        style={{ color: B.dim, fontSize: 13 }}
                                    >
                                        {t('contact.validation.message')}
                                    </p>
                                    <FieldError
                                        id={`${messageId}-error`}
                                        message={fieldErrors.message}
                                    />
                                </div>
                                {/* Spam trap: hidden from people and assistive tech. */}
                                <input
                                    type="text"
                                    name="_honeypot"
                                    value={data._honeypot}
                                    onChange={(e) =>
                                        setData('_honeypot', e.target.value)
                                    }
                                    tabIndex={-1}
                                    autoComplete="off"
                                    aria-hidden="true"
                                    style={{
                                        position: 'absolute',
                                        width: 1,
                                        height: 1,
                                        opacity: 0,
                                        pointerEvents: 'none',
                                        insetInlineStart: -9999,
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={processing}
                                    aria-busy={processing || undefined}
                                    style={{
                                        marginTop: 12,
                                        minHeight: 48,
                                        background: B.accent,
                                        color: B.bg,
                                        border: 'none',
                                        padding: '14px 24px',
                                        fontSize: 14,
                                        fontWeight: 500,
                                        cursor: processing
                                            ? 'progress'
                                            : 'pointer',
                                        opacity: processing ? 0.6 : 1,
                                    }}
                                >
                                    {processing
                                        ? tr('Sending…', 'جارٍ الإرسال…')
                                        : tr('Send brief ↗', 'أرسل الطلب ↖')}
                                </button>
                                <p
                                    style={{
                                        color: B.dim,
                                        fontSize: 14,
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {t('contact.nextSteps')}
                                </p>
                            </>
                        )}
                    </form>
                </div>
            </div>
            <style>{`
                .q-contact-form { position: relative; padding: 36px; }
                .q-contact-input:focus-visible, .q-contact-chip:has(input:focus-visible) { outline: 2px solid var(--q-accent); outline-offset: 2px; }
                @media (max-width: 900px) {
                    .contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
                    .contact-title { font-size: clamp(40px, 11vw, 56px) !important; }
                }
                @media (max-width: 540px) {
                    .q-contact-form { padding: 20px; }
                }
            `}</style>
        </section>
    );
}
