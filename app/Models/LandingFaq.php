<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingFaq extends Model
{
    protected $fillable = [
        'question_en',
        'question_ar',
        'answer_en',
        'answer_ar',
        'sort_order',
        'is_visible',
    ];

    protected function casts(): array
    {
        return ['sort_order' => 'integer', 'is_visible' => 'boolean'];
    }
}
