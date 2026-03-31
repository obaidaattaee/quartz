<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Response;

class RssFeedController extends Controller
{
    /**
     * Generate RSS 2.0 feed for blog posts.
     */
    public function __invoke(string $locale): Response
    {
        $posts = BlogPost::published()
            ->with(['author', 'categories'])
            ->latest('published_at')
            ->limit(20)
            ->get();

        $baseUrl = rtrim(config('app.url'), '/');
        $siteName = config('app.name', 'Quart');
        $titleField = 'title_' . $locale;
        $excerptField = 'excerpt_' . $locale;

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">';
        $xml .= '<channel>';
        $xml .= '<title>' . htmlspecialchars($siteName . ' Blog') . '</title>';
        $xml .= '<link>' . $baseUrl . '/' . $locale . '/blog</link>';
        $xml .= '<description>' . htmlspecialchars($siteName . ' - Latest articles and insights') . '</description>';
        $xml .= '<language>' . $locale . '</language>';
        $xml .= '<atom:link href="' . $baseUrl . '/' . $locale . '/feed.xml" rel="self" type="application/rss+xml" />';

        foreach ($posts as $post) {
            $xml .= '<item>';
            $xml .= '<title>' . htmlspecialchars($post->$titleField ?? $post->title_en) . '</title>';
            $xml .= '<link>' . $baseUrl . '/' . $locale . '/blog/' . $post->slug . '</link>';
            $xml .= '<description>' . htmlspecialchars($post->$excerptField ?? $post->excerpt_en ?? '') . '</description>';
            $xml .= '<guid isPermaLink="true">' . $baseUrl . '/' . $locale . '/blog/' . $post->slug . '</guid>';

            if ($post->published_at) {
                $xml .= '<pubDate>' . $post->published_at->toRfc2822String() . '</pubDate>';
            }

            if ($post->author) {
                $xml .= '<author>' . htmlspecialchars($post->author->email . ' (' . $post->author->name . ')') . '</author>';
            }

            foreach ($post->categories as $category) {
                $catField = 'name_' . $locale;
                $xml .= '<category>' . htmlspecialchars($category->$catField ?? $category->name_en) . '</category>';
            }

            $xml .= '</item>';
        }

        $xml .= '</channel>';
        $xml .= '</rss>';

        return response($xml, 200, [
            'Content-Type' => 'application/rss+xml; charset=utf-8',
        ]);
    }
}
