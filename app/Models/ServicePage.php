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
        'problem_en',
        'problem_ar',
        'approach_en',
        'approach_ar',
        'process_steps_en',
        'process_steps_ar',
        'deliverables_en',
        'deliverables_ar',
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
        ];
    }
}
