<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\Category;
use App\Models\Tag;
use App\Models\User;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    /**
     * Display the blog listing page with paginated posts and category filters.
     */
    public function index(string $locale): Response
    {
        $posts = BlogPost::published()
            ->with(['author', 'author.avatar', 'featuredImage', 'categories'])
            ->latest('published_at')
            ->paginate(6)
            ->withQueryString();

        $posts->getCollection()->transform(fn (BlogPost $post) => $this->addReadingTime($post));

        $categories = Category::ordered()->get();
        $seo = SeoService::forStaticPage('blog', $locale, 'Blog', "/{$locale}/blog");

        return Inertia::render('public/blog/index', [
            'posts' => $posts,
            'categories' => $categories,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }

    /**
     * Display a single blog post with related posts.
     */
    public function show(string $locale, string $slug): Response
    {
        $post = BlogPost::published()
            ->with(['author', 'author.avatar', 'featuredImage', 'ogImage', 'categories', 'tags'])
            ->where('slug', $slug)
            ->firstOrFail();

        $this->addReadingTime($post);

        $relatedPosts = $this->getRelatedPosts($post);
        $seo = SeoService::forBlogPost($post, $locale);

        return Inertia::render('public/blog/show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }

    /**
     * Display posts filtered by category.
     */
    public function category(string $locale, string $slug): Response
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        $posts = BlogPost::published()
            ->with(['author', 'author.avatar', 'featuredImage', 'categories'])
            ->whereHas('categories', fn ($q) => $q->where('categories.id', $category->id))
            ->latest('published_at')
            ->paginate(6)
            ->withQueryString();

        $posts->getCollection()->transform(fn (BlogPost $post) => $this->addReadingTime($post));

        $categories = Category::ordered()->get();
        $categoryName = $locale === 'ar' ? $category->name_ar : $category->name_en;
        $seo = SeoService::forStaticPage('blog', $locale, $categoryName, "/{$locale}/blog/category/{$slug}");

        return Inertia::render('public/blog/category', [
            'posts' => $posts,
            'categories' => $categories,
            'category' => $category,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }

    /**
     * Display posts filtered by tag.
     */
    public function tag(string $locale, string $slug): Response
    {
        $tag = Tag::where('slug', $slug)->firstOrFail();

        $posts = BlogPost::published()
            ->with(['author', 'author.avatar', 'featuredImage', 'categories'])
            ->whereHas('tags', fn ($q) => $q->where('tags.id', $tag->id))
            ->latest('published_at')
            ->paginate(6)
            ->withQueryString();

        $posts->getCollection()->transform(fn (BlogPost $post) => $this->addReadingTime($post));

        $tagName = $locale === 'ar' ? $tag->name_ar : $tag->name_en;
        $seo = SeoService::forStaticPage('blog', $locale, $tagName, "/{$locale}/blog/tag/{$slug}");

        return Inertia::render('public/blog/tag', [
            'posts' => $posts,
            'tag' => $tag,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }

    /**
     * Display posts filtered by author.
     */
    public function author(string $locale, int $id): Response
    {
        $author = User::with('avatar')->findOrFail($id);

        $posts = BlogPost::published()
            ->with(['author', 'author.avatar', 'featuredImage', 'categories'])
            ->where('author_id', $id)
            ->latest('published_at')
            ->paginate(6)
            ->withQueryString();

        $posts->getCollection()->transform(fn (BlogPost $post) => $this->addReadingTime($post));

        $seo = SeoService::forStaticPage('blog', $locale, $author->name, "/{$locale}/blog/author/{$id}");

        return Inertia::render('public/blog/author', [
            'posts' => $posts,
            'author' => $author,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }

    /**
     * Calculate and add reading time attributes to a blog post.
     */
    private function addReadingTime(BlogPost $post): BlogPost
    {
        $post->reading_time_en = max(1, (int) ceil(str_word_count(strip_tags($post->content_en ?? '')) / 200));
        $post->reading_time_ar = max(1, (int) ceil(str_word_count(strip_tags($post->content_ar ?? '')) / 180));

        return $post;
    }

    /**
     * Get related posts for a blog post.
     *
     * Selection logic (per D-09):
     * 1. Posts sharing same categories (excluding current)
     * 2. If fewer than 3, fill with posts sharing tags
     * 3. If still fewer than 3, fill with most recent posts
     */
    private function getRelatedPosts(BlogPost $post): array
    {
        $limit = 3;
        $excludeIds = [$post->id];
        $related = collect();

        // Step 1: Posts in same categories
        $categoryIds = $post->categories->pluck('id')->toArray();

        if (! empty($categoryIds)) {
            $byCat = BlogPost::published()
                ->with(['author', 'author.avatar', 'featuredImage', 'categories'])
                ->whereHas('categories', fn ($q) => $q->whereIn('categories.id', $categoryIds))
                ->whereNotIn('id', $excludeIds)
                ->latest('published_at')
                ->limit($limit)
                ->get();

            $related = $related->merge($byCat);
            $excludeIds = array_merge($excludeIds, $byCat->pluck('id')->toArray());
        }

        // Step 2: Posts sharing tags (if still need more)
        if ($related->count() < $limit) {
            $tagIds = $post->tags->pluck('id')->toArray();

            if (! empty($tagIds)) {
                $remaining = $limit - $related->count();
                $byTag = BlogPost::published()
                    ->with(['author', 'author.avatar', 'featuredImage', 'categories'])
                    ->whereHas('tags', fn ($q) => $q->whereIn('tags.id', $tagIds))
                    ->whereNotIn('id', $excludeIds)
                    ->latest('published_at')
                    ->limit($remaining)
                    ->get();

                $related = $related->merge($byTag);
                $excludeIds = array_merge($excludeIds, $byTag->pluck('id')->toArray());
            }
        }

        // Step 3: Fill with most recent posts
        if ($related->count() < $limit) {
            $remaining = $limit - $related->count();
            $recent = BlogPost::published()
                ->with(['author', 'author.avatar', 'featuredImage', 'categories'])
                ->whereNotIn('id', $excludeIds)
                ->latest('published_at')
                ->limit($remaining)
                ->get();

            $related = $related->merge($recent);
        }

        // Add reading time to all related posts
        $related->each(fn (BlogPost $p) => $this->addReadingTime($p));

        return $related->values()->toArray();
    }
}
