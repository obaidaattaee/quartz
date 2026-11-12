<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title_en' => ['required', 'string', 'max:255'],
            'title_ar' => ['required', 'string', 'max:255'],
            'subtitle_en' => ['nullable', 'string', 'max:500'],
            'subtitle_ar' => ['nullable', 'string', 'max:500'],
            'tagline_en' => ['nullable', 'string', 'max:255'],
            'tagline_ar' => ['nullable', 'string', 'max:255'],
            'audience_en' => ['nullable', 'string', 'max:1000'],
            'audience_ar' => ['nullable', 'string', 'max:1000'],
            'problem_en' => ['required', 'string'],
            'problem_ar' => ['required', 'string'],
            'approach_en' => ['required', 'string'],
            'approach_ar' => ['required', 'string'],
            'process_steps_en' => ['required', 'array', 'min:1'],
            'process_steps_en.*' => ['array'],
            'process_steps_en.*.title' => ['required', 'string', 'max:255'],
            'process_steps_en.*.description' => ['required', 'string'],
            'process_steps_en.*.duration' => ['nullable', 'string', 'max:60'],
            'process_steps_ar' => ['required', 'array', 'min:1'],
            'process_steps_ar.*' => ['array'],
            'process_steps_ar.*.title' => ['required', 'string', 'max:255'],
            'process_steps_ar.*.description' => ['required', 'string'],
            'process_steps_ar.*.duration' => ['nullable', 'string', 'max:60'],
            'deliverables_en' => ['required', 'array', 'min:1'],
            'deliverables_en.*' => ['required', 'string'],
            'deliverables_ar' => ['required', 'array', 'min:1'],
            'deliverables_ar.*' => ['required', 'string'],
            'cta_text_en' => ['nullable', 'string', 'max:500'],
            'cta_text_ar' => ['nullable', 'string', 'max:500'],
            'tools' => ['nullable', 'array', 'max:20'],
            'tools.*' => ['required', 'string', 'max:40', 'distinct'],
            ...$this->localizedRepeaterRules(),
        ];
    }

    /**
     * Rules for the optional per-language repeaters. Each list may be empty,
     * but every row that is present must carry all of its keys.
     *
     * @return array<string, array<mixed>>
     */
    private function localizedRepeaterRules(): array
    {
        $rules = [];

        foreach (['en', 'ar'] as $locale) {
            $rules += [
                "pains_{$locale}" => ['nullable', 'array', 'max:6'],
                "pains_{$locale}.*" => ['array'],
                "pains_{$locale}.*.problem" => ['required', 'string', 'max:500'],
                "pains_{$locale}.*.solution" => ['required', 'string', 'max:500'],
                "engagements_{$locale}" => ['nullable', 'array', 'max:4'],
                "engagements_{$locale}.*" => ['array'],
                "engagements_{$locale}.*.title" => ['required', 'string', 'max:255'],
                "engagements_{$locale}.*.duration" => ['required', 'string', 'max:60'],
                "engagements_{$locale}.*.description" => ['required', 'string', 'max:1000'],
                "engagements_{$locale}.*.best_for" => ['required', 'string', 'max:255'],
                "faqs_{$locale}" => ['nullable', 'array', 'max:10'],
                "faqs_{$locale}.*" => ['array'],
                "faqs_{$locale}.*.question" => ['required', 'string', 'max:255'],
                "faqs_{$locale}.*.answer" => ['required', 'string', 'max:2000'],
            ];
        }

        return $rules;
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        $attributes = [
            'title_en' => 'English title',
            'title_ar' => 'Arabic title',
            'subtitle_en' => 'English subtitle',
            'subtitle_ar' => 'Arabic subtitle',
            'tagline_en' => 'English tagline',
            'tagline_ar' => 'Arabic tagline',
            'audience_en' => 'English "who it\'s for"',
            'audience_ar' => 'Arabic "who it\'s for"',
            'problem_en' => 'English problem description',
            'problem_ar' => 'Arabic problem description',
            'approach_en' => 'English approach description',
            'approach_ar' => 'Arabic approach description',
            'process_steps_en' => 'English process steps',
            'process_steps_en.*.title' => 'step title (English)',
            'process_steps_en.*.description' => 'step description (English)',
            'process_steps_en.*.duration' => 'step duration (English)',
            'process_steps_ar' => 'Arabic process steps',
            'process_steps_ar.*.title' => 'step title (Arabic)',
            'process_steps_ar.*.description' => 'step description (Arabic)',
            'process_steps_ar.*.duration' => 'step duration (Arabic)',
            'deliverables_en' => 'English deliverables',
            'deliverables_en.*' => 'deliverable (English)',
            'deliverables_ar' => 'Arabic deliverables',
            'deliverables_ar.*' => 'deliverable (Arabic)',
            'cta_text_en' => 'English CTA text',
            'cta_text_ar' => 'Arabic CTA text',
            'tools' => 'tools',
            'tools.*' => 'tool',
        ];

        foreach (['en' => 'English', 'ar' => 'Arabic'] as $locale => $language) {
            $attributes += [
                "pains_{$locale}" => "{$language} problems",
                "pains_{$locale}.*.problem" => "problem ({$language})",
                "pains_{$locale}.*.solution" => "how we fix it ({$language})",
                "engagements_{$locale}" => "{$language} ways to start",
                "engagements_{$locale}.*.title" => "option title ({$language})",
                "engagements_{$locale}.*.duration" => "option duration ({$language})",
                "engagements_{$locale}.*.description" => "option description ({$language})",
                "engagements_{$locale}.*.best_for" => "best for ({$language})",
                "faqs_{$locale}" => "{$language} FAQs",
                "faqs_{$locale}.*.question" => "question ({$language})",
                "faqs_{$locale}.*.answer" => "answer ({$language})",
            ];
        }

        return $attributes;
    }
}
