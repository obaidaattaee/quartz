<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingProcessStep extends Model
{
    protected $fillable = [
        'n',
        'title_en',
        'title_ar',
        'body_en',
        'body_ar',
        'duration_en',
        'duration_ar',
        'deliverable_en',
        'deliverable_ar',
        'sort_order',
    ];

    protected function casts(): array
    {
        return ['sort_order' => 'integer'];
    }
}
