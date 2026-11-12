import { Link } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useLocale } from '@/hooks/use-locale';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { createWorld } from './world-engine';
import type { WorldHandle, WorldLabels, WorldStep } from './world-engine';

type StepCopy = {
    id: WorldStep;
    kicker?: string;
    title: string;
    body: string;
};

export default function LandingWorld() {
    const { locale, isRTL } = useLocale();
    const reduceMotion = useReducedMotion();
    const stageRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const worldRef = useRef<WorldHandle | null>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const openerRef = useRef<HTMLElement | null>(null);
    const [traceHop, setTraceHop] = useState(-1);
    const [paused, setPaused] = useState(false);
    const [selected, setSelected] = useState(-1);

    const labels: WorldLabels = useMemo(
        () =>
            isRTL
                ? {
                      product: (n) => `منتج حي ${n}`,
                      select: 'اختر للعرض',
                      newWing: (p, f, of) =>
                          `جناح جديد لـ ${p} · الطابق ${f} من ${of}`,
                      traceSteps: [
                          'طلب جديد',
                          'تم التحقق',
                          'مزامنة مع ERP',
                          'إشعار الفريق',
                      ],
                      blocked: 'تم حظر الطلب',
                      blockedNote: 'قاعدة WAF وتحديد معدل، توضيحي',
                  }
                : {
                      product: (n) => `Live product ${n}`,
                      select: 'Select to view',
                      newWing: (p, f, of) =>
                          `New wing for ${p} · floor ${f} of ${of}`,
                      traceSteps: [
                          'Order placed',
                          'Validated',
                          'Synced to ERP',
                          'Team notified',
                      ],
                      blocked: 'Request blocked',
                      blockedNote: 'WAF rule + rate limit, illustrative',
                  },
        [isRTL],
    );

    const steps: StepCopy[] = isRTL
        ? [
              {
                  id: 'intro',
                  kicker: 'كيف نعمل',
                  title: 'فريق واحد. أربعة أطقم تعمل على كل منتج.',
                  body: 'كل مبنى منتج حي نبنيه ونشغّله. تابع التمرير لترى عمل كل طاقم.',
              },
              {
                  id: 'dev',
                  kicker: 'تطوير البرمجيات',
                  title: 'نبني البرمجيات التي يعمل عليها عملك.',
                  body: 'منصات ويب وتطبيقات جوال وواجهات برمجية وأدوات داخلية، يصمّمها ويبنيها ويطلقها فريق واحد.',
              },
              {
                  id: 'auto',
                  kicker: 'الأتمتة',
                  title: 'اربط أنظمتك. تخلّص من العمل اليدوي.',
                  body: 'تدفقات عمل وتكاملات ومهام مجدولة تنقل البيانات بين الأدوات التي تستخدمها.',
              },
              {
                  id: 'qa',
                  kicker: 'اختبار الجودة',
                  title: 'أطلق بأدلّة، لا بالأمل.',
                  body: 'اختبار يدوي وآلي للمسارات الحرجة والأجهزة والأحمال، مدمج في كل إصدار.',
              },
              {
                  id: 'sec',
                  kicker: 'الأمن السيبراني',
                  title: 'حصّن الأنظمة التي يعتمد عليها عملك.',
                  body: 'اختبارات اختراق ومراجعات أمنية وتحصين، لتُكتشف الثغرات وتُعالج قبل الإطلاق.',
              },
              {
                  id: 'work',
                  title: 'كل مبنى منتج حي.',
                  body: 'اختر مبنى لترى ما هو، أو تصفّح دراسات الحالة.',
              },
          ]
        : [
              {
                  id: 'intro',
                  kicker: 'How we work',
                  title: 'One team. Four crews, working on every product.',
                  body: 'Each building is a live product we build and run. Keep scrolling to see what each crew does.',
              },
              {
                  id: 'dev',
                  kicker: 'Software Development',
                  title: 'We build the software your business runs on.',
                  body: 'Web platforms, mobile apps, APIs and internal tools, designed, built and shipped by one team.',
              },
              {
                  id: 'auto',
                  kicker: 'Automation',
                  title: 'Connect your systems. Remove the manual handoffs.',
                  body: 'Workflows, integrations and scheduled jobs that move data between the tools you already use.',
              },
              {
                  id: 'qa',
                  kicker: 'QA Testing',
                  title: 'Release with evidence, not hope.',
                  body: 'Manual and automated testing across critical journeys, devices and load, built into every release.',
              },
              {
                  id: 'sec',
                  kicker: 'Cybersecurity',
                  title: 'Harden the systems your business depends on.',
                  body: 'Penetration tests, security reviews and hardening, so weaknesses are found and fixed before launch.',
              },
              {
                  id: 'work',
                  title: 'Every building is a live product.',
                  body: 'Select a building to see what it is, or browse the case studies.',
              },
          ];

    const flow = isRTL
        ? [
              ['طلب جديد', 'مُشغّل يبدأ سير العمل'],
              ['تم التحقق', 'فحص المخزون والعنوان والدفع'],
              ['مزامنة مع ERP', 'كتابة الطلب في نظام السجلات'],
              ['إشعار الفريق', 'تحديث العميل والمستودع'],
          ]
        : [
              ['Order placed', 'A trigger starts the workflow'],
              ['Validated', 'Stock, address and payment checked'],
              ['Synced to ERP', 'Written to the system of record'],
              ['Team notified', 'Customer and warehouse updated'],
          ];

    // Engine lifecycle
    useEffect(() => {
        const canvas = canvasRef.current;
        const stage = stageRef.current;
        const overlay = overlayRef.current;

        if (!canvas || !stage || !overlay) {
            return;
        }

        const world = createWorld({
            canvas,
            stage,
            overlay,
            reduceMotion,
            labels,
            onPick: (id) => {
                openerRef.current = canvas;
                setSelected(id);
            },
            onTrace: setTraceHop,
        });
        worldRef.current = world;

        return () => {
            world.destroy();
            worldRef.current = null;
        };
        // Labels are pushed separately below so a language change does not rebuild the scene.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reduceMotion]);

    useEffect(() => {
        worldRef.current?.setLabels(labels);
    }, [labels]);

    useEffect(() => {
        worldRef.current?.setPaused(paused);
    }, [paused]);

    useEffect(() => {
        worldRef.current?.select(selected);

        if (selected >= 0) {
            closeRef.current?.focus();
        }
    }, [selected]);

    // Scroll story: the step crossing the middle of the viewport drives the camera.
    useEffect(() => {
        const els = document.querySelectorAll<HTMLElement>('[data-world-step]');
        // On narrow screens the map is pinned over the top ~55% of the
        // viewport, so the trigger band sits in the visible text area below it.
        const narrow = window.matchMedia('(max-width: 900px)').matches;
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        worldRef.current?.setStep(
                            e.target.getAttribute(
                                'data-world-step',
                            ) as WorldStep,
                        );
                    }
                });
            },
            {
                rootMargin: narrow ? '-70% 0px -26% 0px' : '-45% 0px -45% 0px',
            },
        );
        els.forEach((el) => io.observe(el));

        return () => io.disconnect();
    }, []);

    useEffect(() => {
        if (selected < 0) {
            return;
        }

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closePanel();
            }
        };
        document.addEventListener('keydown', onKey);

        return () => document.removeEventListener('keydown', onKey);
    });

    function closePanel() {
        setSelected(-1);
        openerRef.current?.focus();
    }

    const t = (en: string, ar: string) => (isRTL ? ar : en);

    return (
        <section className="q-world" aria-label={t('How we work', 'كيف نعمل')}>
            <div className="q-world-steps">
                {steps.map((s) => (
                    <div
                        key={s.id}
                        className="q-world-step"
                        data-world-step={s.id}
                    >
                        {s.kicker && (
                            <span className="q-world-kicker">{s.kicker}</span>
                        )}
                        <h2>{s.title}</h2>
                        <p>{s.body}</p>

                        {s.id === 'dev' && (
                            <p className="q-world-note">
                                {t(
                                    'In the map: a crane adds a new wing to a live product, floor by floor.',
                                    'في الخريطة: رافعة تضيف جناحاً جديداً لمنتج حي، طابقاً بعد طابق.',
                                )}
                            </p>
                        )}

                        {s.id === 'auto' && (
                            <>
                                <ol className="q-world-flow">
                                    {flow.map(([title, sub], i) => (
                                        <li
                                            key={title}
                                            className={
                                                i <= traceHop ? 'is-done' : ''
                                            }
                                        >
                                            <span className="q-world-flow-n">
                                                {i + 1}
                                            </span>
                                            <span>
                                                <b>{title}</b>
                                                <small>{sub}</small>
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                                <button
                                    type="button"
                                    className="q-world-btn"
                                    onClick={() => worldRef.current?.trace()}
                                >
                                    {t('Trace a workflow', 'تتبّع سير عمل')}
                                </button>
                                <p className="q-world-note">
                                    {t(
                                        'Illustrative workflow.',
                                        'سير عمل توضيحي.',
                                    )}
                                </p>
                            </>
                        )}

                        {s.id === 'sec' && (
                            <>
                                <button
                                    type="button"
                                    className="q-world-btn"
                                    onClick={() =>
                                        worldRef.current?.securityExample()
                                    }
                                >
                                    {t(
                                        'Show a security example',
                                        'اعرض مثالاً أمنياً',
                                    )}
                                </button>
                                <p className="q-world-note">
                                    {t(
                                        'Illustrative example. Not live monitoring.',
                                        'مثال توضيحي، وليس مراقبة حية.',
                                    )}
                                </p>
                            </>
                        )}

                        {s.id === 'work' && (
                            <Link
                                href={`/${locale}/portfolio`}
                                className="q-world-link"
                            >
                                {t('See our work', 'شاهد أعمالنا')}{' '}
                                {isRTL ? '←' : '→'}
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            <div className="q-world-col">
                <div className="q-world-sticky">
                    <div ref={stageRef} className="q-world-stage">
                        <canvas
                            ref={canvasRef}
                            role="img"
                            aria-label={t(
                                'Animated map of Quartz crews building, connecting, testing and protecting live products.',
                                'خريطة متحركة لأطقم كوارتز وهي تبني وتربط وتختبر وتحمي منتجات حية.',
                            )}
                        />
                        <div
                            ref={overlayRef}
                            className="q-world-overlay"
                            aria-hidden="true"
                        />
                        {!reduceMotion && (
                            <button
                                type="button"
                                className="q-world-pause"
                                aria-pressed={paused}
                                onClick={() => setPaused((p) => !p)}
                            >
                                {paused
                                    ? t('Play animation', 'تشغيل الحركة')
                                    : t('Pause animation', 'إيقاف الحركة')}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {selected >= 0 && (
                <aside
                    className="q-world-panel"
                    role="dialog"
                    aria-modal="false"
                    aria-labelledby="q-world-panel-title"
                >
                    <div className="q-world-panel-head">
                        <span>
                            {t(
                                'Live product · illustrative',
                                'منتج حي · توضيحي',
                            )}
                        </span>
                        <button
                            ref={closeRef}
                            type="button"
                            onClick={closePanel}
                        >
                            {t('Close', 'إغلاق')}
                        </button>
                    </div>
                    <h3 id="q-world-panel-title">
                        {labels.product(selected + 1)}
                    </h3>
                    <p>
                        {t(
                            'One of the live products we build, test and run. Full case studies are in our work section.',
                            'أحد المنتجات الحية التي نبنيها ونختبرها ونشغّلها. دراسات الحالة الكاملة في قسم أعمالنا.',
                        )}
                    </p>
                    <div className="q-world-panel-actions">
                        <Link
                            href={`/${locale}/portfolio`}
                            className="q-world-link"
                        >
                            {t('See our work', 'شاهد أعمالنا')}
                        </Link>
                        <Link
                            href={`/${locale}/contact`}
                            className="q-world-cta"
                        >
                            {t(
                                'Discuss a similar project',
                                'ناقش مشروعاً مشابهاً',
                            )}
                        </Link>
                    </div>
                </aside>
            )}

            <style>{`
                .q-world { display: grid; grid-template-columns: minmax(320px, 0.8fr) 1.2fr; max-width: 1440px; margin: 0 auto; border-top: 1px solid var(--q-line); }
                .q-world-steps { padding-inline: clamp(16px, 4vw, 48px) clamp(16px, 2vw, 32px); }
                .q-world-step { min-height: max(420px, 60dvh); display: flex; flex-direction: column; justify-content: center; gap: 16px; padding-block: 56px; max-width: 520px; }
                .q-world-kicker { font: 500 11px/1 var(--font-mono-brand); letter-spacing: .16em; text-transform: uppercase; color: var(--q-accent); }
                [dir='rtl'] .q-world-kicker { letter-spacing: 0; text-transform: none; font-family: var(--font-arabic); font-size: 13px; }
                .q-world-step h2 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: clamp(32px, 3.4vw, 48px); line-height: 1.05; letter-spacing: -0.03em; color: var(--q-cream); }
                [dir='rtl'] .q-world-step h2 { letter-spacing: 0; line-height: 1.35; font-family: var(--font-arabic); font-weight: 700; }
                .q-world-step p { margin: 0; color: var(--q-dim); font-size: 17px; line-height: 1.6; max-width: 34rem; }
                .q-world-step .q-world-note { font: 400 12px/1.5 var(--font-mono-brand); color: var(--q-faint); }
                [dir='rtl'] .q-world-step .q-world-note { font-family: var(--font-arabic); font-size: 13px; }
                .q-world-flow { list-style: none; margin: 4px 0 0; padding: 0; border-top: 1px solid var(--q-line); }
                .q-world-flow li { display: grid; grid-template-columns: 28px 1fr; gap: 12px; align-items: start; padding: 10px 0; border-bottom: 1px solid var(--q-line); }
                .q-world-flow b { display: block; font-weight: 500; color: var(--q-cream); font-size: 15px; }
                .q-world-flow small { display: block; color: var(--q-dim); font-size: 13px; }
                .q-world-flow-n { width: 24px; height: 24px; display: grid; place-items: center; border: 1px solid var(--q-line-strong); font: 500 11px/1 var(--font-mono-brand); color: var(--q-dim); transition: background-color .2s, color .2s, border-color .2s; }
                .q-world-flow li.is-done .q-world-flow-n { background: var(--q-accent); border-color: var(--q-accent); color: var(--q-bg); }
                .q-world-btn { align-self: flex-start; padding: 14px 20px; background: transparent; color: var(--q-cream); border: 1px solid var(--q-line-strong); font: 500 14px/1 var(--font-sans); cursor: pointer; transition: border-color .15s, color .15s; }
                .q-world-btn:hover { border-color: var(--q-accent); color: var(--q-accent); }
                .q-world-link { align-self: flex-start; color: var(--q-cream); font-size: 14px; font-weight: 500; text-decoration: underline; text-underline-offset: 4px; text-decoration-color: var(--q-accent); }
                .q-world-col { position: relative; }
                .q-world-sticky { position: sticky; top: var(--q-nav-h, 91px); height: calc(100dvh - var(--q-nav-h, 91px)); padding: 16px clamp(16px, 2vw, 24px) 16px 0; }
                [dir='rtl'] .q-world-sticky { padding: 16px 0 16px clamp(16px, 2vw, 24px); }
                .q-world-stage { position: relative; height: 100%; border: 1px solid var(--q-line); background: var(--q-bg-elev); overflow: hidden; }
                .q-world-stage canvas { display: block; width: 100%; height: 100%; }
                .q-world-overlay { position: absolute; inset: 0; pointer-events: none; }
                .q-world-tag { position: absolute; left: 0; top: 0; white-space: nowrap; font: 500 11px/1.3 var(--font-mono-brand); color: var(--q-cream); background: var(--q-bg); border: 1px solid var(--q-accent); padding: 5px 8px; opacity: 0; transition: opacity .25s; }
                .q-world-tag small { display: block; color: var(--q-dim); font-size: 10px; }
                .q-world-tag.is-on { opacity: 1; }
                [dir='rtl'] .q-world-tag { font-family: var(--font-arabic); }
                .q-world-pause { position: absolute; bottom: 12px; inset-inline-end: 12px; padding: 8px 12px; background: var(--q-bg); color: var(--q-cream); border: 1px solid var(--q-line-strong); font: 500 12px/1 var(--font-mono-brand); cursor: pointer; }
                .q-world-btn:focus-visible, .q-world-link:focus-visible, .q-world-pause:focus-visible, .q-world-panel button:focus-visible, .q-world-cta:focus-visible { outline: 2px solid var(--q-accent); outline-offset: 3px; }
                .q-world-panel { position: fixed; z-index: 50; top: calc(var(--q-nav-h, 91px) + 12px); inset-inline-end: 12px; width: min(360px, calc(100vw - 24px)); background: var(--q-bg); border: 1px solid var(--q-line-strong); padding: 20px; display: grid; gap: 14px; box-shadow: 0 24px 60px rgba(0,0,0,.28); }
                .q-world-panel-head { display: flex; justify-content: space-between; align-items: center; }
                .q-world-panel-head span { font: 500 11px/1 var(--font-mono-brand); letter-spacing: .14em; text-transform: uppercase; color: var(--q-dim); }
                .q-world-panel-head button { background: transparent; border: 1px solid var(--q-line-strong); color: var(--q-cream); padding: 7px 10px; font-size: 12px; cursor: pointer; }
                .q-world-panel h3 { margin: 0; font-family: var(--font-display); font-weight: 400; font-size: 28px; color: var(--q-cream); }
                .q-world-panel p { margin: 0; color: var(--q-dim); font-size: 15px; line-height: 1.55; }
                .q-world-panel-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; margin-top: 4px; }
                .q-world-cta { background: var(--q-accent); color: var(--q-bg); padding: 14px 18px; font-size: 14px; font-weight: 500; text-decoration: none; }
                @media (max-width: 900px) {
                    .q-world { grid-template-columns: 1fr; }
                    .q-world-col { order: -1; position: sticky; top: var(--q-nav-h, 91px); z-index: 5; }
                    .q-world-sticky, [dir='rtl'] .q-world-sticky { position: relative; top: 0; height: 44vh; min-height: 260px; padding: 8px 12px; background: var(--q-bg); }
                    .q-world-step { min-height: 42vh; padding-block: 28px; }
                    .q-world-panel { top: auto; bottom: 8px; inset-inline: 8px; width: auto; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .q-world-tag, .q-world-flow-n, .q-world-btn { transition: none; }
                }
            `}</style>
        </section>
    );
}
