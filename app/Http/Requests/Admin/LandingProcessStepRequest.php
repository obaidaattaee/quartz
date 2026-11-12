<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LandingProcessStepRequest extends FormRequest
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
            'n' => ['required', 'string', 'max:10'],
            'title_en' => ['required', 'string', 'max:255'],
            'title_ar' => ['required', 'string', 'max:255'],
            'body_en' => ['required', 'string', 'max:2000'],
            'body_ar' => ['required', 'string', 'max:2000'],
            'duration_en' => ['required', 'string', 'max:255'],
            'duration_ar' => ['required', 'string', 'max:255'],
            'deliverable_en' => ['required', 'string', 'max:255'],
            'deliverable_ar' => ['required', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'n' => 'step number',
            'title_en' => 'English title',
            'title_ar' => 'Arabic title',
            'body_en' => 'English description',
            'body_ar' => 'Arabic description',
            'duration_en' => 'English duration',
            'duration_ar' => 'Arabic duration',
            'deliverable_en' => 'English deliverable',
            'deliverable_ar' => 'Arabic deliverable',
        ];
    }
}
