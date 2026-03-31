<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\Category;
use App\Models\Tag;
use App\Models\User;
use App\Services\SeoService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Display the blog listing page with paginated posts.
     */
    public function index(Request $request, string $locale)
    {
        $categories = Category::ordered()->get();

        $posts = BlogPost::published()
            ->with(['author', 'featuredImage', 'categories'])
            ->latest('published_at')
            ->paginate(6);

        // Calculate reading time for each post (BLOG-07)
        $posts->getCollection()->transform(function ($post) {
            $post->reading_time_en = max(1, (int) ceil(str_word_count(strip_tags($post->content_en ?? '')) / 200));
            $post->reading_time_ar = max(1, (int) ceil(str_word_count(strip_tags($post->content_ar ?? '')) / 180));

            return $post;
        });

        $seo = SeoService::forStaticPage('blog', $locale);

        return Inertia::render('public/blog/index', [
            'posts' => $posts,
            'categories' => $categories,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }

    /**
     * Display a single blog post.
     */
    public function show(Request $request, string $locale, string $slug)
    {
        $post = BlogPost::published()
            ->with(['author', 'featuredImage', 'categories', 'tags'])
            ->where('slug', $slug)
            ->firstOrFail();

        // Related posts: same categories first, then tags, then recent
        $relatedPosts = BlogPost::published()
            ->with(['author', 'featuredImage', 'categories'])
            ->where('id', '!=', $post->id)
            ->latest('published_at')
            ->limit(3)
            ->get();

        $seo = SeoService::forBlogPost($post, $locale);

        // Calculate reading time (BLOG-07)
        $post->reading_time_en = max(1, (int) ceil(str_word_count(strip_tags($post->content_en ?? '')) / 200));
        $post->reading_time_ar = max(1, (int) ceil(str_word_count(strip_tags($post->content_ar ?? '')) / 180));

        // Calculate reading time for related posts so BlogCard can render it
        $relatedPosts->transform(function ($relatedPost) {
            $relatedPost->reading_time_en = max(
                1,
                (int) ceil(
                    str_word_count(strip_tags($relatedPost->content_en ?? '')) / 200
                )
            );
            $relatedPost->reading_time_ar = max(
                1,
                (int) ceil(
                    str_word_count(strip_tags($relatedPost->content_ar ?? '')) / 180
                )
            );

            return $relatedPost;
        });

        return Inertia::render('public/blog/show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }

    /**
     * Display posts filtered by category.
     */
    public function category(Request $request, string $locale, string $slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        $categories = Category::ordered()->get();

        $posts = $category->posts()
            ->published()
            ->with(['author', 'featuredImage', 'categories'])
            ->latest('published_at')
            ->paginate(6);

        // Calculate reading time for each post (BLOG-07)
        $posts->getCollection()->transform(function ($post) {
            $post->reading_time_en = max(
                1,
                (int) ceil(str_word_count(strip_tags($post->content_en ?? '')) / 200)
            );
            $post->reading_time_ar = max(
                1,
                (int) ceil(str_word_count(strip_tags($post->content_ar ?? '')) / 180)
            );

            return $post;
        });

        $seo = SeoService::forStaticPage('blog', $locale);

        return Inertia::render('public/blog/category', [
            'posts' => $posts,
            'category' => $category,
            'categories' => $categories,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }

    /**
     * Display posts filtered by tag.
     */
    public function tag(Request $request, string $locale, string $slug)
    {
        $tag = Tag::where('slug', $slug)->firstOrFail();

        $posts = $tag->posts()
            ->published()
            ->with(['author', 'featuredImage', 'categories'])
            ->latest('published_at')
            ->paginate(6);

        // Calculate reading time for each post (BLOG-07)
        $posts->getCollection()->transform(function ($post) {
            $post->reading_time_en = max(
                1,
                (int) ceil(str_word_count(strip_tags($post->content_en ?? '')) / 200)
            );
            $post->reading_time_ar = max(
                1,
                (int) ceil(str_word_count(strip_tags($post->content_ar ?? '')) / 180)
            );

            return $post;
        });

        $seo = SeoService::forStaticPage('blog', $locale);

        return Inertia::render('public/blog/tag', [
            'posts' => $posts,
            'tag' => $tag,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }

    /**
     * Display posts by a specific author.
     */
    public function author(Request $request, string $locale, int $id)
    {
        $author = User::findOrFail($id);

        $posts = BlogPost::published()
            ->where('author_id', $author->id)
            ->with(['author', 'featuredImage', 'categories'])
            ->latest('published_at')
            ->paginate(6);

        // Calculate reading time for each post (BLOG-07)
        $posts->getCollection()->transform(function ($post) {
            $post->reading_time_en = max(
                1,
                (int) ceil(str_word_count(strip_tags($post->content_en ?? '')) / 200)
            );
            $post->reading_time_ar = max(
                1,
                (int) ceil(str_word_count(strip_tags($post->content_ar ?? '')) / 180)
            );

            return $post;
        });

        $seo = SeoService::forStaticPage('blog', $locale);

        return Inertia::render('public/blog/author', [
            'posts' => $posts,
            'author' => $author,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }
}
