<?php

namespace App\Http\Middleware;

use App\Models\BlogPost;
use App\Models\PortfolioItem;
use App\Models\ServicePage;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response as IlluminateResponse;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\Response;

/**
 * Content-negotiate text/markdown. When an agent sends
 * `Accept: text/markdown` on a route we have a markdown rendering for,
 * short-circuit the Inertia response and return a clean markdown body.
 *
 * Implements the "Markdown for Agents" pattern; HTML stays the default
 * for browsers (q=0 / Accept: text/html is unchanged).
 */
class MarkdownForAgents
{
    public function handle(Request $request, Closure $next): Response
    {
        $wantsMarkdown = $this->wantsMarkdown($request);
        $hasMarkdownRendering = $this->routeHasMarkdownRendering($request);

        if ($wantsMarkdown && $hasMarkdownRendering) {
            $body = $this->renderMarkdown($request);

            if ($body !== null) {
                return new IlluminateResponse($body, 200, [
                    'Content-Type' => 'text/markdown; charset=utf-8',
                    'Vary' => 'Accept',
                    'X-Markdown-Tokens' => (string) str_word_count(strip_tags($body)),
                ]);
            }
        }

        $response = $next($request);

        // Even when serving HTML, advertise that the response varies by
        // Accept on routes that *could* serve markdown — otherwise a shared
        // cache might hand the HTML to an agent that asked for markdown.
        if ($hasMarkdownRendering) {
            $existing = $response->headers->get('Vary');
            $merged = $existing ? $existing.', Accept' : 'Accept';

            if (! str_contains((string) $existing, 'Accept')) {
                $response->headers->set('Vary', $merged);
            }
        }

        return $response;
    }

    private function routeHasMarkdownRendering(Request $request): bool
    {
        $route = $request->route();

        if ($route === null) {
            return false;
        }

        return in_array($route->getName(), [
            'home', 'home.root',
            'services.show',
            'blog.show', 'blog.posts.show',
            'portfolio.show',
        ], true);
    }

    private function wantsMarkdown(Request $request): bool
    {
        $accept = $request->headers->get('Accept', '');

        // Treat both `text/markdown` and `text/x-markdown` as a request for MD.
        return str_contains($accept, 'text/markdown') || str_contains($accept, 'text/x-markdown');
    }

    private function renderMarkdown(Request $request): ?string
    {
        $route = $request->route();

        if ($route === null) {
            return null;
        }

        $name = $route->getName();
        $locale = $route->parameter('locale', 'en');
        $slug = $route->parameter('slug');

        return match ($name) {
            'home', 'home.root' => $this->homepageMarkdown(),
            'services.show' => $slug ? $this->serviceMarkdown($slug, $locale) : null,
            'blog.show', 'blog.posts.show' => $slug ? $this->blogMarkdown($slug, $locale) : null,
            'portfolio.show' => $slug ? $this->portfolioMarkdown($slug, $locale) : null,
            default => null,
        };
    }

    private function homepageMarkdown(): ?string
    {
        $path = public_path('llms.txt');

        return File::exists($path) ? File::get($path) : null;
    }

    private function serviceMarkdown(string $slug, string $locale): ?string
    {
        if (! class_exists(ServicePage::class)) {
            return null;
        }

        $service = ServicePage::where('slug', $slug)->first();

        if ($service === null) {
            return null;
        }

        $title = $locale === 'ar' ? ($service->title_ar ?? $service->title_en) : $service->title_en;
        $body = $locale === 'ar'
            ? ($service->content_ar ?? $service->content_en ?? '')
            : ($service->content_en ?? '');

        return "# {$title}\n\n".$this->htmlToMarkdown((string) $body)."\n";
    }

    private function blogMarkdown(string $slug, string $locale): ?string
    {
        if (! class_exists(BlogPost::class)) {
            return null;
        }

        $post = BlogPost::where('slug', $slug)->first();

        if ($post === null) {
            return null;
        }

        $title = $locale === 'ar' ? ($post->title_ar ?? $post->title_en) : $post->title_en;
        $body = $locale === 'ar'
            ? ($post->content_ar ?? $post->content_en ?? '')
            : ($post->content_en ?? '');

        return "# {$title}\n\n".$this->htmlToMarkdown((string) $body)."\n";
    }

    private function portfolioMarkdown(string $slug, string $locale): ?string
    {
        $item = PortfolioItem::where('slug', $slug)->first();

        if ($item === null) {
            return null;
        }

        $title = $locale === 'ar' ? ($item->title_ar ?? $item->title_en) : $item->title_en;
        $description = $locale === 'ar'
            ? ($item->description_ar ?? $item->description_en ?? '')
            : ($item->description_en ?? '');
        $body = $locale === 'ar'
            ? ($item->content_ar ?? $item->content_en ?? '')
            : ($item->content_en ?? '');

        return "# {$title}\n\n> {$description}\n\n".$this->htmlToMarkdown((string) $body)."\n";
    }

    /**
     * Tiny HTML→Markdown converter for the limited tag set used in our
     * model content fields (h2/h3/p/ul/li/strong/em/a/code). Anything we
     * don't recognise is passed through as plain text (tags stripped).
     */
    private function htmlToMarkdown(string $html): string
    {
        if ($html === '') {
            return '';
        }

        $patterns = [
            '#<h2[^>]*>(.*?)</h2>#is' => "\n## $1\n",
            '#<h3[^>]*>(.*?)</h3>#is' => "\n### $1\n",
            '#<h4[^>]*>(.*?)</h4>#is' => "\n#### $1\n",
            '#<p[^>]*>(.*?)</p>#is' => "\n$1\n",
            '#<li[^>]*>(.*?)</li>#is' => "- $1\n",
            '#<ul[^>]*>(.*?)</ul>#is' => "\n$1\n",
            '#<strong[^>]*>(.*?)</strong>#is' => '**$1**',
            '#<b[^>]*>(.*?)</b>#is' => '**$1**',
            '#<em[^>]*>(.*?)</em>#is' => '*$1*',
            '#<i[^>]*>(.*?)</i>#is' => '*$1*',
            '#<code[^>]*>(.*?)</code>#is' => '`$1`',
            '#<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>#is' => '[$2]($1)',
            '#<br\s*/?>#i' => "\n",
        ];

        $md = preg_replace(array_keys($patterns), array_values($patterns), $html) ?? $html;
        $md = strip_tags($md);
        $md = html_entity_decode($md, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // Collapse runs of 3+ blank lines, trim trailing whitespace on each line.
        $md = preg_replace("/\n{3,}/", "\n\n", $md);
        $md = preg_replace("/[ \t]+\n/", "\n", $md);

        return trim((string) $md);
    }
}
