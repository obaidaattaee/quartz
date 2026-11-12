<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LandingServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * The form sends tags as one comma-separated string per language; store
     * them as the JSON arrays the homepage expects.
     */
    protected function prepareForValidation(): void
    {
        foreach (['tags_en', 'tags_ar'] as $field) {
            $value = $this->input($field);

            // Empty input arrives as null (ConvertEmptyStringsToNull).
            if ($value === null || is_string($value)) {
                $this->merge([
                    $field => array_values(array_filter(
                        array_map('trim', preg_split('/[,،]/u', (string) $value) ?: []),
                        fn (string $tag) => $tag !== '',
                    )),
                ]);
            }
        }
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title_en' => ['required', 'string', 'max:255'],
            'title_ar' => ['required', 'string', 'max:255'],
            'body_en' => ['required', 'string', 'max:2000'],
            'body_ar' => ['required', 'string', 'max:2000'],
            'tags_en' => ['present', 'array', 'max:8'],
            'tags_en.*' => ['string', 'max:40'],
            'tags_ar' => ['present', 'array', 'max:8'],
            'tags_ar.*' => ['string', 'max:40'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'title_en' => 'English title',
            'title_ar' => 'Arabic title',
            'body_en' => 'English description',
            'body_ar' => 'Arabic description',
            'tags_en' => 'English tags',
            'tags_ar' => 'Arabic tags',
            'tags_en.*' => 'English tag',
            'tags_ar.*' => 'Arabic tag',
        ];
    }
}
