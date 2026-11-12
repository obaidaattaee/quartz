<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LandingCaseStudyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tag_en' => ['required', 'string', 'max:255'],
            'tag_ar' => ['required', 'string', 'max:255'],
            'client_en' => ['required', 'string', 'max:255'],
            'client_ar' => ['required', 'string', 'max:255'],
            'headline_en' => ['required', 'string', 'max:1000'],
            'headline_ar' => ['required', 'string', 'max:1000'],
            'metric' => ['required', 'string', 'max:255'],
            'metric_label_en' => ['required', 'string', 'max:255'],
            'metric_label_ar' => ['required', 'string', 'max:255'],
            'portfolio_slug' => ['nullable', 'string', 'max:255', 'exists:portfolio_items,slug'],
            'is_visible' => ['boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'portfolio_slug.exists' => 'No portfolio project uses this slug. Leave it empty or copy the slug from the portfolio list.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'tag_en' => 'English tag',
            'tag_ar' => 'Arabic tag',
            'client_en' => 'English client',
            'client_ar' => 'Arabic client',
            'headline_en' => 'English headline',
            'headline_ar' => 'Arabic headline',
            'metric' => 'metric',
            'metric_label_en' => 'English metric label',
            'metric_label_ar' => 'Arabic metric label',
            'portfolio_slug' => 'portfolio slug',
        ];
    }
}
