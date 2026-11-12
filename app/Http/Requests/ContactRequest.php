<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'service' => ['required', 'string', 'in:development,automation,qa,cybersecurity,general'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            '_honeypot' => ['present', 'max:0'],
        ];
    }

    /** Field-specific copy shared with client-side validation. */
    public function messages(): array
    {
        return [
            'name.required' => __('contact.validation.name'),
            'name.string' => __('contact.validation.name'),
            'name.max' => __('contact.validation.nameMax'),
            'email.required' => __('contact.validation.emailRequired'),
            'email.email' => __('contact.validation.email'),
            'email.max' => __('contact.validation.emailMax'),
            'phone.string' => __('contact.validation.phoneMax'),
            'phone.max' => __('contact.validation.phoneMax'),
            'service.required' => __('contact.validation.service'),
            'service.in' => __('contact.validation.service'),
            'service.string' => __('contact.validation.service'),
            'message.required' => __('contact.validation.message'),
            'message.string' => __('contact.validation.message'),
            'message.min' => __('contact.validation.message'),
            'message.max' => __('contact.validation.messageMax'),
        ];
    }
}
