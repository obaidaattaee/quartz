<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMediaRequest;
use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MediaController extends Controller
{
    /**
     * Display a listing of media items.
     */
    public function index(Request $request)
    {
        $media = Media::query()
            ->when($request->search, fn ($q, $s) => $q->where('filename', 'like', "%{$s}%"))
            ->latest()
            ->paginate(24)
            ->withQueryString();

        if ($request->wantsJson()) {
            return response()->json($media);
        }

        return Inertia::render('admin/media/index', [
            'media' => $media,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Store a newly uploaded media file.
     */
    public function store(StoreMediaRequest $request)
    {
        $mediaService = new MediaService();
        $media = $mediaService->store($request->file('file'));

        if ($request->wantsJson()) {
            return response()->json($media, 201);
        }

        return redirect()->route('admin.media.index')->with('success', 'File uploaded.');
    }

    /**
     * Remove the specified media item.
     */
    public function destroy(Request $request, Media $media)
    {
        // Delete original file
        Storage::disk('public')->delete($media->path);

        // Delete thumbnails if they exist
        if ($media->thumbnail_sm) {
            Storage::disk('public')->delete($media->thumbnail_sm);
        }

        if ($media->thumbnail_md) {
            Storage::disk('public')->delete($media->thumbnail_md);
        }

        $media->delete();

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect()->route('admin.media.index')->with('success', 'File deleted.');
    }
}
