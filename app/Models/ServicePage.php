<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicePage extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'slug',
        'title_en',
        'title_ar',
        'subtitle_en',
        'subtitle_ar',
        'tagline_en',
        'tagline_ar',
        'audience_en',
        'audience_ar',
        'problem_en',
        'problem_ar',
        'pains_en',
        'pains_ar',
        'approach_en',
        'approach_ar',
        'process_steps_en',
        'process_steps_ar',
        'deliverables_en',
        'deliverables_ar',
        'engagements_en',
        'engagements_ar',
        'tools',
        'faqs_en',
        'faqs_ar',
        'cta_text_en',
        'cta_text_ar',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'process_steps_en' => 'array',
            'process_steps_ar' => 'array',
            'deliverables_en' => 'array',
            'deliverables_ar' => 'array',
            'pains_en' => 'array',
            'pains_ar' => 'array',
            'engagements_en' => 'array',
            'engagements_ar' => 'array',
            'tools' => 'array',
            'faqs_en' => 'array',
            'faqs_ar' => 'array',
        ];
    }
}
