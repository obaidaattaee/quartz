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
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->string('meta_title_en')->nullable()->after('published_at');
            $table->string('meta_title_ar')->nullable()->after('meta_title_en');
            $table->text('meta_description_en')->nullable()->after('meta_title_ar');
            $table->text('meta_description_ar')->nullable()->after('meta_description_en');
            $table->foreignId('og_image_id')->nullable()->after('meta_description_ar')->constrained('media')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropConstrainedForeignId('og_image_id');
            $table->dropColumn(['meta_title_en', 'meta_title_ar', 'meta_description_en', 'meta_description_ar']);
        });
    }
};
