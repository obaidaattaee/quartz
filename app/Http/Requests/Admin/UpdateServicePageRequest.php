<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServicePageRequest extends FormRequest
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
            'subtitle_en' => ['nullable', 'string', 'max:500'],
            'subtitle_ar' => ['nullable', 'string', 'max:500'],
            'problem_en' => ['required', 'string'],
            'problem_ar' => ['required', 'string'],
            'approach_en' => ['required', 'string'],
            'approach_ar' => ['required', 'string'],
            'process_steps_en' => ['required', 'array', 'min:1'],
            'process_steps_en.*.title' => ['required', 'string'],
            'process_steps_en.*.description' => ['required', 'string'],
            'process_steps_ar' => ['required', 'array', 'min:1'],
            'process_steps_ar.*.title' => ['required', 'string'],
            'process_steps_ar.*.description' => ['required', 'string'],
            'deliverables_en' => ['required', 'array', 'min:1'],
            'deliverables_en.*' => ['required', 'string'],
            'deliverables_ar' => ['required', 'array', 'min:1'],
            'deliverables_ar.*' => ['required', 'string'],
            'cta_text_en' => ['nullable', 'string', 'max:500'],
            'cta_text_ar' => ['nullable', 'string', 'max:500'],
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
            'subtitle_en' => 'English subtitle',
            'subtitle_ar' => 'Arabic subtitle',
            'problem_en' => 'English problem description',
            'problem_ar' => 'Arabic problem description',
            'approach_en' => 'English approach description',
            'approach_ar' => 'Arabic approach description',
            'process_steps_en' => 'English process steps',
            'process_steps_en.*.title' => 'step title (English)',
            'process_steps_en.*.description' => 'step description (English)',
            'process_steps_ar' => 'Arabic process steps',
            'process_steps_ar.*.title' => 'step title (Arabic)',
            'process_steps_ar.*.description' => 'step description (Arabic)',
            'deliverables_en' => 'English deliverables',
            'deliverables_en.*' => 'deliverable (English)',
            'deliverables_ar' => 'Arabic deliverables',
            'deliverables_ar.*' => 'deliverable (Arabic)',
            'cta_text_en' => 'English CTA text',
            'cta_text_ar' => 'Arabic CTA text',
        ];
    }
}
