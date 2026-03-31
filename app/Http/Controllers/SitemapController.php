<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\PortfolioItem;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Generate XML sitemap with all public routes in both languages.
     */
    public function index(): Response
    {
        $staticPages = [
            '' => ['changefreq' => 'weekly', 'priority' => '1.0'],
            '/about' => ['changefreq' => 'monthly', 'priority' => '0.8'],
            '/contact' => ['changefreq' => 'monthly', 'priority' => '0.8'],
            '/faq' => ['changefreq' => 'monthly', 'priority' => '0.7'],
            '/services/development' => ['changefreq' => 'monthly', 'priority' => '0.8'],
            '/services/automation' => ['changefreq' => 'monthly', 'priority' => '0.8'],
            '/services/qa' => ['changefreq' => 'monthly', 'priority' => '0.8'],
            '/services/cybersecurity' => ['changefreq' => 'monthly', 'priority' => '0.8'],
            '/blog' => ['changefreq' => 'daily', 'priority' => '0.9'],
            '/portfolio' => ['changefreq' => 'weekly', 'priority' => '0.9'],
        ];

        $locales = ['en', 'ar'];

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'."\n";
        $xml .= '        xmlns:xhtml="http://www.w3.org/1999/xhtml">'."\n";

        // Static pages in both locales
        foreach ($staticPages as $path => $meta) {
            foreach ($locales as $locale) {
                $altLocale = $locale === 'en' ? 'ar' : 'en';
                $url = url("/{$locale}{$path}");
                $altUrl = url("/{$altLocale}{$path}");

                $xml .= '<url>'."\n";
                $xml .= '  <loc>'.$url.'</loc>'."\n";
                $xml .= '  <changefreq>'.$meta['changefreq'].'</changefreq>'."\n";
                $xml .= '  <priority>'.$meta['priority'].'</priority>'."\n";
                $xml .= '  <xhtml:link rel="alternate" hreflang="'.$locale.'" href="'.$url.'"/>'."\n";
                $xml .= '  <xhtml:link rel="alternate" hreflang="'.$altLocale.'" href="'.$altUrl.'"/>'."\n";
                $xml .= '</url>'."\n";
            }
        }

        // Published blog posts in both locales
        $posts = BlogPost::published()
            ->orderBy('published_at', 'desc')
            ->get();

        foreach ($posts as $post) {
            foreach ($locales as $locale) {
                $altLocale = $locale === 'en' ? 'ar' : 'en';
                $url = url("/{$locale}/blog/{$post->slug}");
                $altUrl = url("/{$altLocale}/blog/{$post->slug}");

                $xml .= '<url>'."\n";
                $xml .= '  <loc>'.$url.'</loc>'."\n";
                $xml .= '  <lastmod>'.$post->updated_at->toW3cString().'</lastmod>'."\n";
                $xml .= '  <changefreq>monthly</changefreq>'."\n";
                $xml .= '  <priority>0.6</priority>'."\n";
                $xml .= '  <xhtml:link rel="alternate" hreflang="'.$locale.'" href="'.$url.'"/>'."\n";
                $xml .= '  <xhtml:link rel="alternate" hreflang="'.$altLocale.'" href="'.$altUrl.'"/>'."\n";
                $xml .= '</url>'."\n";
            }
        }

        // Published portfolio items in both locales
        $portfolioItems = PortfolioItem::published()
            ->orderBy('sort_order')
            ->get();

        foreach ($portfolioItems as $item) {
            foreach ($locales as $locale) {
                $altLocale = $locale === 'en' ? 'ar' : 'en';
                $url = url("/{$locale}/portfolio/{$item->slug}");
                $altUrl = url("/{$altLocale}/portfolio/{$item->slug}");

                $xml .= '<url>'."\n";
                $xml .= '  <loc>'.$url.'</loc>'."\n";
                $xml .= '  <lastmod>'.$item->updated_at->toW3cString().'</lastmod>'."\n";
                $xml .= '  <changefreq>monthly</changefreq>'."\n";
                $xml .= '  <priority>0.6</priority>'."\n";
                $xml .= '  <xhtml:link rel="alternate" hreflang="'.$locale.'" href="'.$url.'"/>'."\n";
                $xml .= '  <xhtml:link rel="alternate" hreflang="'.$altLocale.'" href="'.$altUrl.'"/>'."\n";
                $xml .= '</url>'."\n";
            }
        }

        $xml .= '</urlset>';

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }
}
