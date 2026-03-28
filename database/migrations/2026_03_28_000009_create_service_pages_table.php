<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('service_pages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title_en');
            $table->string('title_ar');
            $table->text('subtitle_en')->nullable();
            $table->text('subtitle_ar')->nullable();
            $table->text('problem_en');
            $table->text('problem_ar');
            $table->text('approach_en');
            $table->text('approach_ar');
            $table->json('process_steps_en');
            $table->json('process_steps_ar');
            $table->json('deliverables_en');
            $table->json('deliverables_ar');
            $table->text('cta_text_en')->nullable();
            $table->text('cta_text_ar')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_pages');
    }
};
