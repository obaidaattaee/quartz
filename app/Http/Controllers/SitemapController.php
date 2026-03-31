<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\PortfolioItem;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Generate XML sitemap with all public routes.
     */
    public function index(): Response
    {
        $locales = ['en', 'ar'];

        // Static pages
        $staticPages = [
            '' => ['changefreq' => 'weekly', 'priority' => '1.0'],
            '/about' => ['changefreq' => 'monthly', 'priority' => '0.8'],
            '/contact' => ['changefreq' => 'monthly', 'priority' => '0.8'],
            '/faq' => ['changefreq' => 'monthly', 'priority' => '0.7'],
            '/blog' => ['changefreq' => 'daily', 'priority' => '0.9'],
            '/portfolio' => ['changefreq' => 'weekly', 'priority' => '0.8'],
            '/services/development' => ['changefreq' => 'monthly', 'priority' => '0.8'],
            '/services/automation' => ['changefreq' => 'monthly', 'priority' => '0.8'],
            '/services/qa' => ['changefreq' => 'monthly', 'priority' => '0.8'],
            '/services/cybersecurity' => ['changefreq' => 'monthly', 'priority' => '0.8'],
        ];

        $blogPosts = BlogPost::published()->select('slug', 'updated_at')->get();
        $portfolioItems = PortfolioItem::published()->select('slug', 'updated_at')->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';

        $baseUrl = rtrim(config('app.url'), '/');

        // Static pages
        foreach ($staticPages as $path => $meta) {
            foreach ($locales as $locale) {
                $xml .= '<url>';
                $xml .= '<loc>' . $baseUrl . '/' . $locale . $path . '</loc>';
                $xml .= '<changefreq>' . $meta['changefreq'] . '</changefreq>';
                $xml .= '<priority>' . $meta['priority'] . '</priority>';

                foreach ($locales as $altLocale) {
                    $xml .= '<xhtml:link rel="alternate" hreflang="' . $altLocale . '" href="' . $baseUrl . '/' . $altLocale . $path . '" />';
                }

                $xml .= '</url>';
            }
        }

        // Blog posts
        foreach ($blogPosts as $post) {
            foreach ($locales as $locale) {
                $xml .= '<url>';
                $xml .= '<loc>' . $baseUrl . '/' . $locale . '/blog/' . $post->slug . '</loc>';
                $xml .= '<lastmod>' . $post->updated_at->toW3cString() . '</lastmod>';
                $xml .= '<changefreq>weekly</changefreq>';
                $xml .= '<priority>0.7</priority>';

                foreach ($locales as $altLocale) {
                    $xml .= '<xhtml:link rel="alternate" hreflang="' . $altLocale . '" href="' . $baseUrl . '/' . $altLocale . '/blog/' . $post->slug . '" />';
                }

                $xml .= '</url>';
            }
        }

        // Portfolio items
        foreach ($portfolioItems as $item) {
            foreach ($locales as $locale) {
                $xml .= '<url>';
                $xml .= '<loc>' . $baseUrl . '/' . $locale . '/portfolio/' . $item->slug . '</loc>';
                $xml .= '<lastmod>' . $item->updated_at->toW3cString() . '</lastmod>';
                $xml .= '<changefreq>monthly</changefreq>';
                $xml .= '<priority>0.7</priority>';

                foreach ($locales as $altLocale) {
                    $xml .= '<xhtml:link rel="alternate" hreflang="' . $altLocale . '" href="' . $baseUrl . '/' . $altLocale . '/portfolio/' . $item->slug . '" />';
                }

                $xml .= '</url>';
            }
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }
}
