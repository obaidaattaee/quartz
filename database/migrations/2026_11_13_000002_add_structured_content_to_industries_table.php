<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Structured, admin-editable content for the redesigned industry pages:
     * a hero promise, who the page is for, a short index summary, the main
     * service the contact link preselects, the rules we build for, labelled
     * illustrative example systems, a sector FAQ and an optional button
     * label. Sector pains keep living in challenges_*, and solutions_* gain
     * an optional "service" key linking each card to a service page.
     */
    public function up(): void
    {
        Schema::table('industries', function (Blueprint $table) {
            $table->string('tagline_en')->nullable()->after('title_ar');
            $table->string('tagline_ar')->nullable()->after('tagline_en');
            $table->text('summary_en')->nullable()->after('hero_blurb_ar');
            $table->text('summary_ar')->nullable()->after('summary_en');
            $table->text('audience_en')->nullable()->after('summary_ar');
            $table->text('audience_ar')->nullable()->after('audience_en');
            $table->string('primary_service', 40)->nullable()->after('audience_ar');
            $table->json('compliance_items_en')->nullable()->after('compliance_note_ar');
            $table->json('compliance_items_ar')->nullable()->after('compliance_items_en');
            $table->json('examples_en')->nullable()->after('compliance_items_ar');
            $table->json('examples_ar')->nullable()->after('examples_en');
            $table->json('faqs_en')->nullable()->after('examples_ar');
            $table->json('faqs_ar')->nullable()->after('faqs_en');
            $table->string('cta_text_en')->nullable()->after('faqs_ar');
            $table->string('cta_text_ar')->nullable()->after('cta_text_en');
        });
    }

    public function down(): void
    {
        Schema::table('industries', function (Blueprint $table) {
            $table->dropColumn([
                'tagline_en',
                'tagline_ar',
                'summary_en',
                'summary_ar',
                'audience_en',
                'audience_ar',
                'primary_service',
                'compliance_items_en',
                'compliance_items_ar',
                'examples_en',
                'examples_ar',
                'faqs_en',
                'faqs_ar',
                'cta_text_en',
                'cta_text_ar',
            ]);
        });
    }
};
