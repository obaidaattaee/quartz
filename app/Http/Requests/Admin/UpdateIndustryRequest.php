<?php

namespace App\Http\Requests\Admin;

use App\Http\Controllers\IndustryController;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateIndustryRequest extends FormRequest
{
    /**
     * Route middleware (role:admin) already restricts who reaches this.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'primary_service' => ['nullable', 'string', Rule::in(IndustryController::SERVICES)],
            'cover_image' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:65535'],
            'is_visible' => ['required', 'boolean'],
        ];

        foreach (['en', 'ar'] as $locale) {
            $rules += [
                "title_{$locale}" => ['required', 'string', 'max:255'],
                "tagline_{$locale}" => ['nullable', 'string', 'max:255'],
                "hero_blurb_{$locale}" => ['required', 'string', 'max:1000'],
                "summary_{$locale}" => ['nullable', 'string', 'max:300'],
                "audience_{$locale}" => ['nullable', 'string', 'max:1000'],
                "cta_text_{$locale}" => ['nullable', 'string', 'max:80'],
                "compliance_note_{$locale}" => ['nullable', 'string', 'max:1000'],

                "challenges_{$locale}" => ['present', 'array', 'max:6'],
                "challenges_{$locale}.*" => ['array'],
                "challenges_{$locale}.*.title" => ['required', 'string', 'max:255'],
                "challenges_{$locale}.*.description" => ['required', 'string', 'max:600'],

                "solutions_{$locale}" => ['present', 'array', 'max:6'],
                "solutions_{$locale}.*" => ['array'],
                "solutions_{$locale}.*.title" => ['required', 'string', 'max:255'],
                "solutions_{$locale}.*.description" => ['required', 'string', 'max:600'],
                "solutions_{$locale}.*.service" => ['nullable', 'string', Rule::in(IndustryController::SERVICES)],

                "compliance_items_{$locale}" => ['nullable', 'array', 'max:8'],
                "compliance_items_{$locale}.*" => ['array'],
                "compliance_items_{$locale}.*.name" => ['required', 'string', 'max:120'],
                "compliance_items_{$locale}.*.description" => ['required', 'string', 'max:600'],

                "examples_{$locale}" => ['nullable', 'array', 'max:4'],
                "examples_{$locale}.*" => ['array'],
                "examples_{$locale}.*.title" => ['required', 'string', 'max:255'],
                "examples_{$locale}.*.description" => ['required', 'string', 'max:600'],

                "faqs_{$locale}" => ['nullable', 'array', 'max:10'],
                "faqs_{$locale}.*" => ['array'],
                "faqs_{$locale}.*.question" => ['required', 'string', 'max:255'],
                "faqs_{$locale}.*.answer" => ['required', 'string', 'max:2000'],
            ];
        }

        return $rules;
    }

    /**
     * Drop the "service" key from solution rows that leave it empty, so
     * rows are stored the same way the seeder writes them.
     */
    public function validated($key = null, $default = null): mixed
    {
        $data = parent::validated($key, $default);

        if ($key !== null) {
            return $data;
        }

        foreach (['en', 'ar'] as $locale) {
            foreach (['compliance_items', 'examples', 'faqs'] as $field) {
                $data["{$field}_{$locale}"] = array_values($data["{$field}_{$locale}"] ?? []);
            }

            $data["solutions_{$locale}"] = array_values(array_map(
                fn (array $row) => array_filter(
                    [
                        'title' => $row['title'],
                        'description' => $row['description'],
                        'service' => $row['service'] ?? null,
                    ],
                    fn ($value) => $value !== null && $value !== '',
                ),
                $data["solutions_{$locale}"] ?? [],
            ));
        }

        return $data;
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        $attributes = [
            'primary_service' => 'main service',
            'sort_order' => 'display order',
            'is_visible' => 'visibility',
        ];

        foreach (['en' => 'English', 'ar' => 'Arabic'] as $locale => $language) {
            $attributes += [
                "title_{$locale}" => "{$language} sector name",
                "tagline_{$locale}" => "{$language} headline",
                "hero_blurb_{$locale}" => "{$language} intro paragraph",
                "summary_{$locale}" => "{$language} short summary",
                "audience_{$locale}" => "{$language} \"who it's for\"",
                "cta_text_{$locale}" => "{$language} button text",
                "compliance_note_{$locale}" => "{$language} rules intro",
                "challenges_{$locale}" => "{$language} realities",
                "challenges_{$locale}.*.title" => "reality title ({$language})",
                "challenges_{$locale}.*.description" => "reality description ({$language})",
                "solutions_{$locale}" => "{$language} solutions",
                "solutions_{$locale}.*.title" => "solution title ({$language})",
                "solutions_{$locale}.*.description" => "solution description ({$language})",
                "solutions_{$locale}.*.service" => "solution service ({$language})",
                "compliance_items_{$locale}" => "{$language} rules",
                "compliance_items_{$locale}.*.name" => "rule name ({$language})",
                "compliance_items_{$locale}.*.description" => "what we do ({$language})",
                "examples_{$locale}" => "{$language} examples",
                "examples_{$locale}.*.title" => "example title ({$language})",
                "examples_{$locale}.*.description" => "example description ({$language})",
                "faqs_{$locale}" => "{$language} FAQs",
                "faqs_{$locale}.*.question" => "question ({$language})",
                "faqs_{$locale}.*.answer" => "answer ({$language})",
            ];
        }

        return $attributes;
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        $services = implode(', ', IndustryController::SERVICES);

        return [
            'primary_service.in' => "The main service must be one of: {$services}.",
            'solutions_en.*.service.in' => "The service must be one of: {$services}.",
            'solutions_ar.*.service.in' => "The service must be one of: {$services}.",
        ];
    }
}
