<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Structured, admin-editable content for the service detail pages:
     * a hero promise, who the service is for, pain/solution pairs,
     * engagement options, tools and a service-specific FAQ. Process steps
     * keep living in process_steps_* and gain an optional "duration" key.
     */
    public function up(): void
    {
        Schema::table('service_pages', function (Blueprint $table) {
            $table->string('tagline_en')->nullable()->after('subtitle_ar');
            $table->string('tagline_ar')->nullable()->after('tagline_en');
            $table->text('audience_en')->nullable()->after('tagline_ar');
            $table->text('audience_ar')->nullable()->after('audience_en');
            $table->json('pains_en')->nullable()->after('problem_ar');
            $table->json('pains_ar')->nullable()->after('pains_en');
            $table->json('engagements_en')->nullable()->after('deliverables_ar');
            $table->json('engagements_ar')->nullable()->after('engagements_en');
            $table->json('tools')->nullable()->after('engagements_ar');
            $table->json('faqs_en')->nullable()->after('tools');
            $table->json('faqs_ar')->nullable()->after('faqs_en');
        });
    }

    public function down(): void
    {
        Schema::table('service_pages', function (Blueprint $table) {
            $table->dropColumn([
                'tagline_en',
                'tagline_ar',
                'audience_en',
                'audience_ar',
                'pains_en',
                'pains_ar',
                'engagements_en',
                'engagements_ar',
                'tools',
                'faqs_en',
                'faqs_ar',
            ]);
        });
    }
};
