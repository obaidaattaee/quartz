<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('landing_services', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('title_en');
            $table->string('title_ar');
            $table->text('body_en');
            $table->text('body_ar');
            $table->json('tags_en');
            $table->json('tags_ar');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('landing_products', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('kind_en');
            $table->string('kind_ar');
            $table->text('pitch_en');
            $table->text('pitch_ar');
            $table->string('url');
            $table->json('stats_en');
            $table->json('stats_ar');
            $table->string('demo_kind')->default('bo');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('landing_process_steps', function (Blueprint $table) {
            $table->id();
            $table->string('n');
            $table->string('title_en');
            $table->string('title_ar');
            $table->text('body_en');
            $table->text('body_ar');
            $table->string('duration_en');
            $table->string('duration_ar');
            $table->string('deliverable_en');
            $table->string('deliverable_ar');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('landing_case_studies', function (Blueprint $table) {
            $table->id();
            $table->string('tag_en');
            $table->string('tag_ar');
            $table->string('client_en');
            $table->string('client_ar');
            $table->text('headline_en');
            $table->text('headline_ar');
            $table->string('metric');
            $table->string('metric_label_en');
            $table->string('metric_label_ar');
            $table->string('portfolio_slug')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('landing_faqs', function (Blueprint $table) {
            $table->id();
            $table->text('question_en');
            $table->text('question_ar');
            $table->text('answer_en');
            $table->text('answer_ar');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('landing_client_logos', function (Blueprint $table) {
            $table->id();
            $table->string('label_en');
            $table->string('label_ar');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('landing_client_logos');
        Schema::dropIfExists('landing_faqs');
        Schema::dropIfExists('landing_case_studies');
        Schema::dropIfExists('landing_process_steps');
        Schema::dropIfExists('landing_products');
        Schema::dropIfExists('landing_services');
    }
};
