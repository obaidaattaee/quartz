<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\Category;
use App\Models\PortfolioItem;
use App\Models\SeoMetadata;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class Phase04VerificationSeeder extends Seeder
{
    /**
     * Seed test data for Phase 4 verification.
     *
     * Creates categories, tags, blog posts, portfolio items, and SEO metadata
     * needed to verify all Phase 4 features work end-to-end.
     */
    public function run(): void
    {
        $this->seedCategories();
        $this->seedTags();
        $this->seedBlogPosts();
        $this->seedPortfolioItems();
        $this->seedSeoMetadata();
    }

    /**
     * Seed 5 blog categories matching service types + general.
     */
    private function seedCategories(): void
    {
        $categories = [
            ['name_en' => 'Development', 'name_ar' => 'التطوير', 'slug' => 'development', 'sort_order' => 1],
            ['name_en' => 'Automation', 'name_ar' => 'الأتمتة', 'slug' => 'automation', 'sort_order' => 2],
            ['name_en' => 'QA', 'name_ar' => 'ضمان الجودة', 'slug' => 'qa', 'sort_order' => 3],
            ['name_en' => 'Cybersecurity', 'name_ar' => 'الأمن السيبراني', 'slug' => 'cybersecurity', 'sort_order' => 4],
            ['name_en' => 'General', 'name_ar' => 'عام', 'slug' => 'general', 'sort_order' => 5],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }

        $this->command->info('Seeded 5 categories.');
    }

    /**
     * Seed 4 sample tags.
     */
    private function seedTags(): void
    {
        $tags = [
            ['name_en' => 'Laravel', 'name_ar' => 'لارافيل', 'slug' => 'laravel'],
            ['name_en' => 'React', 'name_ar' => 'رياكت', 'slug' => 'react'],
            ['name_en' => 'TypeScript', 'name_ar' => 'تايب سكريبت', 'slug' => 'typescript'],
            ['name_en' => 'Security', 'name_ar' => 'الأمان', 'slug' => 'security'],
        ];

        foreach ($tags as $tag) {
            Tag::updateOrCreate(
                ['slug' => $tag['slug']],
                $tag
            );
        }

        $this->command->info('Seeded 4 tags.');
    }

    /**
     * Seed 7 published blog posts for pagination testing (6 per page).
     */
    private function seedBlogPosts(): void
    {
        // Ensure we have an author user
        $author = User::where('role', 'admin')->first();

        if (! $author) {
            $author = User::first();
        }

        if (! $author) {
            $this->command->warn('No user found to use as author. Skipping blog post seeding.');

            return;
        }

        // Update author with bio for author profile card testing
        $author->update([
            'bio_en' => 'Full-stack developer with expertise in Laravel, React, and cloud architecture. Passionate about building scalable web applications.',
            'bio_ar' => 'مطور متكامل مع خبرة في لارافيل ورياكت والحوسبة السحابية. شغوف ببناء تطبيقات ويب قابلة للتوسع.',
            'social_links' => [
                'linkedin' => 'https://linkedin.com/in/quart-dev',
                'twitter' => 'https://twitter.com/quartdev',
                'github' => 'https://github.com/quartdev',
            ],
        ]);

        $categories = Category::all();
        $tags = Tag::all();

        $posts = [
            [
                'title_en' => 'Building Scalable APIs with Laravel',
                'title_ar' => 'بناء واجهات برمجة تطبيقات قابلة للتوسع باستخدام لارافيل',
                'slug' => 'building-scalable-apis-laravel',
                'excerpt_en' => 'Learn how to design and implement RESTful APIs that scale gracefully under load using Laravel best practices.',
                'excerpt_ar' => 'تعلم كيفية تصميم وتنفيذ واجهات برمجة تطبيقات RESTful التي تتوسع بسلاسة تحت الضغط باستخدام أفضل ممارسات لارافيل.',
                'content_en' => '<h2>Introduction</h2><p>Building APIs that can handle millions of requests requires careful planning and implementation. In this article, we explore Laravel patterns for scalable API development.</p><h2>Key Principles</h2><p>API versioning, rate limiting, caching strategies, and query optimization are essential for building APIs that perform well at scale.</p><h2>Conclusion</h2><p>With the right architecture and Laravel tools, building scalable APIs becomes straightforward.</p>',
                'content_ar' => '<h2>مقدمة</h2><p>بناء واجهات برمجة تطبيقات يمكنها التعامل مع ملايين الطلبات يتطلب تخطيطًا وتنفيذًا دقيقًا. في هذا المقال، نستكشف أنماط لارافيل لتطوير واجهات برمجة تطبيقات قابلة للتوسع.</p>',
                'categories' => ['development'],
                'tags' => ['laravel'],
                'meta_title_en' => 'Building Scalable APIs with Laravel | Quart Blog',
                'meta_description_en' => 'Expert guide to designing RESTful APIs that scale with Laravel.',
            ],
            [
                'title_en' => 'React 19: What Developers Need to Know',
                'title_ar' => 'رياكت 19: ما يحتاج المطورون لمعرفته',
                'slug' => 'react-19-what-developers-need-to-know',
                'excerpt_en' => 'An overview of the major changes in React 19 and how they impact your development workflow.',
                'excerpt_ar' => 'نظرة عامة على التغييرات الرئيسية في رياكت 19 وكيف تؤثر على سير عمل التطوير الخاص بك.',
                'content_en' => '<h2>React 19 Overview</h2><p>React 19 introduces several groundbreaking features including the React Compiler, Server Components improvements, and new hooks.</p><h2>Migration Guide</h2><p>Upgrading from React 18 to 19 requires attention to several deprecated APIs and new patterns.</p>',
                'content_ar' => '<h2>نظرة عامة على رياكت 19</h2><p>يقدم رياكت 19 العديد من الميزات الرائدة بما في ذلك مترجم رياكت وتحسينات مكونات الخادم.</p>',
                'categories' => ['development'],
                'tags' => ['react', 'typescript'],
            ],
            [
                'title_en' => 'CI/CD Pipeline Automation Best Practices',
                'title_ar' => 'أفضل ممارسات أتمتة خطوط CI/CD',
                'slug' => 'cicd-pipeline-automation-best-practices',
                'excerpt_en' => 'Streamline your deployment workflow with proven CI/CD automation strategies.',
                'excerpt_ar' => 'قم بتبسيط سير عمل النشر الخاص بك مع استراتيجيات أتمتة CI/CD مثبتة.',
                'content_en' => '<h2>Why CI/CD Matters</h2><p>Continuous integration and continuous deployment are essential for modern software development teams.</p><h2>Tools and Strategies</h2><p>From GitHub Actions to Jenkins, choosing the right tools depends on your team size and deployment needs.</p>',
                'content_ar' => '<h2>لماذا CI/CD مهم</h2><p>التكامل المستمر والنشر المستمر ضروريان لفرق تطوير البرمجيات الحديثة.</p>',
                'categories' => ['automation'],
                'tags' => [],
            ],
            [
                'title_en' => 'Automated Testing Strategies for Web Applications',
                'title_ar' => 'استراتيجيات الاختبار الآلي لتطبيقات الويب',
                'slug' => 'automated-testing-strategies-web-applications',
                'excerpt_en' => 'A comprehensive guide to implementing effective automated testing in your web projects.',
                'excerpt_ar' => 'دليل شامل لتنفيذ الاختبار الآلي الفعال في مشاريع الويب الخاصة بك.',
                'content_en' => '<h2>Testing Pyramid</h2><p>Understanding the testing pyramid helps you allocate testing effort effectively across unit, integration, and end-to-end tests.</p><h2>Tools</h2><p>PHPUnit for backend, Jest/Vitest for frontend, and Playwright for E2E testing provide comprehensive coverage.</p>',
                'content_ar' => '<h2>هرم الاختبار</h2><p>فهم هرم الاختبار يساعدك على توزيع جهود الاختبار بفعالية عبر اختبارات الوحدة والتكامل والشامل.</p>',
                'categories' => ['qa'],
                'tags' => ['laravel', 'react'],
            ],
            [
                'title_en' => 'Securing Your Laravel Application Against Common Threats',
                'title_ar' => 'تأمين تطبيق لارافيل الخاص بك ضد التهديدات الشائعة',
                'slug' => 'securing-laravel-application-common-threats',
                'excerpt_en' => 'Protect your Laravel application from SQL injection, XSS, CSRF, and other common web vulnerabilities.',
                'excerpt_ar' => 'احمِ تطبيق لارافيل الخاص بك من حقن SQL و XSS و CSRF وثغرات الويب الشائعة الأخرى.',
                'content_en' => '<h2>Common Vulnerabilities</h2><p>Web applications face many security threats. Understanding these threats is the first step to preventing them.</p><h2>Laravel Security Features</h2><p>Laravel provides many built-in security features including CSRF protection, prepared statements, and encryption.</p>',
                'content_ar' => '<h2>الثغرات الشائعة</h2><p>تواجه تطبيقات الويب العديد من التهديدات الأمنية. فهم هذه التهديدات هو الخطوة الأولى لمنعها.</p>',
                'categories' => ['cybersecurity'],
                'tags' => ['security', 'laravel'],
            ],
            [
                'title_en' => 'TypeScript Best Practices for React Projects',
                'title_ar' => 'أفضل ممارسات تايب سكريبت لمشاريع رياكت',
                'slug' => 'typescript-best-practices-react-projects',
                'excerpt_en' => 'Write safer, more maintainable React code with TypeScript patterns and techniques.',
                'excerpt_ar' => 'اكتب كود رياكت أكثر أمانًا وقابلية للصيانة مع أنماط وتقنيات تايب سكريبت.',
                'content_en' => '<h2>Type Safety in React</h2><p>TypeScript adds type safety to React components, reducing runtime errors and improving developer experience.</p><h2>Advanced Patterns</h2><p>Generic components, discriminated unions, and template literal types unlock powerful patterns.</p>',
                'content_ar' => '<h2>أمان الأنواع في رياكت</h2><p>يضيف تايب سكريبت أمان الأنواع إلى مكونات رياكت، مما يقلل أخطاء وقت التشغيل ويحسن تجربة المطور.</p>',
                'categories' => ['development', 'general'],
                'tags' => ['typescript', 'react'],
            ],
            [
                'title_en' => 'Infrastructure as Code: Getting Started with Terraform',
                'title_ar' => 'البنية التحتية ككود: البدء مع تيرافورم',
                'slug' => 'infrastructure-as-code-getting-started-terraform',
                'excerpt_en' => 'Automate your cloud infrastructure provisioning with Terraform and infrastructure as code principles.',
                'excerpt_ar' => 'قم بأتمتة توفير البنية التحتية السحابية الخاصة بك مع تيرافورم ومبادئ البنية التحتية ككود.',
                'content_en' => '<h2>What is IaC?</h2><p>Infrastructure as Code (IaC) lets you manage and provision cloud resources through configuration files rather than manual processes.</p><h2>Terraform Basics</h2><p>HashiCorp Terraform is a popular IaC tool that works across multiple cloud providers.</p>',
                'content_ar' => '<h2>ما هو IaC؟</h2><p>البنية التحتية ككود تتيح لك إدارة وتوفير موارد السحابة من خلال ملفات التكوين بدلاً من العمليات اليدوية.</p>',
                'categories' => ['automation'],
                'tags' => ['security'],
            ],
        ];

        foreach ($posts as $index => $postData) {
            $categoryNames = $postData['categories'];
            $tagNames = $postData['tags'];
            unset($postData['categories'], $postData['tags']);

            $post = BlogPost::updateOrCreate(
                ['slug' => $postData['slug']],
                array_merge($postData, [
                    'author_id' => $author->id,
                    'status' => 'published',
                    'published_at' => now()->subDays(7 - $index),
                ])
            );

            // Attach categories
            $categoryIds = $categories->whereIn('slug', $categoryNames)->pluck('id')->toArray();

            if (! empty($categoryIds)) {
                $post->categories()->sync($categoryIds);
            }

            // Attach tags
            $tagIds = $tags->whereIn('slug', $tagNames)->pluck('id')->toArray();

            if (! empty($tagIds)) {
                $post->tags()->sync($tagIds);
            }
        }

        $this->command->info('Seeded 7 published blog posts with categories and tags.');
    }

    /**
     * Seed 3 published portfolio items across different service categories.
     */
    private function seedPortfolioItems(): void
    {
        $items = [
            [
                'title_en' => 'E-Commerce Platform Redesign',
                'title_ar' => 'إعادة تصميم منصة التجارة الإلكترونية',
                'slug' => 'ecommerce-platform-redesign',
                'description_en' => 'Complete overhaul of a legacy e-commerce platform, improving performance by 300% and conversion rates by 45%.',
                'description_ar' => 'إصلاح شامل لمنصة تجارة إلكترونية قديمة، مع تحسين الأداء بنسبة 300% ومعدلات التحويل بنسبة 45%.',
                'content_en' => '<h2>The Challenge</h2><p>Our client had a legacy PHP monolith that was struggling to handle growing traffic. Page load times exceeded 8 seconds and conversion rates were declining.</p><h2>Our Approach</h2><p>We migrated to a modern Laravel + React architecture with server-side rendering, implemented caching at multiple levels, and optimized database queries.</p><h2>Results</h2><p>The new platform handles 10x the traffic with sub-second page loads. Customer satisfaction scores increased significantly.</p>',
                'content_ar' => '<h2>التحدي</h2><p>كان لدى عميلنا نظام PHP قديم يعاني من التعامل مع حركة المرور المتزايدة.</p><h2>نهجنا</h2><p>قمنا بالترحيل إلى بنية حديثة باستخدام لارافيل ورياكت مع التقديم من جانب الخادم.</p><h2>النتائج</h2><p>المنصة الجديدة تتعامل مع 10 أضعاف حركة المرور مع تحميل الصفحات في أقل من ثانية.</p>',
                'service_category' => 'development',
                'client_name' => 'TechRetail Co.',
                'results_metrics' => [
                    ['label' => 'Performance Improvement', 'value' => '300%'],
                    ['label' => 'Conversion Rate Increase', 'value' => '45%'],
                    ['label' => 'Page Load Time', 'value' => '0.8s'],
                    ['label' => 'Uptime', 'value' => '99.9%'],
                ],
                'status' => 'published',
                'sort_order' => 1,
            ],
            [
                'title_en' => 'DevOps Pipeline Automation',
                'title_ar' => 'أتمتة خط أنابيب DevOps',
                'slug' => 'devops-pipeline-automation',
                'description_en' => 'End-to-end CI/CD pipeline automation reducing deployment time from hours to minutes.',
                'description_ar' => 'أتمتة خط أنابيب CI/CD من البداية إلى النهاية تقلل وقت النشر من ساعات إلى دقائق.',
                'content_en' => '<h2>The Challenge</h2><p>Manual deployments were taking 4+ hours and frequently causing downtime. The team needed a reliable, automated deployment process.</p><h2>Our Approach</h2><p>We designed a comprehensive CI/CD pipeline using GitHub Actions with automated testing, staging environments, and blue-green deployments.</p><h2>Results</h2><p>Deployment time dropped to under 15 minutes with zero-downtime deployments.</p>',
                'content_ar' => '<h2>التحدي</h2><p>كانت عمليات النشر اليدوية تستغرق أكثر من 4 ساعات وتسبب توقفًا متكررًا.</p><h2>نهجنا</h2><p>صممنا خط أنابيب CI/CD شاملاً باستخدام GitHub Actions.</p><h2>النتائج</h2><p>انخفض وقت النشر إلى أقل من 15 دقيقة مع نشر بدون توقف.</p>',
                'service_category' => 'automation',
                'client_name' => 'FinanceFlow Inc.',
                'results_metrics' => [
                    ['label' => 'Deployment Time Reduction', 'value' => '95%'],
                    ['label' => 'Deployments Per Day', 'value' => '12+'],
                    ['label' => 'Downtime Eliminated', 'value' => '100%'],
                ],
                'status' => 'published',
                'sort_order' => 2,
            ],
            [
                'title_en' => 'Security Audit & Hardening',
                'title_ar' => 'تدقيق وتعزيز الأمان',
                'slug' => 'security-audit-hardening',
                'description_en' => 'Comprehensive security assessment and remediation for a healthcare SaaS platform.',
                'description_ar' => 'تقييم أمني شامل ومعالجة لمنصة SaaS للرعاية الصحية.',
                'content_en' => '<h2>The Challenge</h2><p>A healthcare SaaS platform needed to pass HIPAA compliance requirements and address critical vulnerabilities discovered during a preliminary audit.</p><h2>Our Approach</h2><p>We conducted a comprehensive penetration test, code review, and infrastructure audit. We then implemented a remediation plan addressing all findings.</p><h2>Results</h2><p>All critical and high-severity vulnerabilities were resolved. The platform passed HIPAA compliance certification.</p>',
                'content_ar' => '<h2>التحدي</h2><p>احتاجت منصة SaaS للرعاية الصحية إلى اجتياز متطلبات الامتثال HIPAA.</p><h2>نهجنا</h2><p>أجرينا اختبار اختراق شاملاً ومراجعة للكود وتدقيقًا للبنية التحتية.</p><h2>النتائج</h2><p>تم حل جميع الثغرات الحرجة والعالية الخطورة.</p>',
                'service_category' => 'cybersecurity',
                'client_name' => 'MedSecure Health',
                'results_metrics' => [
                    ['label' => 'Vulnerabilities Fixed', 'value' => '47+'],
                    ['label' => 'Compliance Score', 'value' => '98%'],
                    ['label' => 'Security Incidents', 'value' => '0'],
                ],
                'status' => 'published',
                'sort_order' => 3,
            ],
        ];

        foreach ($items as $item) {
            PortfolioItem::updateOrCreate(
                ['slug' => $item['slug']],
                $item
            );
        }

        $this->command->info('Seeded 3 published portfolio items.');
    }

    /**
     * Seed SEO metadata for the home page.
     */
    private function seedSeoMetadata(): void
    {
        SeoMetadata::updateOrCreate(
            ['page_key' => 'home'],
            [
                'meta_title_en' => 'Quart - Software Development, Automation & Cybersecurity',
                'meta_title_ar' => 'كوارت - تطوير البرمجيات والأتمتة والأمن السيبراني',
                'meta_description_en' => 'Quart delivers professional software development, automation, QA, and cybersecurity services. Transform your business with our expert team.',
                'meta_description_ar' => 'تقدم كوارت خدمات تطوير البرمجيات والأتمتة وضمان الجودة والأمن السيبراني المهنية. حوّل عملك مع فريقنا المتخصص.',
            ]
        );

        $this->command->info('Seeded SEO metadata for home page.');
    }
}
