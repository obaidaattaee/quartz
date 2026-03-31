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
        Schema::table('users', function (Blueprint $table) {
            $table->text('bio_en')->nullable()->after('role');
            $table->text('bio_ar')->nullable()->after('bio_en');
            $table->foreignId('avatar_media_id')->nullable()->after('bio_ar')->constrained('media')->nullOnDelete();
            $table->json('social_links')->nullable()->after('avatar_media_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['avatar_media_id']);
            $table->dropColumn([
                'bio_en',
                'bio_ar',
                'avatar_media_id',
                'social_links',
            ]);
        });
    }
};
