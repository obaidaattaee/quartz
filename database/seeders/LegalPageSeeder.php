<?php

namespace Database\Seeders;

use App\Models\LegalPage;
use Illuminate\Database\Seeder;

/**
 * Seeds the public privacy policy and terms of service.
 *
 * The copy is written to satisfy the review criteria of the identity and
 * distribution platforms Quartz integrates with — Google OAuth verification
 * (Limited Use), Apple App Review (Sign in with Apple, in-app account
 * deletion, third-party beneficiary clause), and Microsoft publisher
 * verification — as well as the major privacy regimes.
 *
 * Company facts (legal entity, address, contact addresses, governing law)
 * are written as {{tokens}} and resolved from site settings at render time
 * by App\Services\LegalContentService, so they are corrected in one place.
 *
 * This is a starting document, not legal advice. Have counsel review it
 * before publication, in particular the liability cap and governing law.
 */
class LegalPageSeeder extends Seeder
{
    /**
     * Date the seeded documents take effect.
     */
    private const EFFECTIVE_DATE = '2026-08-22';

    /**
     * Version stamp shown on the public page.
     */
    private const VERSION = '1.0';

    /**
     * Seed the legal pages, leaving admin edits to other fields intact.
     */
    public function run(): void
    {
        LegalPage::updateOrCreate(
            ['slug' => 'privacy'],
            [
                'title_en' => 'Privacy Policy',
                'title_ar' => 'سياسة الخصوصية',
                'summary_en' => 'How {{company}} collects, uses, shares, and protects personal data across our website, our products, and the systems we build and operate.',
                'summary_ar' => 'كيف تجمع {{company}} البيانات الشخصية وتستخدمها وتشاركها وتحميها عبر موقعنا ومنتجاتنا والأنظمة التي نبنيها ونشغّلها.',
                'effective_date' => self::EFFECTIVE_DATE,
                'version' => self::VERSION,
                'sections_en' => $this->privacySectionsEn(),
                'sections_ar' => $this->privacySectionsAr(),
                'is_published' => true,
            ],
        );

        LegalPage::updateOrCreate(
            ['slug' => 'terms'],
            [
                'title_en' => 'Terms of Service',
                'title_ar' => 'شروط الخدمة',
                'summary_en' => 'The terms that govern your use of the {{company}} website, products, and services.',
                'summary_ar' => 'الشروط التي تحكم استخدامك لموقع {{company}} ومنتجاتها وخدماتها.',
                'effective_date' => self::EFFECTIVE_DATE,
                'version' => self::VERSION,
                'sections_en' => $this->termsSectionsEn(),
                'sections_ar' => $this->termsSectionsAr(),
                'is_published' => true,
            ],
        );
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function privacySectionsEn(): array
    {
        return [
            [
                'heading' => 'Who We Are and What This Policy Covers',
                'body' => [
                    '{{company}} (Quartz, we, us, our) operates {{site_url}} and the software products and services described on it. This policy explains what personal data we collect, why we collect it, who we share it with, how long we keep it, and the choices and rights you have.',
                    'It applies to our website, to accounts you create with us, to our web and mobile applications, and to your communications with us.',
                    "Where we build or operate a system for a client, that client decides what personal data is processed in it and for what purpose. In those engagements the client is the data controller and Quartz acts as a data processor under a written agreement; the client's own privacy notice governs that data. This policy governs data we hold for our own purposes.",
                ],
                'list' => [
                    'Registered address: {{registered_address}}',
                    'Privacy enquiries: {{privacy_email}}',
                    'General enquiries: {{contact_email}}',
                ],
            ],
            [
                'heading' => 'The Personal Data We Collect',
                'body' => [
                    'We collect three kinds of personal data: what you give us, what we collect automatically when you use our services, and what we receive from third parties you have authorised.',
                    'We do not intentionally collect special categories of data such as health information, biometric identifiers, or religious, political, or philosophical beliefs, and we ask that you do not send such information to us unless a signed agreement expressly provides for it.',
                ],
                'list' => [
                    'Information you give us: your name, email address, phone number, company name, job title, the content of enquiries and support messages, account credentials, and billing contact details.',
                    'Information collected automatically: IP address, browser and device type, operating system, language preference, referring page, pages viewed, actions taken, timestamps, crash and error diagnostics, and approximate location derived from your IP address.',
                    'Information from third parties: the account identifiers described in the sign-in sections below, confirmation of payment from our payment processors (we never receive your full card number), and security or fraud signals from our infrastructure providers.',
                ],
            ],
            [
                'heading' => 'Signing In with Google, Apple, or Microsoft',
                'body' => [
                    'Where a Quartz product offers it, you may create or access an account using a third-party identity provider instead of a password. We request the minimum set of permissions needed to authenticate you and to populate your profile, and we explain the purpose at the point where we request them.',
                    'We never receive your password from any identity provider. We do not use your sign-in connection to reach any other data in your provider account, and we do not post, send, or publish anything through your provider account.',
                    'You can disconnect a provider at any time from that provider security settings and from your Quartz account settings. Disconnecting a provider stops future sign-ins through it; it does not by itself delete your Quartz account, which is covered in the deletion section below.',
                ],
                'list' => [
                    'What we receive: a stable account identifier, your email address or a private relay address, your display name, and — only where you permit it — your profile picture.',
                    'What we do with it: create and secure your account, recognise you when you return, contact you about the service, and apply any access rules your organisation has set.',
                    'What we never do: sell it, use it for advertising, or combine it with data purchased from data brokers.',
                ],
            ],
            [
                'heading' => 'Google User Data and the Limited Use Requirements',
                'body' => [
                    "Quartz's use and transfer of information received from Google APIs to any other app will adhere to the Google API Services User Data Policy, including the Limited Use requirements.",
                    'In practice, this means the following commitments apply to any Google user data we receive.',
                    'We request only the scopes required by the feature you are using, we explain why each scope is needed before you grant it, and you can revoke our access at any time from your Google Account permissions page.',
                ],
                'list' => [
                    'We use Google user data only to provide or improve user-facing features that are prominently described in the requesting interface.',
                    'We do not transfer Google user data except as necessary to provide or improve those features, to comply with applicable law, or as part of a merger or acquisition after obtaining your explicit consent.',
                    'We do not use Google user data for serving advertising of any kind, including retargeting, personalised advertising, or interest-based advertising.',
                    'We do not allow humans to read Google user data unless we have your affirmative agreement for specific messages, it is necessary for security purposes such as investigating abuse, it is required to comply with applicable law, or the data is aggregated and de-identified for internal operations.',
                ],
            ],
            [
                'heading' => 'Sign in with Apple',
                'body' => [
                    'If you use Sign in with Apple, we receive a stable user identifier and, at your discretion, your name and email address. Apple does not share your password with us.',
                    'We fully support the Apple Hide My Email private relay service. If you choose to hide your address, we receive only the relay address, and we use that address for every account communication. We do not attempt to resolve, unmask, or link a relay address to any other identifier we hold, and we keep our relay sending domains correctly registered so that our messages continue to reach you.',
                    'We do not use Sign in with Apple data for advertising or cross-app tracking, and we do not combine it with data obtained from data brokers.',
                    'You may revoke access at any time from the Apple ID settings on your device, and you may delete your Quartz account entirely from within the app, as described in the deletion section below.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Microsoft Account and Microsoft Entra ID Sign-In',
                'body' => [
                    'If you sign in with a Microsoft personal account, or with a Microsoft Entra ID work or school account, we receive your object identifier, your tenant identifier where applicable, your display name, and your email address or user principal name.',
                    'We request the minimum delegated permissions required for the feature you are using, we obtain administrator consent where your tenant requires it, and we honour tenant-level restrictions and conditional access policies configured by your organisation.',
                    'We use this data only to authenticate you, provision and secure your account, and apply the access rules your organisation has set. We do not access your mail, files, calendar, or directory beyond what a feature you have enabled explicitly requires and you or your administrator have approved.',
                    'Your administrator can revoke our application consent at any time from the Microsoft Entra admin centre, and you can review or revoke your own consent from your Microsoft account permissions page.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Why We Use Personal Data, and Our Legal Bases',
                'body' => [
                    'We use personal data only for the purposes set out below. Where the GDPR, the UK GDPR, or a comparable law applies, the legal basis for each purpose is shown alongside it.',
                    'Where we rely on your consent, you may withdraw it at any time. Withdrawing consent does not affect processing that took place before you withdrew it.',
                ],
                'list' => [
                    'To provide, maintain, and support the services you request — performance of a contract.',
                    'To authenticate you, secure accounts, and prevent fraud, abuse, and unauthorised access — legitimate interests in protecting our users and our systems, and compliance with legal obligations.',
                    'To respond to your enquiries and provide customer support — performance of a contract and our legitimate interest in answering the people who contact us.',
                    'To send newsletters and marketing communications — your consent, which you can withdraw from any message or by writing to {{privacy_email}}.',
                    'To measure and improve our website and products through analytics — your consent where the law requires it, otherwise our legitimate interest in understanding how our services are used.',
                    'To invoice, collect payment, and keep accounting records — performance of a contract and compliance with tax and accounting obligations.',
                    'To comply with legal obligations and to establish, exercise, or defend legal claims — legal obligation and legitimate interests.',
                ],
            ],
            [
                'heading' => 'Cookies and Similar Technologies',
                'body' => [
                    'We use cookies and similar technologies such as local storage to keep you signed in, remember your language and display preferences, protect against automated abuse, and understand how our site is used.',
                    'Where the law requires it, we ask for your consent before setting any cookie that is not strictly necessary, and we give you a way to change your choice at any time. You can also block or delete cookies through your browser settings, though strictly necessary cookies cannot be disabled without breaking core functionality such as signing in.',
                ],
                'list' => [
                    'Strictly necessary: session management, authentication, load balancing, and security.',
                    'Preferences: language, text direction, and interface settings you have chosen.',
                    'Analytics: aggregated measurement of page views and feature use, collected with consent where required.',
                ],
            ],
            [
                'heading' => 'How We Share Personal Data',
                'body' => [
                    'We share personal data only in the circumstances listed below. Every service provider that processes personal data on our behalf is bound by a written contract to process it only on our documented instructions, to keep it confidential, and to apply appropriate security measures.',
                    'We do not sell personal data, and we do not share personal data for cross-context behavioural advertising, as those terms are defined by the California Consumer Privacy Act as amended by the CPRA and by comparable state laws. We have not done so in the preceding twelve months.',
                    'A current list of our sub-processors, including the categories of data each handles and the countries in which they operate, is available on request from {{privacy_email}}.',
                ],
                'list' => [
                    'Service providers and sub-processors: cloud hosting, content delivery, email delivery, analytics, error monitoring, payment processing, and customer support tooling.',
                    'Identity providers: Google, Apple, and Microsoft, strictly as described in the sign-in sections above.',
                    'Professional advisers: lawyers, accountants, auditors, and insurers, bound by professional confidentiality obligations.',
                    'Authorities and third parties: where required by law, court order, or binding regulatory request, and where necessary to establish, exercise, or defend legal claims.',
                    'Corporate transactions: an acquirer or successor in a merger, acquisition, financing, or sale of assets, subject to this policy and with notice to you where the law requires it.',
                ],
            ],
            [
                'heading' => 'International Data Transfers',
                'body' => [
                    'We work with clients and providers worldwide, so personal data may be processed in a country other than the one you live in, including countries whose data protection laws differ from your own.',
                    'Where we transfer personal data out of the European Economic Area, the United Kingdom, or Switzerland, we rely on an adequacy decision where one covers the destination. Otherwise we rely on the European Commission Standard Contractual Clauses, together with the UK International Data Transfer Addendum where the UK GDPR applies, supported by a transfer risk assessment and supplementary measures including encryption in transit and at rest and strict access controls.',
                    'For transfers subject to other regimes, including the Saudi PDPL and the UAE data protection law, we rely on the transfer mechanisms those laws provide. You can request a copy of the safeguards that apply to your data from {{privacy_email}}.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'How Long We Keep Personal Data',
                'body' => [
                    'We keep personal data only for as long as we need it for the purpose we collected it for, or for as long as the law requires. The periods below are our defaults; a signed agreement may set different ones for a specific engagement.',
                    'When a retention period ends, we delete the data or irreversibly anonymise it. Data already written to backups is removed as those backups age out, within 90 days.',
                ],
                'list' => [
                    'Account data: for the life of the account, then up to 90 days after deletion to complete removal across systems and backups.',
                    'Enquiries and contact form submissions: up to 24 months from the last contact.',
                    'Newsletter subscriptions: until you unsubscribe, after which we keep a minimal suppression record so that we do not add you again.',
                    'Invoices, billing, and accounting records: for the period tax and company law requires, typically up to 10 years.',
                    'Security, access, and audit logs: up to 12 months, longer only where an active investigation requires it.',
                ],
            ],
            [
                'heading' => 'How We Protect Personal Data',
                'body' => [
                    'Security is the core of what we do for our clients, and we apply the same practices to our own systems. Our controls include encryption of data in transit using TLS and at rest, least-privilege access with multi-factor authentication for all staff accounts, code review and dependency and vulnerability scanning in our build pipeline, centralised logging and monitoring, regular backups with tested restores, and periodic penetration testing.',
                    'We maintain a documented incident response process. If a personal data breach occurs, we will notify the competent supervisory authority and affected individuals where the applicable law requires it, and within the deadlines it sets, which is 72 hours under the GDPR.',
                    'No method of transmission or storage is completely secure. We cannot guarantee absolute security, and you are responsible for keeping your own credentials confidential.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Your Privacy Rights',
                'body' => [
                    'Depending on where you live, you have some or all of the rights listed below. We honour these requests regardless of your location wherever we are technically able to do so.',
                    'To exercise any right, email {{privacy_email}} from the address associated with your account, or use the contact form at {{site_url}}. We may need to verify your identity before acting, and we will not use the information you provide for verification for any other purpose.',
                    'We respond within the period the applicable law sets — one month under the GDPR, the UK GDPR, and the Saudi PDPL, and 45 days under the CCPA, each extendable where the law allows and we tell you why. Exercising your rights is free unless a request is manifestly unfounded or excessive. We will never discriminate against you for exercising a privacy right.',
                ],
                'list' => [
                    'Access: obtain confirmation of whether we process your data and a copy of it.',
                    'Rectification: have inaccurate or incomplete data corrected.',
                    'Erasure: have your data deleted where we have no overriding legal basis to keep it.',
                    'Restriction and objection: limit how we use your data, or object to processing based on legitimate interests, including any form of direct marketing.',
                    'Portability: receive the data you gave us in a structured, commonly used, machine-readable format, and have it transmitted to another controller where technically feasible.',
                    'Withdraw consent: at any time, for anything we do on the basis of consent.',
                    'European Economic Area, United Kingdom, and Switzerland (GDPR, UK GDPR, FADP): all of the rights above, plus the right to lodge a complaint with your local supervisory authority.',
                    'California (CCPA and CPRA): the rights to know, delete, and correct; the right to opt out of the sale or sharing of personal information; the right to limit the use of sensitive personal information; and the right to be free from discrimination. You may use an authorised agent, and we honour valid requests submitted on your behalf.',
                    'Saudi Arabia (PDPL): the rights to be informed, to access your data, to request its correction, and to request its destruction, and the right to complain to the competent authority.',
                    'United Arab Emirates (Federal Decree-Law No. 45 of 2021): the rights of access, correction, erasure, restriction, portability, and objection.',
                    'Brazil (LGPD), Canada (PIPEDA), Australia (Privacy Act), Japan (APPI), and other comparable regimes: the equivalent rights those laws provide.',
                ],
            ],
            [
                'heading' => 'Deleting Your Account and Your Data',
                'body' => [
                    'You can delete your account and the personal data associated with it at any time, by any of the routes below. You do not need to contact support first, and we do not require a phone call to process a deletion.',
                    'We action deletion requests within 30 days. Your data is removed from live systems promptly and purged from backups within 90 days. We retain only the minimum we are legally required to keep — for example invoices required by tax law, and records needed to prevent fraud or to resolve an active dispute — and when we complete your request we tell you what was retained and why.',
                    'Deleting your Quartz account does not delete any data held by your identity provider. To sever that connection, revoke access separately in your Google Account permissions, your Apple ID settings, or your Microsoft account permissions.',
                ],
                'list' => [
                    'In the app or product: open Account settings and choose Delete account. Deletion is available inside every Quartz application that supports account creation.',
                    'By email: send a deletion request to {{privacy_email}} from the email address on the account.',
                    'On the web: submit a request through the contact form at {{site_url}}.',
                ],
            ],
            [
                'heading' => "Children's Privacy",
                'body' => [
                    'Our website and products are not directed to children under 13, or under 16 where local law sets a higher age of digital consent, and we do not knowingly collect personal data from them.',
                    'If we learn that we have collected personal data from a child without the consent required by law, we delete it promptly. A parent or guardian who believes a child has provided us with personal data should write to {{privacy_email}} and we will act on it.',
                    'Where we build a product intended for children on behalf of a client, the obligations that apply — including COPPA in the United States, age-appropriate design requirements in the United Kingdom, and equivalent local rules — are addressed in the contract with that client and in the privacy notice they publish.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Automated Decision-Making and Profiling',
                'body' => [
                    'We do not make decisions that produce legal effects concerning you, or that similarly significantly affect you, based solely on automated processing, including profiling.',
                    'Where we use automated tooling for security purposes, such as scoring a sign-in attempt for signs of credential stuffing, a person reviews any outcome that would restrict your access to an account before it becomes final.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Do Not Track and Global Privacy Control',
                'body' => [
                    'We honour the Global Privacy Control signal as a valid opt-out of the sale or sharing of personal information in the jurisdictions that recognise it. Because we do not sell or share personal information at all, that opt-out matches our default position.',
                    'There is no common industry standard for the older Do Not Track browser signal, so we do not respond to it. Our practices do not change based on whether it is enabled.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Third-Party Links and Services',
                'body' => [
                    'Our website and products contain links to third-party sites and services that we do not control, including the product sites, code repositories, and social profiles listed in our footer.',
                    'This policy does not apply to those services. We encourage you to read the privacy policy of any third-party service before you provide it with personal data.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Changes to This Policy',
                'body' => [
                    'We update this policy when our practices, our products, or the law change. Every version carries an effective date and a version number, shown at the top of this page.',
                    'Where a change materially affects your rights or how we use your data, we will give prominent notice on the site, and where we hold your email address we will notify you at least 14 days before the change takes effect. Where the applicable law requires fresh consent, we will ask for it rather than relying on your continued use.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'How to Contact Us',
                'body' => [
                    'For any question about this policy, about how we handle your personal data, or to exercise any of your rights, contact us using the details below. We aim to answer every privacy enquiry within five working days, and always within the period the law requires.',
                    'If we are required to appoint a representative in the European Union or the United Kingdom under Article 27 of the GDPR, or a data protection officer under Article 37, their contact details will be published in this section.',
                    'You always have the right to complain to the data protection authority in your country. We would appreciate the chance to address your concern first.',
                ],
                'list' => [
                    '{{company}}',
                    'Registered address: {{registered_address}}',
                    'Privacy and data protection: {{privacy_email}}',
                    'General enquiries: {{contact_email}}',
                ],
            ],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function privacySectionsAr(): array
    {
        return [
            [
                'heading' => 'من نحن ونطاق هذه السياسة',
                'body' => [
                    'تُشغّل {{company}} (ويُشار إليها بـ Quartz أو نحن) الموقع {{site_url}} والمنتجات والخدمات البرمجية الموضحة فيه. توضّح هذه السياسة البيانات الشخصية التي نجمعها، وسبب جمعها، ومع من نشاركها، ومدة الاحتفاظ بها، والخيارات والحقوق المتاحة لك.',
                    'تنطبق هذه السياسة على موقعنا الإلكتروني، وعلى الحسابات التي تنشئها لدينا، وعلى تطبيقاتنا على الويب والهواتف المحمولة، وعلى مراسلاتك معنا.',
                    'عندما نبني أو نشغّل نظامًا لصالح عميل، فإن ذلك العميل هو من يحدد البيانات الشخصية التي تُعالَج داخله والغرض من معالجتها. في تلك المشاريع يكون العميل هو المتحكم في البيانات وتعمل Quartz بصفتها معالِجًا للبيانات بموجب اتفاقية مكتوبة، وتحكم إشعارُ الخصوصية الخاص بالعميل تلك البيانات. أما هذه السياسة فتحكم البيانات التي نحتفظ بها لأغراضنا نحن.',
                ],
                'list' => [
                    'العنوان المسجّل: {{registered_address}}',
                    'استفسارات الخصوصية: {{privacy_email}}',
                    'الاستفسارات العامة: {{contact_email}}',
                ],
            ],
            [
                'heading' => 'البيانات الشخصية التي نجمعها',
                'body' => [
                    'نجمع ثلاثة أنواع من البيانات الشخصية: ما تقدّمه لنا بنفسك، وما نجمعه تلقائيًا عند استخدامك لخدماتنا، وما نتلقّاه من أطراف ثالثة صرّحت لها بذلك.',
                    'لا نجمع عمدًا فئات البيانات الحساسة مثل المعلومات الصحية أو المعرّفات الحيوية أو المعتقدات الدينية أو السياسية أو الفلسفية، ونرجو عدم إرسال مثل هذه المعلومات إلينا ما لم تنص اتفاقية موقّعة على ذلك صراحةً.',
                ],
                'list' => [
                    'معلومات تقدّمها لنا: اسمك وبريدك الإلكتروني ورقم هاتفك واسم شركتك ومسمّاك الوظيفي ومحتوى استفساراتك ورسائل الدعم وبيانات اعتماد الحساب وبيانات التواصل الخاصة بالفوترة.',
                    'معلومات تُجمع تلقائيًا: عنوان IP ونوع المتصفح والجهاز ونظام التشغيل وتفضيل اللغة والصفحة المُحيلة والصفحات التي تُشاهدها والإجراءات التي تتخذها والطوابع الزمنية وتشخيصات الأعطال والأخطاء والموقع التقريبي المستنتج من عنوان IP.',
                    'معلومات من أطراف ثالثة: معرّفات الحساب الموضحة في أقسام تسجيل الدخول أدناه، وتأكيد الدفع من مزوّدي خدمات الدفع لدينا (لا نتلقى مطلقًا رقم بطاقتك كاملًا)، وإشارات الأمان أو الاحتيال من مزوّدي البنية التحتية.',
                ],
            ],
            [
                'heading' => 'تسجيل الدخول عبر Google أو Apple أو Microsoft',
                'body' => [
                    'حين يتيح أحد منتجات Quartz ذلك، يمكنك إنشاء حساب أو الوصول إليه باستخدام مزوّد هوية من طرف ثالث بدلًا من كلمة مرور. نطلب الحد الأدنى من الأذونات اللازمة للتحقق من هويتك وتعبئة ملفك الشخصي، ونوضح الغرض عند نقطة الطلب.',
                    'لا نتلقى مطلقًا كلمة مرورك من أي مزوّد هوية. ولا نستخدم اتصال تسجيل الدخول للوصول إلى أي بيانات أخرى في حسابك لدى المزوّد، ولا ننشر أو نرسل أي شيء عبر ذلك الحساب.',
                    'يمكنك فصل أي مزوّد في أي وقت من إعدادات الأمان لدى ذلك المزوّد ومن إعدادات حسابك في Quartz. ويوقف الفصلُ عمليات تسجيل الدخول المستقبلية عبره، لكنه لا يحذف حسابك في Quartz بحد ذاته، وهو ما يتناوله قسم الحذف أدناه.',
                ],
                'list' => [
                    'ما نتلقّاه: معرّف حساب ثابت، وبريدك الإلكتروني أو عنوان ترحيل خاص، واسم العرض الخاص بك، وصورة ملفك الشخصي إذا سمحت بذلك فقط.',
                    'ما نفعله به: إنشاء حسابك وتأمينه، والتعرّف عليك عند عودتك، والتواصل معك بشأن الخدمة، وتطبيق أي قواعد وصول حددتها مؤسستك.',
                    'ما لا نفعله أبدًا: بيعه أو استخدامه في الإعلانات أو دمجه مع بيانات مُشتراة من وسطاء البيانات.',
                ],
            ],
            [
                'heading' => 'بيانات مستخدمي Google ومتطلبات الاستخدام المحدود',
                'body' => [
                    'إن استخدام Quartz ونقلها للمعلومات المستلمة من واجهات Google البرمجية (Google APIs) إلى أي تطبيق آخر سيلتزم بسياسة بيانات مستخدمي خدمات Google API (Google API Services User Data Policy)، بما في ذلك متطلبات الاستخدام المحدود (Limited Use).',
                    'ويعني ذلك عمليًا سريان الالتزامات التالية على أي بيانات لمستخدمي Google نتلقاها.',
                    'نطلب فقط النطاقات (Scopes) التي تتطلبها الميزة التي تستخدمها، ونوضح سبب الحاجة إلى كل نطاق قبل منحه، ويمكنك إلغاء وصولنا في أي وقت من صفحة أذونات حسابك في Google.',
                ],
                'list' => [
                    'نستخدم بيانات مستخدمي Google فقط لتقديم أو تحسين ميزات ظاهرة للمستخدم وموصوفة بوضوح في الواجهة التي تطلب الإذن.',
                    'لا ننقل بيانات مستخدمي Google إلا بالقدر اللازم لتقديم تلك الميزات أو تحسينها، أو للامتثال للقانون المعمول به، أو ضمن عملية اندماج أو استحواذ بعد الحصول على موافقتك الصريحة.',
                    'لا نستخدم بيانات مستخدمي Google لعرض الإعلانات بأي شكل، بما في ذلك إعادة الاستهداف أو الإعلانات المخصصة أو الإعلانات القائمة على الاهتمامات.',
                    'لا نسمح لأي شخص بالاطلاع على بيانات مستخدمي Google إلا بموافقتك الصريحة على رسائل محددة، أو عند الضرورة لأغراض أمنية مثل التحقيق في إساءة الاستخدام، أو عند اشتراط القانون ذلك، أو إذا كانت البيانات مجمّعة ومجهولة الهوية لأغراض التشغيل الداخلي.',
                ],
            ],
            [
                'heading' => 'تسجيل الدخول عبر Apple',
                'body' => [
                    'إذا استخدمت خاصية تسجيل الدخول عبر Apple (Sign in with Apple)، فإننا نتلقى معرّف مستخدم ثابتًا، وبحسب اختيارك اسمك وبريدك الإلكتروني. ولا تشارك Apple كلمة مرورك معنا.',
                    'ندعم بالكامل خدمة إخفاء البريد الإلكتروني (Hide My Email) من Apple. فإذا اخترت إخفاء عنوانك، لا نتلقى سوى عنوان الترحيل، ونستخدمه في جميع مراسلات الحساب. ولا نحاول كشف عنوان الترحيل أو ربطه بأي معرّف آخر لدينا، ونحافظ على تسجيل نطاقات الإرسال لدينا بشكل صحيح كي تستمر رسائلنا في الوصول إليك.',
                    'لا نستخدم بيانات تسجيل الدخول عبر Apple لأغراض الإعلان أو التتبع عبر التطبيقات، ولا ندمجها مع بيانات نحصل عليها من وسطاء البيانات.',
                    'يمكنك إلغاء الوصول في أي وقت من إعدادات Apple ID على جهازك، كما يمكنك حذف حسابك في Quartz بالكامل من داخل التطبيق كما هو موضح في قسم الحذف أدناه.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'تسجيل الدخول عبر حساب Microsoft وMicrosoft Entra ID',
                'body' => [
                    'إذا سجّلت الدخول بحساب Microsoft شخصي أو بحساب عمل أو دراسة عبر Microsoft Entra ID، فإننا نتلقى معرّف الكائن الخاص بك ومعرّف المستأجر (Tenant) عند الاقتضاء واسم العرض وبريدك الإلكتروني أو الاسم الأساسي للمستخدم.',
                    'نطلب الحد الأدنى من الأذونات المفوّضة اللازمة للميزة التي تستخدمها، ونحصل على موافقة المسؤول حين يشترط المستأجر ذلك، ونلتزم بقيود المستأجر وسياسات الوصول المشروط التي تضبطها مؤسستك.',
                    'نستخدم هذه البيانات فقط للتحقق من هويتك وتجهيز حسابك وتأمينه وتطبيق قواعد الوصول التي حددتها مؤسستك. ولا نصل إلى بريدك أو ملفاتك أو تقويمك أو الدليل التنظيمي إلا بالقدر الذي تتطلبه صراحةً ميزة فعّلتها ووافقت عليها أنت أو المسؤول لديك.',
                    'يمكن للمسؤول لديك إلغاء موافقة التطبيق في أي وقت من مركز إدارة Microsoft Entra، كما يمكنك مراجعة موافقتك أو إلغاؤها من صفحة أذونات حساب Microsoft الخاص بك.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'أغراض استخدام البيانات والأسس القانونية',
                'body' => [
                    'نستخدم البيانات الشخصية للأغراض المبيّنة أدناه فقط. وحيثما ينطبق النظام الأوروبي العام لحماية البيانات (GDPR) أو نظيره البريطاني أو قانون مماثل، يُذكر الأساس القانوني لكل غرض بجانبه.',
                    'وحين نعتمد على موافقتك، يمكنك سحبها في أي وقت. ولا يؤثر سحب الموافقة على المعالجة التي تمت قبل السحب.',
                ],
                'list' => [
                    'تقديم الخدمات التي تطلبها وصيانتها ودعمها — تنفيذ العقد.',
                    'التحقق من هويتك وتأمين الحسابات ومنع الاحتيال وإساءة الاستخدام والوصول غير المصرّح به — المصلحة المشروعة في حماية مستخدمينا وأنظمتنا، والامتثال للالتزامات القانونية.',
                    'الرد على استفساراتك وتقديم دعم العملاء — تنفيذ العقد ومصلحتنا المشروعة في الرد على من يتواصل معنا.',
                    'إرسال النشرات البريدية والرسائل التسويقية — موافقتك، ويمكنك سحبها من أي رسالة أو بالكتابة إلى {{privacy_email}}.',
                    'قياس أداء موقعنا ومنتجاتنا وتحسينها عبر التحليلات — موافقتك حيثما يشترط القانون ذلك، وإلا فمصلحتنا المشروعة في فهم كيفية استخدام خدماتنا.',
                    'إصدار الفواتير وتحصيل المدفوعات وحفظ السجلات المحاسبية — تنفيذ العقد والامتثال للالتزامات الضريبية والمحاسبية.',
                    'الامتثال للالتزامات القانونية وإثبات المطالبات القانونية أو ممارستها أو الدفاع عنها — الالتزام القانوني والمصلحة المشروعة.',
                ],
            ],
            [
                'heading' => 'ملفات تعريف الارتباط والتقنيات المشابهة',
                'body' => [
                    'نستخدم ملفات تعريف الارتباط (Cookies) وتقنيات مشابهة مثل التخزين المحلي لإبقائك مسجّل الدخول، وتذكّر لغتك وتفضيلات العرض لديك، والحماية من الاستخدام الآلي المسيء، وفهم كيفية استخدام موقعنا.',
                    'وحيثما يشترط القانون ذلك، نطلب موافقتك قبل وضع أي ملف تعريف ارتباط غير ضروري بشكل صارم، ونتيح لك تغيير اختيارك في أي وقت. كما يمكنك حظر ملفات تعريف الارتباط أو حذفها من إعدادات متصفحك، مع العلم بأن تعطيل الملفات الضرورية يعطّل وظائف أساسية مثل تسجيل الدخول.',
                ],
                'list' => [
                    'ضرورية بشكل صارم: إدارة الجلسة والمصادقة وموازنة الأحمال والأمان.',
                    'التفضيلات: اللغة واتجاه النص وإعدادات الواجهة التي اخترتها.',
                    'التحليلات: قياس مجمّع لمرات مشاهدة الصفحات واستخدام الميزات، ويُجمع بموافقتك حيثما يلزم.',
                ],
            ],
            [
                'heading' => 'كيف نشارك البيانات الشخصية',
                'body' => [
                    'لا نشارك البيانات الشخصية إلا في الحالات المذكورة أدناه. وكل مزوّد خدمة يعالج بيانات شخصية نيابةً عنا ملزَم بعقد مكتوب بمعالجتها وفق تعليماتنا الموثّقة فقط، والحفاظ على سريتها، وتطبيق تدابير أمنية مناسبة.',
                    'نحن لا نبيع البيانات الشخصية، ولا نشاركها لأغراض الإعلانات السلوكية عبر السياقات، وفق تعريف هذه المصطلحات في قانون خصوصية المستهلك في كاليفورنيا (CCPA) بصيغته المعدّلة بموجب CPRA والقوانين المماثلة. ولم نقم بذلك خلال الاثني عشر شهرًا الماضية.',
                    'تتوفر قائمة محدّثة بالمعالجين من الباطن لدينا، تشمل فئات البيانات التي يتعامل معها كل منهم والدول التي يعملون فيها، عند طلبها من {{privacy_email}}.',
                ],
                'list' => [
                    'مزوّدو الخدمات والمعالجون من الباطن: الاستضافة السحابية وشبكات توصيل المحتوى وإرسال البريد الإلكتروني والتحليلات ومراقبة الأخطاء ومعالجة المدفوعات وأدوات دعم العملاء.',
                    'مزوّدو الهوية: Google وApple وMicrosoft، وذلك حصرًا وفق ما ورد في أقسام تسجيل الدخول أعلاه.',
                    'المستشارون المهنيون: المحامون والمحاسبون والمدققون وشركات التأمين، وهم ملتزمون بواجبات السرية المهنية.',
                    'الجهات الرسمية والأطراف الأخرى: حين يقتضي القانون أو أمر قضائي أو طلب تنظيمي ملزم ذلك، وعند الضرورة لإثبات المطالبات القانونية أو ممارستها أو الدفاع عنها.',
                    'الصفقات المؤسسية: أي مستحوذ أو خلف في عملية اندماج أو استحواذ أو تمويل أو بيع أصول، مع خضوعه لهذه السياسة وإشعارك حيثما يشترط القانون ذلك.',
                ],
            ],
            [
                'heading' => 'نقل البيانات دوليًا',
                'body' => [
                    'نعمل مع عملاء ومزوّدين حول العالم، لذا قد تُعالَج البيانات الشخصية في دولة غير الدولة التي تقيم فيها، بما في ذلك دول تختلف قوانين حماية البيانات فيها عن قوانين بلدك.',
                    'وعند نقل البيانات الشخصية خارج المنطقة الاقتصادية الأوروبية أو المملكة المتحدة أو سويسرا، نعتمد على قرار كفاية إن وُجد يشمل الوجهة. وبخلاف ذلك نعتمد على الشروط التعاقدية القياسية (Standard Contractual Clauses) الصادرة عن المفوضية الأوروبية، مع ملحق نقل البيانات الدولي البريطاني حيثما ينطبق النظام البريطاني، مدعومة بتقييم لمخاطر النقل وتدابير تكميلية تشمل التشفير أثناء النقل وفي حالة السكون وضوابط وصول صارمة.',
                    'وبالنسبة للنقل الخاضع لأنظمة أخرى، بما فيها نظام حماية البيانات الشخصية السعودي (PDPL) وقانون حماية البيانات الإماراتي، نعتمد على آليات النقل التي تتيحها تلك الأنظمة. ويمكنك طلب نسخة من الضمانات المطبّقة على بياناتك من {{privacy_email}}.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'مدة الاحتفاظ بالبيانات الشخصية',
                'body' => [
                    'نحتفظ بالبيانات الشخصية طوال المدة اللازمة للغرض الذي جُمعت من أجله فقط، أو للمدة التي يفرضها القانون. والمدد أدناه هي مددنا الافتراضية، وقد تحدد اتفاقية موقّعة مددًا مختلفة لمشروع بعينه.',
                    'وعند انتهاء مدة الاحتفاظ، نحذف البيانات أو نجعلها مجهولة الهوية بصورة لا رجعة فيها. أما البيانات المكتوبة في النسخ الاحتياطية فتُزال مع انقضاء دورة تلك النسخ خلال 90 يومًا.',
                ],
                'list' => [
                    'بيانات الحساب: طوال مدة الحساب، ثم حتى 90 يومًا بعد الحذف لاستكمال الإزالة من الأنظمة والنسخ الاحتياطية.',
                    'الاستفسارات ونماذج التواصل: حتى 24 شهرًا من آخر تواصل.',
                    'اشتراكات النشرة البريدية: حتى إلغاء اشتراكك، ثم نحتفظ بسجل حظر بالحد الأدنى كي لا نعيد إضافتك.',
                    'الفواتير وسجلات الفوترة والمحاسبة: للمدة التي تفرضها الأنظمة الضريبية وأنظمة الشركات، وعادةً حتى 10 سنوات.',
                    'سجلات الأمان والوصول والتدقيق: حتى 12 شهرًا، ولا تزيد إلا إذا اقتضى تحقيق قائم ذلك.',
                ],
            ],
            [
                'heading' => 'كيف نحمي البيانات الشخصية',
                'body' => [
                    'الأمن هو جوهر ما نقدّمه لعملائنا، ونطبّق الممارسات نفسها على أنظمتنا. وتشمل ضوابطنا تشفير البيانات أثناء النقل باستخدام TLS وفي حالة السكون، ومبدأ الحد الأدنى من الامتيازات مع المصادقة متعددة العوامل لجميع حسابات الموظفين، ومراجعة الشيفرة وفحص التبعيات والثغرات ضمن مسار البناء، والتسجيل والمراقبة المركزية، والنسخ الاحتياطي المنتظم مع اختبار الاستعادة، واختبارات الاختراق الدورية.',
                    'ولدينا إجراء موثّق للاستجابة للحوادث. وفي حال وقوع خرق للبيانات الشخصية، سنُخطر الجهة الرقابية المختصة والأفراد المتأثرين حيثما يوجب القانون المعمول به ذلك وضمن المهل التي يحددها، وهي 72 ساعة بموجب النظام الأوروبي العام لحماية البيانات.',
                    'ولا توجد وسيلة نقل أو تخزين آمنة تمامًا. لذا لا يمكننا ضمان أمان مطلق، وتقع على عاتقك مسؤولية الحفاظ على سرية بيانات اعتمادك.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'حقوقك المتعلقة بالخصوصية',
                'body' => [
                    'بحسب مكان إقامتك، تتمتع ببعض أو بكل الحقوق المذكورة أدناه. ونحن نستجيب لهذه الطلبات بغض النظر عن موقعك كلما كان ذلك ممكنًا تقنيًا.',
                    'ولممارسة أي حق، راسلنا على {{privacy_email}} من العنوان المرتبط بحسابك، أو استخدم نموذج التواصل على {{site_url}}. وقد نحتاج إلى التحقق من هويتك قبل التنفيذ، ولن نستخدم المعلومات التي تقدّمها لغرض التحقق في أي غرض آخر.',
                    'ونرد خلال المدة التي يحددها القانون المعمول به — شهر واحد بموجب النظام الأوروبي ونظيره البريطاني والنظام السعودي، و45 يومًا بموجب قانون كاليفورنيا، وكلاهما قابل للتمديد حيثما يسمح القانون مع إبلاغك بالسبب. وممارسة حقوقك مجانية ما لم يكن الطلب غير مبرر بشكل ظاهر أو مفرطًا. ولن نميّز ضدك أبدًا بسبب ممارستك أيًا من حقوق الخصوصية.',
                ],
                'list' => [
                    'الاطلاع: الحصول على تأكيد بمعالجتنا لبياناتك وعلى نسخة منها.',
                    'التصحيح: تصحيح البيانات غير الدقيقة أو غير المكتملة.',
                    'المحو: حذف بياناتك ما لم يكن لدينا أساس قانوني راجح للاحتفاظ بها.',
                    'التقييد والاعتراض: الحد من كيفية استخدامنا لبياناتك، أو الاعتراض على المعالجة القائمة على المصلحة المشروعة، بما في ذلك أي تسويق مباشر.',
                    'نقل البيانات: تلقّي البيانات التي زوّدتنا بها في صيغة منظمة وشائعة الاستخدام وقابلة للقراءة آليًا، ونقلها إلى متحكم آخر حيثما كان ذلك ممكنًا تقنيًا.',
                    'سحب الموافقة: في أي وقت، بشأن أي معالجة نجريها استنادًا إلى الموافقة.',
                    'المنطقة الاقتصادية الأوروبية والمملكة المتحدة وسويسرا (GDPR وUK GDPR وFADP): جميع الحقوق أعلاه، إضافة إلى حق تقديم شكوى إلى الجهة الرقابية المحلية.',
                    'كاليفورنيا (CCPA وCPRA): حقوق المعرفة والحذف والتصحيح، وحق الانسحاب من بيع المعلومات الشخصية أو مشاركتها، وحق تقييد استخدام المعلومات الشخصية الحساسة، وحق عدم التعرض للتمييز. ويمكنك الاستعانة بوكيل مفوّض، ونحن نستجيب للطلبات الصحيحة المقدّمة نيابةً عنك.',
                    'المملكة العربية السعودية (PDPL): حق العلم، وحق الوصول إلى بياناتك، وحق طلب تصحيحها، وحق طلب إتلافها، وحق التقدّم بشكوى إلى الجهة المختصة.',
                    'الإمارات العربية المتحدة (المرسوم بقانون اتحادي رقم 45 لسنة 2021): حقوق الوصول والتصحيح والمحو والتقييد ونقل البيانات والاعتراض.',
                    'البرازيل (LGPD) وكندا (PIPEDA) وأستراليا (Privacy Act) واليابان (APPI) والأنظمة المماثلة الأخرى: الحقوق المكافئة التي تمنحها تلك القوانين.',
                ],
            ],
            [
                'heading' => 'حذف حسابك وبياناتك',
                'body' => [
                    'يمكنك حذف حسابك والبيانات الشخصية المرتبطة به في أي وقت، عبر أي من الطرق أدناه. ولست بحاجة إلى التواصل مع الدعم أولًا، ولا نشترط إجراء مكالمة هاتفية لتنفيذ الحذف.',
                    'وننفّذ طلبات الحذف خلال 30 يومًا. وتُزال بياناتك من الأنظمة الحية فورًا وتُمحى من النسخ الاحتياطية خلال 90 يومًا. ولا نحتفظ إلا بالحد الأدنى الذي يلزمنا القانون بحفظه — كالفواتير التي تفرضها الأنظمة الضريبية، والسجلات اللازمة لمنع الاحتيال أو لحسم نزاع قائم — وعند إتمام طلبك نبلغك بما احتُفظ به وسببه.',
                    'ولا يؤدي حذف حسابك في Quartz إلى حذف أي بيانات لدى مزوّد الهوية الخاص بك. ولقطع ذلك الارتباط، ألغِ الوصول بشكل منفصل من أذونات حساب Google، أو إعدادات Apple ID، أو أذونات حساب Microsoft.',
                ],
                'list' => [
                    'من داخل التطبيق أو المنتج: افتح إعدادات الحساب واختر حذف الحساب. وخيار الحذف متاح داخل كل تطبيق من تطبيقات Quartz يتيح إنشاء حساب.',
                    'عبر البريد الإلكتروني: أرسل طلب حذف إلى {{privacy_email}} من عنوان البريد المسجّل في الحساب.',
                    'عبر الويب: قدّم طلبًا من خلال نموذج التواصل على {{site_url}}.',
                ],
            ],
            [
                'heading' => 'خصوصية الأطفال',
                'body' => [
                    'موقعنا ومنتجاتنا ليست موجّهة للأطفال دون سن 13 عامًا، أو دون 16 عامًا حيثما يحدد القانون المحلي سنًا أعلى للموافقة الرقمية، ولا نجمع عن علم بيانات شخصية منهم.',
                    'وإذا علمنا أننا جمعنا بيانات شخصية من طفل دون الموافقة التي يشترطها القانون، فإننا نحذفها فورًا. وعلى ولي الأمر الذي يعتقد أن طفلًا زوّدنا ببيانات شخصية أن يراسلنا على {{privacy_email}} وسنتصرف بناءً على ذلك.',
                    'وعندما نبني منتجًا موجّهًا للأطفال لصالح عميل، تُعالَج الالتزامات المنطبقة — بما فيها قانون COPPA في الولايات المتحدة ومتطلبات التصميم الملائم للعمر في المملكة المتحدة والقواعد المحلية المكافئة — في العقد المبرم مع ذلك العميل وفي إشعار الخصوصية الذي ينشره.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'القرارات الآلية والتحليل الشخصي',
                'body' => [
                    'لا نتخذ قرارات تُنتج آثارًا قانونية تخصّك أو تؤثر فيك بشكل مماثل في الأهمية استنادًا إلى المعالجة الآلية وحدها، بما في ذلك التحليل الشخصي.',
                    'وحين نستخدم أدوات آلية لأغراض أمنية، مثل تقييم محاولة تسجيل دخول بحثًا عن مؤشرات حشو بيانات الاعتماد، يراجع شخص مختص أي نتيجة قد تقيّد وصولك إلى حسابك قبل أن تصبح نهائية.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'إشارة عدم التتبع والتحكم العالمي في الخصوصية',
                'body' => [
                    'نلتزم بإشارة التحكم العالمي في الخصوصية (Global Privacy Control) بوصفها انسحابًا صحيحًا من بيع المعلومات الشخصية أو مشاركتها في الولايات القضائية التي تعترف بها. ولأننا لا نبيع المعلومات الشخصية أو نشاركها أصلًا، فإن هذا الانسحاب يوافق موقفنا الافتراضي.',
                    'ولا يوجد معيار موحّد في القطاع لإشارة عدم التتبع (Do Not Track) الأقدم، لذا لا نستجيب لها. ولا تتغير ممارساتنا بناءً على تفعيلها من عدمه.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'الروابط والخدمات الخارجية',
                'body' => [
                    'يحتوي موقعنا ومنتجاتنا على روابط لمواقع وخدمات تابعة لأطراف ثالثة لا نتحكم فيها، بما في ذلك مواقع المنتجات ومستودعات الشيفرة وحسابات التواصل الاجتماعي المذكورة في تذييل الموقع.',
                    'ولا تنطبق هذه السياسة على تلك الخدمات. ونشجعك على قراءة سياسة الخصوصية الخاصة بأي خدمة خارجية قبل تزويدها ببيانات شخصية.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'التعديلات على هذه السياسة',
                'body' => [
                    'نحدّث هذه السياسة عند تغيّر ممارساتنا أو منتجاتنا أو القانون. وتحمل كل نسخة تاريخ سريان ورقم إصدار، ويظهران أعلى هذه الصفحة.',
                    'وحين يؤثر التعديل جوهريًا في حقوقك أو في كيفية استخدامنا لبياناتك، سننشر إشعارًا بارزًا على الموقع، وسنخطرك عبر البريد الإلكتروني — إن كان لدينا عنوانك — قبل 14 يومًا على الأقل من سريان التعديل. وحيثما يشترط القانون موافقة جديدة، سنطلبها بدلًا من الاعتماد على استمرارك في الاستخدام.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'كيفية التواصل معنا',
                'body' => [
                    'لأي استفسار بشأن هذه السياسة أو بشأن طريقة تعاملنا مع بياناتك الشخصية، أو لممارسة أي من حقوقك، تواصل معنا عبر البيانات أدناه. ونسعى للرد على كل استفسار يتعلق بالخصوصية خلال خمسة أيام عمل، وضمن المدة التي يفرضها القانون دائمًا.',
                    'وإذا لزمنا تعيين ممثل في الاتحاد الأوروبي أو المملكة المتحدة بموجب المادة 27 من النظام الأوروبي العام لحماية البيانات، أو مسؤول لحماية البيانات بموجب المادة 37، فستُنشر بيانات التواصل معه في هذا القسم.',
                    'ويحق لك دائمًا تقديم شكوى إلى جهة حماية البيانات في بلدك. ونقدّر أن تمنحنا الفرصة لمعالجة ملاحظتك أولًا.',
                ],
                'list' => [
                    '{{company}}',
                    'العنوان المسجّل: {{registered_address}}',
                    'الخصوصية وحماية البيانات: {{privacy_email}}',
                    'الاستفسارات العامة: {{contact_email}}',
                ],
            ],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function termsSectionsEn(): array
    {
        return [
            [
                'heading' => 'Agreement to These Terms',
                'body' => [
                    'These Terms of Service form a binding agreement between you and {{company}} (Quartz, we, us, our) and govern your access to and use of {{site_url}}, our applications, and the products and services we make available through them.',
                    'By accessing the site, creating an account, or using any of our services, you confirm that you have read and accepted these Terms and our Privacy Policy. If you do not agree, please do not use the services.',
                    'If you accept these Terms on behalf of a company or other organisation, you confirm that you have the authority to bind that organisation, and you and it are jointly responsible for compliance.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Definitions',
                'body' => [
                    'The following terms carry the meanings given below wherever they appear in this document.',
                ],
                'list' => [
                    'Services: the website, the applications, and any software development, automation, quality assurance, or cybersecurity work we provide.',
                    'Account: the credentials and profile that let you access a Quartz product.',
                    'Order Form or SOW: a signed proposal, statement of work, order form, or purchase agreement that describes a specific engagement.',
                    'Deliverables: the software, documentation, designs, and other materials we produce for you under an Order Form or SOW.',
                    'Your Content: the data, files, text, and other material you or your users submit to the Services.',
                ],
            ],
            [
                'heading' => 'Eligibility',
                'body' => [
                    'You must be at least 18 years old, or the age of majority where you live if that is higher, to create an account or enter into a contract with us.',
                    'You may not use the Services if you are barred from doing so under any applicable law, or if you are a person or entity subject to trade sanctions as described in the export control section below.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Your Account and Its Security',
                'body' => [
                    'You agree to provide accurate and complete information when you create an account, and to keep it current. You are responsible for safeguarding your credentials and for all activity that occurs under your account.',
                    'Tell us immediately at {{legal_email}} if you suspect any unauthorised access. We may suspend an account without notice where we reasonably believe it has been compromised, is being used to abuse the Services, or must be suspended to protect other users or comply with the law, and we will restore access as soon as the issue is resolved.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Signing In Through Google, Apple, or Microsoft',
                'body' => [
                    'Where we offer sign-in through a third-party identity provider, using it is optional and your relationship with that provider remains governed by that provider terms and privacy policy.',
                    'By choosing to sign in through a provider, you authorise us to receive the account identifiers described in our Privacy Policy and to use them to create and secure your account. If you revoke our access from the provider, you may lose the ability to sign in, and you should set a password or connect another provider first to avoid being locked out.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'The Services We Provide',
                'body' => [
                    'Quartz provides custom software development, business process automation, quality assurance and testing, and cybersecurity services, together with the products described on our website.',
                    'Content on the website — including case studies, metrics, and descriptions of past work — is provided for information only. It is not an offer, a guarantee of a particular result, or professional advice for your circumstances.',
                    'Project work is governed by a signed Order Form or SOW. Where a signed Order Form or SOW conflicts with these Terms, that document prevails to the extent of the conflict, and these Terms continue to apply to everything else.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Acceptable Use',
                'body' => [
                    'You agree to use the Services lawfully and not to do any of the following, or help anyone else do them.',
                    'We may investigate suspected breaches of this section and may suspend or terminate access where we find one. Where a breach involves a security threat or unlawful activity, we may report it to the relevant authority.',
                ],
                'list' => [
                    'Use the Services in violation of any applicable law or regulation.',
                    'Infringe the intellectual property, privacy, or other rights of anyone else.',
                    'Upload or transmit malware, or anything designed to disrupt, damage, or gain unauthorised access to any system.',
                    'Probe, scan, or test the vulnerability of our systems, or attempt to breach security or authentication measures, without our prior written authorisation.',
                    'Scrape, harvest, or extract data by automated means beyond what our robots.txt permits, or in a way that places an unreasonable load on our infrastructure.',
                    'Reverse engineer, decompile, or disassemble any part of the Services, except to the extent applicable law expressly permits despite this restriction.',
                    'Resell, sublicense, or make the Services available to third parties except as a signed agreement allows.',
                    'Misrepresent your identity or affiliation, or impersonate any person or entity.',
                    'Submit personal data you do not have the right to share with us, or that a signed data processing agreement does not cover.',
                ],
            ],
            [
                'heading' => 'App Stores and Third-Party Platforms',
                'body' => [
                    'If you obtain a Quartz application through a third-party platform such as the Apple App Store, Google Play, or the Microsoft Store, your use is also subject to that platform terms, and you agree to comply with them. The platform provider is not responsible for the application or its content.',
                    'The following terms apply to any application you obtain through the Apple App Store. These Terms are concluded between you and {{company}} only, and not with Apple. Apple has no obligation to furnish any maintenance or support for the application. If the application fails to conform to any applicable warranty, you may notify Apple, and Apple will refund the purchase price to you; to the maximum extent permitted by law, Apple has no other warranty obligation with respect to the application. Apple is not responsible for addressing any claim relating to the application, including product liability claims, any claim that the application fails to conform to a legal or regulatory requirement, claims arising under consumer protection or privacy legislation, and third-party claims that the application infringes intellectual property rights.',
                    'Apple is a third-party beneficiary of these Terms, and Apple and its subsidiaries may enforce these Terms against you as such. You represent that you are not located in a country subject to a United States Government embargo or designated as a terrorist-supporting country, and that you are not listed on any United States Government list of prohibited or restricted parties.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Fees, Invoicing, and Taxes',
                'body' => [
                    'Fees, payment schedules, and currencies are set out in the applicable Order Form or SOW. Unless it states otherwise, invoices are payable within 30 days of the invoice date.',
                    'We may charge interest on overdue amounts at the lower of 1.5 percent per month or the maximum the law allows, and may suspend work on overdue accounts after giving you written notice and a reasonable chance to pay.',
                    'All fees are exclusive of value added tax, sales tax, withholding tax, and any other duty or levy. You are responsible for those amounts, other than taxes on our net income. Where the law requires you to withhold tax, you will gross up the payment so that we receive the full invoiced amount.',
                    'Fees already paid are non-refundable except where these Terms, a signed agreement, or mandatory law provides otherwise.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Intellectual Property',
                'body' => [
                    'We own, or are licensed to use, everything that makes up the website and our products, including the software, design, text, graphics, and trade marks. Nothing in these Terms transfers any of that to you.',
                    'We grant you a limited, revocable, non-exclusive, non-transferable licence to access and use the Services for your internal business purposes, in accordance with these Terms and any applicable Order Form.',
                    'Ownership of Deliverables produced for you transfers as the applicable Order Form or SOW specifies, and unless it says otherwise that transfer takes effect on our receipt of payment in full. We retain ownership of our pre-existing materials, tools, libraries, frameworks, and general know-how, and we grant you a perpetual, non-exclusive licence to use them to the extent they are embedded in a Deliverable.',
                    'If you send us feedback or suggestions, you grant us a perpetual, irrevocable, royalty-free licence to use them without obligation to you. We will not identify you as the source without your permission.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Your Content and Your Data',
                'body' => [
                    'You keep all ownership of Your Content. You grant us a limited licence to host, store, process, transmit, and display it strictly as needed to provide the Services and support you.',
                    'You are responsible for Your Content, including having the rights and any consents needed to give it to us. Our handling of personal data within Your Content is governed by our Privacy Policy and, where one applies, by the data processing agreement between us.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Confidentiality',
                'body' => [
                    'Each party may receive information from the other that is marked confidential or that a reasonable person would understand to be confidential. The receiving party will protect it with at least the care it applies to its own confidential information, use it only to perform this agreement, and disclose it only to employees and contractors who need it and are under equivalent obligations.',
                    'These obligations continue for five years after disclosure, and for as long as the information remains a trade secret under applicable law.',
                    'They do not apply to information that is or becomes public without breach, was already known without a duty of confidence, is independently developed, or is lawfully received from a third party. Where disclosure is compelled by law or court order, the receiving party will give prompt notice where it is legally permitted to do so, and disclose only what is required.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Third-Party Components and Open Source',
                'body' => [
                    'Our Services and Deliverables may include third-party and open source components, each governed by its own licence. Those licences apply to those components and, where they conflict with these Terms in respect of that component, they prevail.',
                    'Where a Deliverable includes open source components, we identify them and their licences in the documentation we hand over.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Beta, Trial, and Free Features',
                'body' => [
                    'We may offer features labelled beta, preview, trial, or similar. They are provided as-is and as-available, may change or be withdrawn at any time, and are excluded from any service level commitment and from the warranties in this agreement to the fullest extent the law allows.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Disclaimer of Warranties',
                'body' => [
                    'Except where a signed Order Form or SOW expressly states otherwise, and to the fullest extent permitted by law, the Services are provided as-is and as-available, and we disclaim all warranties, whether express, implied, statutory, or otherwise, including any implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement.',
                    'We do not warrant that the Services will be uninterrupted, timely, error-free, or free of harmful components, or that any defect will be corrected.',
                    'Cybersecurity services reduce risk; they cannot eliminate it. No assessment, test, or control set can guarantee that a system is free of vulnerabilities or that a breach will not occur.',
                    'Nothing in these Terms limits any warranty or right that mandatory consumer law in your country of residence grants you and does not allow to be excluded.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Limitation of Liability',
                'body' => [
                    'To the fullest extent permitted by law, neither party is liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for loss of profits, revenue, business, anticipated savings, data, or goodwill, whether or not the possibility of such loss was known.',
                    'To the fullest extent permitted by law, the total aggregate liability of each party arising out of or relating to these Terms is limited to {{liability_cap}}.',
                    'These limits do not apply to death or personal injury caused by negligence, to fraud or fraudulent misrepresentation, to gross negligence or wilful misconduct, to your obligation to pay fees due, or to any liability that applicable law does not permit to be limited or excluded.',
                    'The parties agree that these limits are a reasonable allocation of risk that is reflected in our pricing, and that they survive any failure of an exclusive remedy.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Indemnification',
                'body' => [
                    'You agree to defend, indemnify, and hold harmless {{company}}, its officers, employees, and contractors from any third-party claim, and from the resulting damages, losses, and reasonable legal costs, that arises out of your breach of these Terms, your unlawful or unauthorised use of the Services, or Your Content, including any claim that Your Content infringes the rights of a third party.',
                    'We will notify you promptly of any claim, give you reasonable control of the defence, and cooperate at your expense. You may not settle a claim in a way that imposes any obligation or admission on us without our written consent.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Term, Suspension, and Termination',
                'body' => [
                    'These Terms apply for as long as you use the Services. You may stop using them and close your account at any time, and either party may terminate an Order Form as that document provides.',
                    'We may suspend or terminate your access, with notice where practicable, if you materially breach these Terms and do not cure the breach within 14 days of notice, if your use creates a security or legal risk to us or to others, or if we are required to do so by law.',
                    'On termination, your licence to use the Services ends and you must stop using them. You may export Your Content for 30 days after termination, after which we may delete it in line with our retention schedule. Sections that by their nature should survive — including fees accrued, intellectual property, confidentiality, disclaimers, limitation of liability, indemnification, and governing law — survive termination.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Export Control and Sanctions',
                'body' => [
                    'The Services and any Deliverables may be subject to export control and economic sanctions laws, including those of the United States, the United Kingdom, the European Union, and the United Nations, as well as those of your own country. You agree to comply with all of them.',
                    'You represent and warrant that you are not located in, organised under the laws of, or ordinarily resident in a country or territory subject to comprehensive trade sanctions; that you are not owned or controlled by, or acting on behalf of, any party on a restricted or denied party list, including the United States Specially Designated Nationals list and equivalent United Kingdom, European Union, and United Nations lists; and that you will not use, export, or re-export the Services or Deliverables for any prohibited end use, including any use connected with nuclear, chemical, or biological weapons or missile technology.',
                    'We may suspend or terminate the Services immediately, without liability, if we reasonably determine that continuing to provide them would breach any sanctions or export control law.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Force Majeure',
                'body' => [
                    'Neither party is liable for a delay or failure to perform caused by an event beyond its reasonable control, including natural disaster, war, civil unrest, epidemic, labour dispute, failure of a utility, telecommunications or cloud infrastructure provider, or an act of government. The affected party will notify the other promptly and use reasonable efforts to resume performance.',
                    'This section does not excuse any obligation to pay amounts already due.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Changes to the Services and to These Terms',
                'body' => [
                    'We may change, suspend, or discontinue any part of the Services. Where a change materially reduces functionality you rely on under a paid Order Form, we will give you reasonable prior notice.',
                    'We may also update these Terms. Every version carries an effective date and version number shown at the top of this page. Where a change materially affects your rights, we will give notice on the site, and by email where we hold your address, at least 14 days before it takes effect. Continued use after the effective date means you accept the updated Terms, to the extent the applicable law allows; where it requires your express agreement, we will ask for it.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'Governing Law and Dispute Resolution',
                'body' => [
                    'These Terms and any dispute arising out of or in connection with them, including any non-contractual dispute, are governed by the laws of {{governing_law}}, without regard to conflict of law rules. The United Nations Convention on Contracts for the International Sale of Goods does not apply.',
                    'Before starting formal proceedings, each party agrees to raise the dispute in writing to the other and to attempt in good faith to resolve it within 30 days.',
                    'Any dispute that is not resolved that way is subject to the exclusive jurisdiction of the courts of {{dispute_venue}}, unless a signed Order Form provides for arbitration, in which case the arbitration terms in that document apply.',
                    'If you are a consumer, nothing in this section deprives you of the protection of the mandatory laws of your country of residence, or of your right to bring proceedings in the courts of that country where the law gives you that right.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'General',
                'body' => [
                    'These Terms, together with our Privacy Policy and any signed Order Form or SOW, are the entire agreement between us on their subject matter and replace any prior understanding on it.',
                    'If a provision is found invalid or unenforceable, it is modified to the minimum extent needed to make it enforceable, or severed if it cannot be, and the rest remains in force. A failure to enforce a right is not a waiver of it.',
                    'You may not assign these Terms without our written consent. We may assign them to an affiliate or in connection with a merger, acquisition, or sale of assets, on notice to you. These Terms do not create any partnership, agency, joint venture, or employment relationship.',
                    'Notices to us must be sent to {{legal_email}}. Notices to you will be sent to the email address on your account or posted in the Services.',
                    'This document is published in English and Arabic. If there is any inconsistency between the two versions, the English version prevails, except where mandatory local law requires otherwise.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'How to Contact Us',
                'body' => [
                    'Questions about these Terms, or about a specific engagement, should go to the contacts below.',
                ],
                'list' => [
                    '{{company}}',
                    'Registered address: {{registered_address}}',
                    'Legal and contractual enquiries: {{legal_email}}',
                    'General enquiries: {{contact_email}}',
                ],
            ],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function termsSectionsAr(): array
    {
        return [
            [
                'heading' => 'الموافقة على هذه الشروط',
                'body' => [
                    'تشكّل شروط الخدمة هذه اتفاقية ملزمة بينك وبين {{company}} (ويُشار إليها بـ Quartz أو نحن)، وتحكم وصولك إلى {{site_url}} وتطبيقاتنا والمنتجات والخدمات التي نتيحها من خلالها واستخدامك لها.',
                    'وبدخولك إلى الموقع أو إنشاء حساب أو استخدام أي من خدماتنا، فإنك تؤكد أنك قرأت هذه الشروط وسياسة الخصوصية ووافقت عليهما. وإذا كنت لا توافق، فيرجى عدم استخدام الخدمات.',
                    'وإذا قبلت هذه الشروط نيابةً عن شركة أو جهة أخرى، فإنك تؤكد امتلاكك صلاحية إلزام تلك الجهة، وتتحمل أنت وهي المسؤولية بالتضامن عن الالتزام بها.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'التعريفات',
                'body' => [
                    'تحمل المصطلحات التالية المعاني المبيّنة أدناه أينما وردت في هذه الوثيقة.',
                ],
                'list' => [
                    'الخدمات: الموقع الإلكتروني والتطبيقات وأي أعمال تطوير برمجي أو أتمتة أو ضمان جودة أو أمن سيبراني نقدّمها.',
                    'الحساب: بيانات الاعتماد والملف الشخصي التي تتيح لك الوصول إلى أحد منتجات Quartz.',
                    'أمر العمل أو نطاق العمل: عرض أو بيان نطاق عمل أو أمر شراء أو اتفاقية موقّعة تصف مشروعًا محددًا.',
                    'المخرجات: البرمجيات والوثائق والتصاميم والمواد الأخرى التي ننتجها لك بموجب أمر عمل أو نطاق عمل.',
                    'محتواك: البيانات والملفات والنصوص والمواد الأخرى التي ترسلها أنت أو مستخدموك إلى الخدمات.',
                ],
            ],
            [
                'heading' => 'الأهلية',
                'body' => [
                    'يجب ألا يقل عمرك عن 18 عامًا، أو سن الرشد في بلدك إن كان أعلى، لإنشاء حساب أو إبرام عقد معنا.',
                    'ولا يجوز لك استخدام الخدمات إذا كان القانون المعمول به يمنعك من ذلك، أو إذا كنت شخصًا أو جهة خاضعة لعقوبات تجارية على النحو الموضح في قسم ضوابط التصدير أدناه.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'حسابك وأمنه',
                'body' => [
                    'تلتزم بتقديم معلومات دقيقة وكاملة عند إنشاء حسابك، وبتحديثها باستمرار. وأنت مسؤول عن حماية بيانات اعتمادك وعن جميع الأنشطة التي تجري عبر حسابك.',
                    'وأبلغنا فورًا على {{legal_email}} إذا اشتبهت في أي وصول غير مصرّح به. وقد نوقف الحساب دون إشعار مسبق إذا اعتقدنا لأسباب معقولة أنه اختُرق أو يُستخدم لإساءة استخدام الخدمات أو أن إيقافه لازم لحماية المستخدمين الآخرين أو للامتثال للقانون، وسنعيد الوصول فور معالجة المشكلة.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'تسجيل الدخول عبر Google أو Apple أو Microsoft',
                'body' => [
                    'حين نتيح تسجيل الدخول عبر مزوّد هوية من طرف ثالث، يكون استخدامه اختياريًا وتظل علاقتك بذلك المزوّد محكومة بشروطه وسياسة الخصوصية الخاصة به.',
                    'وباختيارك تسجيل الدخول عبر مزوّد، فإنك تفوّضنا بتلقي معرّفات الحساب الموضحة في سياسة الخصوصية واستخدامها لإنشاء حسابك وتأمينه. وإذا ألغيت وصولنا من جهة المزوّد فقد تفقد إمكانية تسجيل الدخول، لذا ننصح بتعيين كلمة مرور أو ربط مزوّد آخر أولًا تفاديًا لفقدان الوصول.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'الخدمات التي نقدّمها',
                'body' => [
                    'تقدّم Quartz خدمات تطوير البرمجيات المخصصة وأتمتة العمليات وضمان الجودة والاختبار والأمن السيبراني، إضافة إلى المنتجات الموضحة على موقعنا.',
                    'والمحتوى المنشور على الموقع — بما فيه دراسات الحالة والمؤشرات وأوصاف الأعمال السابقة — مقدَّم لغرض العلم فقط. وهو ليس عرضًا ملزمًا ولا ضمانًا لنتيجة معينة ولا استشارة مهنية تخص ظروفك.',
                    'وتخضع أعمال المشاريع لأمر عمل أو نطاق عمل موقّع. وعند تعارض أمر العمل الموقّع مع هذه الشروط، تسود تلك الوثيقة بقدر التعارض فقط، وتظل هذه الشروط سارية على ما عداه.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'الاستخدام المقبول',
                'body' => [
                    'تلتزم باستخدام الخدمات وفق القانون، وبألا تقوم بأي مما يلي أو تساعد غيرك على القيام به.',
                    'ويجوز لنا التحقيق في أي مخالفة مشتبه بها لهذا القسم وإيقاف الوصول أو إنهاؤه عند ثبوتها. وإذا انطوت المخالفة على تهديد أمني أو نشاط غير مشروع، فقد نبلّغ الجهة المختصة.',
                ],
                'list' => [
                    'استخدام الخدمات بما يخالف أي قانون أو لائحة معمول بها.',
                    'التعدي على حقوق الملكية الفكرية أو الخصوصية أو أي حقوق أخرى للغير.',
                    'رفع أو نقل برمجيات خبيثة أو أي شيء مصمم لتعطيل أي نظام أو الإضرار به أو الوصول غير المصرّح به إليه.',
                    'فحص أنظمتنا أو مسحها أو اختبار ثغراتها أو محاولة اختراق تدابير الأمان أو المصادقة دون إذن كتابي مسبق منا.',
                    'كشط البيانات أو حصادها أو استخراجها بوسائل آلية بما يتجاوز ما يسمح به ملف robots.txt لدينا، أو بطريقة تُحمّل بنيتنا التحتية عبئًا غير معقول.',
                    'الهندسة العكسية لأي جزء من الخدمات أو فك ترجمته أو تفكيكه، إلا بالقدر الذي يجيزه القانون المعمول به صراحةً رغم هذا القيد.',
                    'إعادة بيع الخدمات أو ترخيصها من الباطن أو إتاحتها للغير إلا بما تسمح به اتفاقية موقّعة.',
                    'تقديم بيانات مضللة عن هويتك أو انتمائك، أو انتحال صفة أي شخص أو جهة.',
                    'إرسال بيانات شخصية لا تملك حق مشاركتها معنا أو لا تغطيها اتفاقية معالجة بيانات موقّعة.',
                ],
            ],
            [
                'heading' => 'متاجر التطبيقات والمنصات الخارجية',
                'body' => [
                    'إذا حصلت على أحد تطبيقات Quartz عبر منصة تابعة لطرف ثالث مثل Apple App Store أو Google Play أو Microsoft Store، فإن استخدامك يخضع أيضًا لشروط تلك المنصة وتلتزم بالامتثال لها. ومزوّد المنصة ليس مسؤولًا عن التطبيق أو محتواه.',
                    'وتنطبق الشروط التالية على أي تطبيق تحصل عليه عبر Apple App Store: هذه الشروط مبرمة بينك وبين {{company}} فقط وليست مع Apple. ولا تتحمل Apple أي التزام بتقديم الصيانة أو الدعم للتطبيق. وإذا لم يفِ التطبيق بأي ضمان منطبق، يمكنك إخطار Apple وستردّ لك ثمن الشراء؛ وإلى أقصى حد يسمح به القانون، لا تتحمل Apple أي التزام ضمان آخر بشأن التطبيق. ولا تتحمل Apple مسؤولية معالجة أي مطالبة تتعلق بالتطبيق، بما في ذلك مطالبات المسؤولية عن المنتج، وأي ادعاء بعدم مطابقة التطبيق لمتطلب قانوني أو تنظيمي، والمطالبات الناشئة عن أنظمة حماية المستهلك أو الخصوصية، ومطالبات الغير بشأن التعدي على حقوق الملكية الفكرية.',
                    'وتُعدّ Apple مستفيدًا من الغير (third-party beneficiary) من هذه الشروط، ويجوز لها ولشركاتها التابعة إنفاذ هذه الشروط تجاهك بهذه الصفة. وتقرّ بأنك لا تقيم في دولة خاضعة لحظر من حكومة الولايات المتحدة أو مصنّفة كدولة داعمة للإرهاب، وبأنك غير مدرج في أي قائمة أطراف محظورة أو مقيّدة صادرة عن حكومة الولايات المتحدة.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'الأتعاب والفوترة والضرائب',
                'body' => [
                    'تُحدَّد الأتعاب وجداول السداد والعملات في أمر العمل أو نطاق العمل المنطبق. وما لم يُنص على خلاف ذلك، تُسدَّد الفواتير خلال 30 يومًا من تاريخ إصدارها.',
                    'ويجوز لنا احتساب فائدة على المبالغ المتأخرة بواقع 1.5 بالمئة شهريًا أو الحد الأقصى الذي يجيزه القانون، أيهما أقل، وإيقاف العمل على الحسابات المتأخرة بعد إشعارك كتابيًا ومنحك مهلة معقولة للسداد.',
                    'وجميع الأتعاب غير شاملة لضريبة القيمة المضافة أو ضريبة المبيعات أو الاستقطاع أو أي رسوم أخرى، وتتحمل أنت تلك المبالغ باستثناء الضرائب على دخلنا الصافي. وإذا ألزمك القانون باستقطاع ضريبة، فإنك تزيد قيمة الدفعة بحيث نتسلّم كامل المبلغ المفوتر.',
                    'والأتعاب المسددة غير قابلة للاسترداد إلا حيثما تنص هذه الشروط أو اتفاقية موقّعة أو قانون آمر على خلاف ذلك.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'الملكية الفكرية',
                'body' => [
                    'نملك — أو نملك ترخيصًا باستخدام — كل ما يتكوّن منه الموقع ومنتجاتنا، بما في ذلك البرمجيات والتصميم والنصوص والرسوم والعلامات التجارية. ولا ينقل أي بند في هذه الشروط أيًا من ذلك إليك.',
                    'ونمنحك ترخيصًا محدودًا وقابلًا للإلغاء وغير حصري وغير قابل للتحويل للوصول إلى الخدمات واستخدامها لأغراض أعمالك الداخلية، وفقًا لهذه الشروط وأي أمر عمل منطبق.',
                    'وتنتقل ملكية المخرجات المنتجة لك وفق ما يحدده أمر العمل أو نطاق العمل المنطبق، وما لم يُنص على خلاف ذلك يسري الانتقال عند استلامنا كامل المقابل. ونحتفظ بملكية موادنا وأدواتنا ومكتباتنا وأطر عملنا ومعارفنا العامة السابقة، ونمنحك ترخيصًا دائمًا غير حصري لاستخدامها بقدر تضمينها في المخرجات.',
                    'وإذا أرسلت إلينا ملاحظات أو اقتراحات، فإنك تمنحنا ترخيصًا دائمًا وغير قابل للإلغاء ومجانيًا لاستخدامها دون أي التزام تجاهك. ولن نذكرك بوصفك مصدرها دون إذنك.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'محتواك وبياناتك',
                'body' => [
                    'تحتفظ بكامل ملكية محتواك. وتمنحنا ترخيصًا محدودًا لاستضافته وتخزينه ومعالجته ونقله وعرضه بالقدر اللازم حصرًا لتقديم الخدمات ودعمك.',
                    'وأنت مسؤول عن محتواك، بما في ذلك امتلاك الحقوق والموافقات اللازمة لتزويدنا به. وتخضع معالجتنا للبيانات الشخصية الواردة في محتواك لسياسة الخصوصية، ولاتفاقية معالجة البيانات المبرمة بيننا حيثما انطبقت.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'السرية',
                'body' => [
                    'قد يتلقى كل طرف من الآخر معلومات موسومة بأنها سرية أو يفهم الشخص المعتاد أنها سرية. ويلتزم الطرف المتلقي بحمايتها بعناية لا تقل عن عنايته بمعلوماته السرية، وباستخدامها فقط لتنفيذ هذه الاتفاقية، وبعدم إفشائها إلا للموظفين والمتعاقدين الذين يحتاجون إليها والخاضعين لالتزامات مماثلة.',
                    'وتستمر هذه الالتزامات لمدة خمس سنوات بعد الإفصاح، وطوال بقاء المعلومة سرًا تجاريًا بموجب القانون المعمول به.',
                    'ولا تنطبق على المعلومات العامة أو التي تصبح كذلك دون مخالفة، أو التي كانت معلومة سلفًا دون واجب سرية، أو التي طُوِّرت بشكل مستقل، أو التي وردت بصورة مشروعة من طرف ثالث. وعند إلزام الطرف المتلقي بالإفصاح بموجب القانون أو أمر قضائي، يخطر الطرف الآخر فورًا متى سمح القانون بذلك ويفصح بالقدر المطلوب فقط.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'المكوّنات الخارجية والمصادر المفتوحة',
                'body' => [
                    'قد تتضمن خدماتنا ومخرجاتنا مكوّنات من أطراف ثالثة أو مفتوحة المصدر، يخضع كل منها لترخيصه الخاص. وتنطبق تلك التراخيص على تلك المكوّنات، وتسود على هذه الشروط بشأن المكوّن المعني عند التعارض.',
                    'وحين تتضمن المخرجات مكوّنات مفتوحة المصدر، نحدّدها ونحدّد تراخيصها في الوثائق التي نسلّمها.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'الميزات التجريبية والمجانية',
                'body' => [
                    'قد نتيح ميزات موسومة بأنها تجريبية أو أولية أو مجانية أو ما شابه. وتُقدَّم كما هي وبحسب توافرها، وقد تتغير أو تُسحب في أي وقت، وتُستثنى من أي التزام بمستوى الخدمة ومن الضمانات الواردة في هذه الاتفاقية إلى أقصى حد يسمح به القانون.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'إخلاء المسؤولية عن الضمانات',
                'body' => [
                    'باستثناء ما ينص عليه أمر عمل موقّع صراحةً، وإلى أقصى حد يسمح به القانون، تُقدَّم الخدمات كما هي وبحسب توافرها، ونخلي مسؤوليتنا من جميع الضمانات الصريحة أو الضمنية أو النظامية أو غيرها، بما في ذلك الضمانات الضمنية للرواج التجاري والملاءمة لغرض معين وسلامة الملكية وعدم التعدي.',
                    'ولا نضمن أن تكون الخدمات متواصلة أو في وقتها أو خالية من الأخطاء أو من المكوّنات الضارة، ولا أن يُصحَّح كل خلل.',
                    'وخدمات الأمن السيبراني تقلّل المخاطر ولا تلغيها. فلا يمكن لأي تقييم أو اختبار أو مجموعة ضوابط أن تضمن خلو نظام من الثغرات أو عدم وقوع اختراق.',
                    'ولا يحد أي بند في هذه الشروط من أي ضمان أو حق يمنحك إياه قانون حماية المستهلك الآمر في بلد إقامتك ولا يجيز استبعاده.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'حدود المسؤولية',
                'body' => [
                    'إلى أقصى حد يسمح به القانون، لا يتحمل أي من الطرفين المسؤولية عن الأضرار غير المباشرة أو العرضية أو الخاصة أو التبعية أو الرادعة، ولا عن خسارة الأرباح أو الإيرادات أو الأعمال أو الوفورات المتوقعة أو البيانات أو السمعة، سواء عُلم باحتمال وقوعها أم لا.',
                    'وإلى أقصى حد يسمح به القانون، تقتصر المسؤولية الإجمالية لكل طرف الناشئة عن هذه الشروط أو المتصلة بها على {{liability_cap}}.',
                    'ولا تنطبق هذه الحدود على الوفاة أو الإصابة الشخصية الناجمة عن الإهمال، ولا على الاحتيال أو التضليل الاحتيالي، ولا على الإهمال الجسيم أو سوء السلوك المتعمد، ولا على التزامك بسداد الأتعاب المستحقة، ولا على أي مسؤولية لا يجيز القانون المعمول به تقييدها أو استبعادها.',
                    'ويتفق الطرفان على أن هذه الحدود توزيع معقول للمخاطر انعكس في تسعيرنا، وأنها تظل سارية حتى لو أخفق أي تعويض حصري في تحقيق غرضه.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'التعويض',
                'body' => [
                    'تلتزم بالدفاع عن {{company}} ومسؤوليها وموظفيها ومتعاقديها وتعويضهم وإبراء ذمتهم من أي مطالبة من الغير، ومن الأضرار والخسائر والتكاليف القانونية المعقولة الناتجة عنها، الناشئة عن مخالفتك لهذه الشروط أو استخدامك غير المشروع أو غير المصرّح به للخدمات أو عن محتواك، بما في ذلك أي ادعاء بأن محتواك يتعدى على حقوق الغير.',
                    'وسنخطرك فورًا بأي مطالبة، ونمنحك سيطرة معقولة على الدفاع، ونتعاون معك على نفقتك. ولا يجوز لك تسوية أي مطالبة بطريقة تفرض علينا التزامًا أو إقرارًا دون موافقتنا الكتابية.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'المدة والإيقاف والإنهاء',
                'body' => [
                    'تسري هذه الشروط ما دمت تستخدم الخدمات. ويمكنك التوقف عن استخدامها وإغلاق حسابك في أي وقت، ولكل طرف إنهاء أمر العمل وفق ما تنص عليه تلك الوثيقة.',
                    'ويجوز لنا إيقاف وصولك أو إنهاؤه، مع إشعارك متى أمكن، إذا خالفت هذه الشروط مخالفة جوهرية ولم تصححها خلال 14 يومًا من الإشعار، أو إذا شكّل استخدامك خطرًا أمنيًا أو قانونيًا علينا أو على غيرنا، أو إذا ألزمنا القانون بذلك.',
                    'وعند الإنهاء ينتهي ترخيصك باستخدام الخدمات ويجب أن تتوقف عن استخدامها. ويمكنك تصدير محتواك خلال 30 يومًا من الإنهاء، وبعدها يجوز لنا حذفه وفق جدول الاحتفاظ لدينا. وتظل سارية بعد الإنهاء البنود التي تقتضي طبيعتها ذلك، ومنها الأتعاب المستحقة والملكية الفكرية والسرية وإخلاء المسؤولية وحدود المسؤولية والتعويض والقانون الحاكم.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'ضوابط التصدير والعقوبات',
                'body' => [
                    'قد تخضع الخدمات وأي مخرجات لأنظمة ضوابط التصدير والعقوبات الاقتصادية، بما فيها أنظمة الولايات المتحدة والمملكة المتحدة والاتحاد الأوروبي والأمم المتحدة، إضافة إلى أنظمة بلدك. وتلتزم بالامتثال لها جميعًا.',
                    'وتقرّ وتضمن أنك لا تقيم في دولة أو إقليم خاضع لعقوبات تجارية شاملة ولست مؤسسًا بموجب قوانينه، وأنك غير مملوك أو خاضع لسيطرة أي طرف مدرج في قوائم الأطراف المقيّدة أو المحظورة أو تتصرف نيابةً عنه، بما في ذلك قائمة المواطنين المصنفين تحديدًا في الولايات المتحدة والقوائم المكافئة في المملكة المتحدة والاتحاد الأوروبي والأمم المتحدة، وأنك لن تستخدم الخدمات أو المخرجات أو تصدّرها أو تعيد تصديرها لأي استخدام نهائي محظور، بما في ذلك أي استخدام متصل بالأسلحة النووية أو الكيميائية أو البيولوجية أو تقنيات الصواريخ.',
                    'ويجوز لنا إيقاف الخدمات أو إنهاؤها فورًا ودون أي مسؤولية إذا رأينا لأسباب معقولة أن استمرار تقديمها يخالف أي نظام عقوبات أو ضوابط تصدير.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'القوة القاهرة',
                'body' => [
                    'لا يتحمل أي طرف مسؤولية التأخير أو الإخفاق في التنفيذ الناجم عن حدث خارج عن سيطرته المعقولة، بما في ذلك الكوارث الطبيعية والحروب والاضطرابات المدنية والأوبئة والنزاعات العمالية وأعطال المرافق أو الاتصالات أو مزوّدي البنية السحابية والإجراءات الحكومية. ويخطر الطرف المتأثر الطرف الآخر فورًا ويبذل جهدًا معقولًا لاستئناف التنفيذ.',
                    'ولا يعفي هذا القسم من أي التزام بسداد مبالغ مستحقة سلفًا.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'التعديلات على الخدمات وعلى هذه الشروط',
                'body' => [
                    'يجوز لنا تغيير أي جزء من الخدمات أو إيقافه أو إنهاؤه. وحين يقلّل التغيير جوهريًا من وظيفة تعتمد عليها بموجب أمر عمل مدفوع، سنشعرك مسبقًا بمدة معقولة.',
                    'ويجوز لنا كذلك تحديث هذه الشروط. وتحمل كل نسخة تاريخ سريان ورقم إصدار يظهران أعلى هذه الصفحة. وحين يؤثر التعديل جوهريًا في حقوقك، سننشر إشعارًا على الموقع ونراسلك عبر البريد الإلكتروني إن كان لدينا عنوانك، قبل 14 يومًا على الأقل من سريانه. ويعني استمرارك في الاستخدام بعد تاريخ السريان قبولك للشروط المحدّثة بالقدر الذي يسمح به القانون؛ وحيثما يشترط القانون موافقتك الصريحة، سنطلبها.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'القانون الحاكم وتسوية المنازعات',
                'body' => [
                    'تخضع هذه الشروط وأي نزاع ينشأ عنها أو يتصل بها، بما في ذلك المنازعات غير التعاقدية، لقوانين {{governing_law}}، دون اعتبار لقواعد تنازع القوانين. ولا تنطبق اتفاقية الأمم المتحدة بشأن عقود البيع الدولي للبضائع.',
                    'وقبل بدء أي إجراءات رسمية، يلتزم كل طرف بعرض النزاع كتابيًا على الطرف الآخر ومحاولة تسويته بحسن نية خلال 30 يومًا.',
                    'وأي نزاع لا يُحل بهذه الطريقة يخضع للاختصاص القضائي الحصري لمحاكم {{dispute_venue}}، ما لم ينص أمر عمل موقّع على التحكيم، وعندئذٍ تنطبق شروط التحكيم الواردة في تلك الوثيقة.',
                    'وإذا كنت مستهلكًا، فلا يحرمك أي بند في هذا القسم من حماية القوانين الآمرة في بلد إقامتك، ولا من حقك في رفع الدعوى أمام محاكم ذلك البلد متى منحك القانون هذا الحق.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'أحكام عامة',
                'body' => [
                    'تمثّل هذه الشروط، مع سياسة الخصوصية وأي أمر عمل أو نطاق عمل موقّع، كامل الاتفاق بيننا بشأن موضوعها وتحل محل أي تفاهم سابق بشأنه.',
                    'وإذا تبيّن بطلان أي بند أو تعذّر إنفاذه، يُعدَّل بالحد الأدنى اللازم لجعله قابلًا للإنفاذ، أو يُفصل إن تعذّر ذلك، وتبقى بقية البنود سارية. ولا يُعدّ التهاون في إنفاذ حق تنازلًا عنه.',
                    'ولا يجوز لك التنازل عن هذه الشروط دون موافقتنا الكتابية. ويجوز لنا التنازل عنها لشركة تابعة أو في إطار اندماج أو استحواذ أو بيع أصول مع إشعارك. ولا تنشئ هذه الشروط أي شراكة أو وكالة أو مشروع مشترك أو علاقة عمل.',
                    'وتُرسل الإشعارات إلينا على {{legal_email}}. وتُرسل الإشعارات إليك على عنوان البريد الإلكتروني المسجّل في حسابك أو تُنشر داخل الخدمات.',
                    'وتُنشر هذه الوثيقة بالعربية والإنجليزية. وعند وجود أي تعارض بين النسختين تسود النسخة الإنجليزية، إلا حيثما يقضي قانون محلي آمر بخلاف ذلك.',
                ],
                'list' => [],
            ],
            [
                'heading' => 'كيفية التواصل معنا',
                'body' => [
                    'توجَّه الأسئلة المتعلقة بهذه الشروط أو بمشروع محدد إلى جهات التواصل أدناه.',
                ],
                'list' => [
                    '{{company}}',
                    'العنوان المسجّل: {{registered_address}}',
                    'الاستفسارات القانونية والتعاقدية: {{legal_email}}',
                    'الاستفسارات العامة: {{contact_email}}',
                ],
            ],
        ];
    }
}
