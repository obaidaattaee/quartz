<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePortfolioItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title_en' => ['required', 'string', 'max:255'],
            'title_ar' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('portfolio_items', 'slug')->ignore($this->route('portfolio'))],
            'description_en' => ['required', 'string'],
            'description_ar' => ['required', 'string'],
            'content_en' => ['nullable', 'string'],
            'content_ar' => ['nullable', 'string'],
            'service_category' => ['required', 'in:development,automation,qa,cybersecurity'],
            'featured_image_id' => ['nullable', 'integer', 'exists:media,id'],
            'client_name' => ['nullable', 'string', 'max:255'],
            'results_metrics' => ['nullable', 'array'],
            'results_metrics.*.label' => ['required_with:results_metrics', 'string'],
            'results_metrics.*.value' => ['required_with:results_metrics', 'string'],
            'status' => ['required', 'in:draft,published'],
            'before_image_id' => ['nullable', 'integer', 'exists:media,id'],
            'after_image_id' => ['nullable', 'integer', 'exists:media,id'],
            'meta_title_en' => ['nullable', 'string', 'max:70'],
            'meta_title_ar' => ['nullable', 'string', 'max:70'],
            'meta_description_en' => ['nullable', 'string', 'max:160'],
            'meta_description_ar' => ['nullable', 'string', 'max:160'],
            'og_image_id' => ['nullable', 'integer', 'exists:media,id'],
        ];
    }

    /**
     * Get custom attribute names for error messages.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'title_en' => 'Title (English)',
            'title_ar' => 'Title (Arabic)',
            'description_en' => 'Description (English)',
            'description_ar' => 'Description (Arabic)',
            'content_en' => 'Content (English)',
            'content_ar' => 'Content (Arabic)',
            'service_category' => 'Service Category',
        ];
    }
}
