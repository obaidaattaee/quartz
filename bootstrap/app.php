<?php

use App\Http\Controllers\AgentDiscoveryController;
use App\Http\Controllers\SitemapController;
use App\Http\Middleware\AgentLinkHeaders;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\MarkdownForAgents;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware(['web'])->group(base_path('routes/admin.php'));

            // Sitemap — no session, no Inertia, no CSRF (Google needs clean XML)
            Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

            // Agent discovery endpoints (RFC 9727 API catalog, agent-skills
            // index, MCP server card). Universal, no session, no locale.
            Route::get('/.well-known/api-catalog', [AgentDiscoveryController::class, 'apiCatalog'])
                ->name('agent.api-catalog');
            Route::get('/.well-known/agent-skills/index.json', [AgentDiscoveryController::class, 'agentSkillsIndex'])
                ->name('agent.skills-index');
            Route::get('/.well-known/mcp/server-card.json', [AgentDiscoveryController::class, 'mcpServerCard'])
                ->name('agent.mcp-card');
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(
            at: env('TRUSTED_PROXIES', '*'),
            headers: \Illuminate\Http\Request::HEADER_X_FORWARDED_FOR |
                     \Illuminate\Http\Request::HEADER_X_FORWARDED_HOST |
                     \Illuminate\Http\Request::HEADER_X_FORWARDED_PORT |
                     \Illuminate\Http\Request::HEADER_X_FORWARDED_PROTO,
        );

        $middleware->alias([
            'role' => \App\Http\Middleware\EnsureUserHasRole::class,
        ]);

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            // MarkdownForAgents must run *outside* HandleInertiaRequests so
            // (a) it can short-circuit before Inertia spins up when an agent
            //     requests text/markdown, and (b) on the response path it runs
            //     last and can append `Accept` to the Vary header Inertia sets
            //     to `X-Inertia` — otherwise shared caches could serve HTML to
            //     an agent that asked for markdown.
            MarkdownForAgents::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            AgentLinkHeaders::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (NotFoundHttpException $e, $request) {
            // Unmatched URLs never reach SetLocale / HandleInertiaRequests, so
            // resolve the locale from the URL prefix and pass the props the
            // page needs explicitly.
            $locale = in_array($request->segment(1), ['en', 'ar'], true)
                ? $request->segment(1)
                : 'en';
            app()->setLocale($locale);

            $translationsPath = lang_path("{$locale}.json");
            $translations = file_exists($translationsPath)
                ? (json_decode((string) file_get_contents($translationsPath), true) ?? [])
                : [];

            $seo = [
                'title' => __('error.404.title').' | '.config('app.name', 'Quartz'),
                'description' => __('error.404.description'),
                'robots' => 'noindex',
            ];

            return Inertia::render('errors/404', [
                'locale' => $locale,
                'direction' => $locale === 'ar' ? 'rtl' : 'ltr',
                'translations' => $translations,
                'seo' => $seo,
            ])
                ->withViewData(['seo' => $seo])
                ->toResponse($request)
                ->setStatusCode(404);
        });
    })->create();
