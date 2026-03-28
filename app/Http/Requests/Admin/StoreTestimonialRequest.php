<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTestimonialRequest extends FormRequest
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
            'quote_en' => ['required', 'string'],
            'quote_ar' => ['required', 'string'],
            'author_name_en' => ['required', 'string', 'max:255'],
            'author_name_ar' => ['required', 'string', 'max:255'],
            'author_title_en' => ['nullable', 'string', 'max:255'],
            'author_title_ar' => ['nullable', 'string', 'max:255'],
            'company_en' => ['nullable', 'string', 'max:255'],
            'company_ar' => ['nullable', 'string', 'max:255'],
            'photo_id' => ['nullable', 'integer', 'exists:media,id'],
            'is_visible' => ['boolean'],
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
            'quote_en' => 'English quote',
            'quote_ar' => 'Arabic quote',
            'author_name_en' => 'English author name',
            'author_name_ar' => 'Arabic author name',
            'author_title_en' => 'English author title',
            'author_title_ar' => 'Arabic author title',
            'company_en' => 'English company',
            'company_ar' => 'Arabic company',
        ];
    }
}
