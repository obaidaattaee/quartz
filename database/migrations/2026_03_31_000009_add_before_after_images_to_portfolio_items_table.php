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
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->foreignId('before_image_id')->nullable()->after('og_image_id')->constrained('media')->nullOnDelete();
            $table->foreignId('after_image_id')->nullable()->after('before_image_id')->constrained('media')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->dropForeign(['before_image_id']);
            $table->dropForeign(['after_image_id']);
            $table->dropColumn(['before_image_id', 'after_image_id']);
        });
    }
};
