<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class LegalPage extends Model
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
        'summary_en',
        'summary_ar',
        'effective_date',
        'version',
        'sections_en',
        'sections_ar',
        'is_published',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sections_en' => 'array',
            'sections_ar' => 'array',
            // Serialised as a plain date, not an ISO timestamp: the admin
            // form binds it to <input type="date">, which rejects anything else.
            'effective_date' => 'date:Y-m-d',
            'is_published' => 'boolean',
        ];
    }

    /**
     * Limit the query to pages that are live on the public site.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }
}
