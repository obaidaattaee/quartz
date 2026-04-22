<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingCaseStudy extends Model
{
    protected $fillable = [
        'tag_en',
        'tag_ar',
        'client_en',
        'client_ar',
        'headline_en',
        'headline_ar',
        'metric',
        'metric_label_en',
        'metric_label_ar',
        'portfolio_slug',
        'sort_order',
    ];

    protected function casts(): array
    {
        return ['sort_order' => 'integer'];
    }
}
