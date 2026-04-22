<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingProduct extends Model
{
    protected $fillable = [
        'code',
        'name',
        'kind_en',
        'kind_ar',
        'pitch_en',
        'pitch_ar',
        'url',
        'stats_en',
        'stats_ar',
        'demo_kind',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'stats_en' => 'array',
            'stats_ar' => 'array',
            'sort_order' => 'integer',
        ];
    }
}
