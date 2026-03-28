<?php

namespace App\Services;

use App\Models\Media;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class MediaService
{
    /**
     * Store an uploaded file and generate thumbnails.
     */
    public function store(UploadedFile $file): Media
    {
        $year = date('Y');
        $month = date('m');
        $directory = "media/{$year}/{$month}";
        $thumbDirectory = "{$directory}/thumbs";

        // Store original file
        $path = $file->store($directory, 'public');
        $filename = basename($path);

        // Get image dimensions if applicable
        $width = null;
        $height = null;
        $thumbnailSm = null;
        $thumbnailMd = null;

        if (str_starts_with($file->getMimeType(), 'image/')) {
            $image = Image::read($file);
            $width = $image->width();
            $height = $image->height();

            // Ensure thumb directory exists
            Storage::disk('public')->makeDirectory($thumbDirectory);

            // Generate small thumbnail (150x150)
            $smFilename = "sm_{$filename}";
            $smImage = Image::read($file)->cover(150, 150);
            Storage::disk('public')->put(
                "{$thumbDirectory}/{$smFilename}",
                $smImage->encodeByExtension(pathinfo($filename, PATHINFO_EXTENSION)),
            );
            $thumbnailSm = "{$thumbDirectory}/{$smFilename}";

            // Generate medium thumbnail (400x300)
            $mdFilename = "md_{$filename}";
            $mdImage = Image::read($file)->cover(400, 300);
            Storage::disk('public')->put(
                "{$thumbDirectory}/{$mdFilename}",
                $mdImage->encodeByExtension(pathinfo($filename, PATHINFO_EXTENSION)),
            );
            $thumbnailMd = "{$thumbDirectory}/{$mdFilename}";
        }

        return Media::create([
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'width' => $width,
            'height' => $height,
            'thumbnail_sm' => $thumbnailSm,
            'thumbnail_md' => $thumbnailMd,
        ]);
    }
}
