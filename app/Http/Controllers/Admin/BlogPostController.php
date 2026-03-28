<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBlogPostRequest;
use App\Http\Requests\Admin\UpdateBlogPostRequest;
use App\Models\BlogPost;
use Illuminate\Http\Request;
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
        return Inertia::render('admin/blog/create');
    }

    /**
     * Store a newly created blog post.
     */
    public function store(StoreBlogPostRequest $request)
    {
        $data = $request->validated();
        $data['author_id'] = $request->user()->id;
        $data['published_at'] = $request->status === 'published' ? now() : null;

        BlogPost::create($data);

        return redirect()->route('admin.blog.index')->with('success', 'Blog post created.');
    }

    /**
     * Show the form for editing the specified blog post.
     */
    public function edit(BlogPost $blog): Response
    {
        $blog->load('featuredImage');

        return Inertia::render('admin/blog/edit', [
            'post' => $blog,
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

        $blog->update($data);

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
}
