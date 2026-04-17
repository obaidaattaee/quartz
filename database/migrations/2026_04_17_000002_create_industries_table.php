<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('industries', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title_en');
            $table->string('title_ar');
            $table->text('hero_blurb_en');
            $table->text('hero_blurb_ar');
            $table->json('challenges_en');       // [{ title, description }, ...]
            $table->json('challenges_ar');
            $table->json('solutions_en');        // [{ title, description }, ...]
            $table->json('solutions_ar');
            $table->text('compliance_note_en')->nullable();
            $table->text('compliance_note_ar')->nullable();
            $table->string('cover_image')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->timestamps();

            $table->index(['is_visible', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('industries');
    }
};
