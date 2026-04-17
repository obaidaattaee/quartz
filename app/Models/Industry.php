<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Industry extends Model
{
    protected $fillable = [
        'slug',
        'title_en',
        'title_ar',
        'hero_blurb_en',
        'hero_blurb_ar',
        'challenges_en',
        'challenges_ar',
        'solutions_en',
        'solutions_ar',
        'compliance_note_en',
        'compliance_note_ar',
        'cover_image',
        'sort_order',
        'is_visible',
    ];

    protected function casts(): array
    {
        return [
            'challenges_en' => 'array',
            'challenges_ar' => 'array',
            'solutions_en' => 'array',
            'solutions_ar' => 'array',
            'is_visible' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('is_visible', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
