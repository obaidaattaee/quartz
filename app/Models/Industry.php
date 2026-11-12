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
        'tagline_en',
        'tagline_ar',
        'hero_blurb_en',
        'hero_blurb_ar',
        'summary_en',
        'summary_ar',
        'audience_en',
        'audience_ar',
        'primary_service',
        'challenges_en',
        'challenges_ar',
        'solutions_en',
        'solutions_ar',
        'compliance_note_en',
        'compliance_note_ar',
        'compliance_items_en',
        'compliance_items_ar',
        'examples_en',
        'examples_ar',
        'faqs_en',
        'faqs_ar',
        'cta_text_en',
        'cta_text_ar',
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
            'compliance_items_en' => 'array',
            'compliance_items_ar' => 'array',
            'examples_en' => 'array',
            'examples_ar' => 'array',
            'faqs_en' => 'array',
            'faqs_ar' => 'array',
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
