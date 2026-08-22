<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateLegalPageRequest extends FormRequest
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
     * The slug is deliberately absent: the set of legal documents is fixed,
     * so a form post can never repoint an existing document at another URL.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title_en' => ['required', 'string', 'max:255'],
            'title_ar' => ['required', 'string', 'max:255'],
            'summary_en' => ['nullable', 'string', 'max:1000'],
            'summary_ar' => ['nullable', 'string', 'max:1000'],
            'effective_date' => ['required', 'date'],
            'version' => ['required', 'string', 'max:20'],
            'sections_en' => ['required', 'array', 'min:1'],
            'sections_en.*.heading' => ['required', 'string', 'max:255'],
            'sections_en.*.body' => ['required', 'array', 'min:1'],
            'sections_en.*.body.*' => ['required', 'string'],
            'sections_en.*.list' => ['nullable', 'array'],
            'sections_en.*.list.*' => ['required', 'string'],
            'sections_ar' => ['required', 'array', 'min:1'],
            'sections_ar.*.heading' => ['required', 'string', 'max:255'],
            'sections_ar.*.body' => ['required', 'array', 'min:1'],
            'sections_ar.*.body.*' => ['required', 'string'],
            'sections_ar.*.list' => ['nullable', 'array'],
            'sections_ar.*.list.*' => ['required', 'string'],
            'is_published' => ['required', 'boolean'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'title_en' => 'English title',
            'title_ar' => 'Arabic title',
            'summary_en' => 'English summary',
            'summary_ar' => 'Arabic summary',
            'effective_date' => 'effective date',
            'sections_en' => 'English sections',
            'sections_en.*.heading' => 'section heading (English)',
            'sections_en.*.body' => 'section paragraphs (English)',
            'sections_en.*.body.*' => 'paragraph (English)',
            'sections_en.*.list.*' => 'list item (English)',
            'sections_ar' => 'Arabic sections',
            'sections_ar.*.heading' => 'section heading (Arabic)',
            'sections_ar.*.body' => 'section paragraphs (Arabic)',
            'sections_ar.*.body.*' => 'paragraph (Arabic)',
            'sections_ar.*.list.*' => 'list item (Arabic)',
        ];
    }
}
