<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBlogPostRequest;
use App\Http\Requests\Admin\UpdateBlogPostRequest;
use App\Models\BlogPost;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BlogPostController extends Controller
{
    /**
     * Display a listing of blog posts.
     */
    public function index(Request $request): Response
    {
        $posts = BlogPost::with('featuredImage')
            ->when($request->search, fn ($q, $s) => $q->where('title_en', 'like', "%{$s}%")->orWhere('title_ar', 'like', "%{$s}%"))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/blog/index', [
            'posts' => $posts,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    /**
     * Show the form for creating a new blog post.
     */
    public function create(): Response
    {
        return Inertia::render('admin/blog/create', [
            'allCategories' => Category::orderBy('sort_order')->get(),
            'allTags' => Tag::all(),
        ]);
    }

    /**
     * Store a newly created blog post.
     */
    public function store(StoreBlogPostRequest $request)
    {
        $data = $request->validated();
        $data['author_id'] = $request->user()->id;
        $data['published_at'] = $request->status === 'published' ? now() : null;

        // Remove non-model fields before creating
        $categoryIds = $data['category_ids'] ?? [];
        $tagNames = $data['tags'] ?? [];
        unset($data['category_ids'], $data['tags']);

        $post = BlogPost::create($data);

        if (! empty($categoryIds)) {
            $post->categories()->sync($categoryIds);
        }

        if (! empty($tagNames)) {
            $this->syncTags($post, $tagNames);
        }

        return redirect()->route('admin.blog.index')->with('success', 'Blog post created.');
    }

    /**
     * Show the form for editing the specified blog post.
     */
    public function edit(BlogPost $blog): Response
    {
        $blog->load(['featuredImage', 'ogImage', 'categories', 'tags']);

        return Inertia::render('admin/blog/edit', [
            'post' => $blog,
            'allCategories' => Category::orderBy('sort_order')->get(),
            'allTags' => Tag::all(),
        ]);
    }

    /**
     * Update the specified blog post.
     */
    public function update(UpdateBlogPostRequest $request, BlogPost $blog)
    {
        $data = $request->validated();

        // Set published_at on first publish, keep existing if already set
        if ($data['status'] === 'published' && ! $blog->published_at) {
            $data['published_at'] = now();
        } elseif ($data['status'] === 'draft') {
            $data['published_at'] = null;
        }

        // Remove non-model fields before updating
        $categoryIds = $data['category_ids'] ?? [];
        $tagNames = $data['tags'] ?? [];
        unset($data['category_ids'], $data['tags']);

        $blog->update($data);

        $blog->categories()->sync($categoryIds);
        $this->syncTags($blog, $tagNames);

        return redirect()->route('admin.blog.index')->with('success', 'Blog post updated.');
    }

    /**
     * Remove the specified blog post.
     */
    public function destroy(BlogPost $blog)
    {
        $blog->delete();

        return redirect()->route('admin.blog.index')->with('success', 'Blog post deleted.');
    }

    /**
     * Sync tags by name -- find existing or create new tags.
     *
     * @param  array<string>  $tagNames
     */
    private function syncTags(BlogPost $post, array $tagNames): void
    {
        $tagIds = [];

        foreach ($tagNames as $name) {
            $name = trim($name);

            if (empty($name)) {
                continue;
            }

            $tag = Tag::firstOrCreate(
                ['name_en' => $name],
                [
                    'name_ar' => $name,
                    'slug' => Str::slug($name),
                ]
            );

            $tagIds[] = $tag->id;
        }

        $post->tags()->sync($tagIds);
    }
}
