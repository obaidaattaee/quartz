<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PortfolioItem extends Model
{
    /**
     * Scope a query to only include published items.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title_en',
        'title_ar',
        'slug',
        'description_en',
        'description_ar',
        'outcome_headline_en',
        'outcome_headline_ar',
        'challenge_en',
        'challenge_ar',
        'approach_en',
        'approach_ar',
        'solution_en',
        'solution_ar',
        'results_en',
        'results_ar',
        'timeline',
        'team_size',
        'services_used',
        'content_en',
        'content_ar',
        'service_category',
        'featured_image_id',
        'client_name',
        'results_metrics',
        'status',
        'sort_order',
        'meta_title_en',
        'meta_title_ar',
        'meta_description_en',
        'meta_description_ar',
        'og_image_id',
        'before_image_id',
        'after_image_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'results_metrics' => 'array',
            'services_used' => 'array',
            'status' => 'string',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Get the featured image for the portfolio item.
     */
    public function featuredImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'featured_image_id');
    }

    /**
     * Get the OG image for the portfolio item.
     */
    public function ogImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'og_image_id');
    }

    /**
     * Get the before image for the portfolio item.
     */
    public function beforeImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'before_image_id');
    }

    /**
     * Get the after image for the portfolio item.
     */
    public function afterImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'after_image_id');
    }

    /**
     * (duplicate scopePublished removed)
     */
}
