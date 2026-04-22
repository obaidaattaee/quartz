<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingClientLogo extends Model
{
    protected $fillable = [
        'label_en',
        'label_ar',
        'sort_order',
    ];

    protected function casts(): array
    {
        return ['sort_order' => 'integer'];
    }
}
