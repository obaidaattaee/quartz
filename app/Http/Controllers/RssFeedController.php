<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Response;

class RssFeedController extends Controller
{
    /**
     * Generate RSS 2.0 feed for the given locale.
     */
    public function show(string $locale): Response
    {
        $posts = BlogPost::published()
            ->with('featuredImage')
            ->orderBy('published_at', 'desc')
            ->take(20)
            ->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">'."\n";
        $xml .= '<channel>'."\n";
        $xml .= '<title>'.e(config('app.name').' Blog').'</title>'."\n";
        $xml .= '<link>'.url("/{$locale}").'</link>'."\n";
        $xml .= '<description>'.e(config('app.name').' - Latest blog posts').'</description>'."\n";
        $xml .= '<language>'.$locale.'</language>'."\n";
        $xml .= '<atom:link href="'.url("/{$locale}/feed.xml").'" rel="self" type="application/rss+xml"/>'."\n";
        $xml .= '<lastBuildDate>'.now()->toRfc2822String().'</lastBuildDate>'."\n";

        foreach ($posts as $post) {
            $title = $locale === 'ar' ? $post->title_ar : $post->title_en;
            $description = $locale === 'ar' ? $post->excerpt_ar : $post->excerpt_en;
            $link = url("/{$locale}/blog/{$post->slug}");

            $xml .= '<item>'."\n";
            $xml .= '<title>'.e($title).'</title>'."\n";
            $xml .= '<link>'.$link.'</link>'."\n";
            $xml .= '<description>'.e($description ?? '').'</description>'."\n";
            $xml .= '<pubDate>'.$post->published_at->toRfc2822String().'</pubDate>'."\n";
            $xml .= '<guid isPermaLink="true">'.$link.'</guid>'."\n";

            if ($post->featuredImage) {
                $xml .= '<enclosure url="'.asset($post->featuredImage->url).'" type="'.($post->featuredImage->mime_type ?? 'image/jpeg').'"/>'."\n";
            }

            $xml .= '</item>'."\n";
        }

        $xml .= '</channel>'."\n";
        $xml .= '</rss>';

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }
}
