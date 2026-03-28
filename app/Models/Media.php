<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'filename',
        'path',
        'mime_type',
        'size',
        'width',
        'height',
        'thumbnail_sm',
        'thumbnail_md',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'url',
        'thumbnail_sm_url',
        'thumbnail_md_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'size' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
        ];
    }

    /**
     * Get the full URL for the media file.
     */
    protected function url(): Attribute
    {
        return Attribute::make(
            get: fn () => '/storage/' . $this->path,
        );
    }

    /**
     * Get the small thumbnail URL.
     */
    protected function thumbnailSmUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->thumbnail_sm ? '/storage/' . $this->thumbnail_sm : null,
        );
    }

    /**
     * Get the medium thumbnail URL.
     */
    protected function thumbnailMdUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->thumbnail_md ? '/storage/' . $this->thumbnail_md : null,
        );
    }
}
