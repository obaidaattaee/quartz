<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingService extends Model
{
    protected $fillable = [
        'code',
        'title_en',
        'title_ar',
        'body_en',
        'body_ar',
        'tags_en',
        'tags_ar',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'tags_en' => 'array',
            'tags_ar' => 'array',
            'sort_order' => 'integer',
        ];
    }
}
