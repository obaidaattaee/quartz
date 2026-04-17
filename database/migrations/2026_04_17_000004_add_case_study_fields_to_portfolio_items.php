<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Add structured case-study fields to portfolio_items so the detail page can
 * render a Challenge → Approach → Solution → Results layout with a sticky
 * sidebar of project metadata.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->text('outcome_headline_en')->nullable()->after('description_ar');
            $table->text('outcome_headline_ar')->nullable()->after('outcome_headline_en');
            $table->text('challenge_en')->nullable()->after('outcome_headline_ar');
            $table->text('challenge_ar')->nullable()->after('challenge_en');
            $table->text('approach_en')->nullable()->after('challenge_ar');
            $table->text('approach_ar')->nullable()->after('approach_en');
            $table->text('solution_en')->nullable()->after('approach_ar');
            $table->text('solution_ar')->nullable()->after('solution_en');
            $table->text('results_en')->nullable()->after('solution_ar');
            $table->text('results_ar')->nullable()->after('results_en');
            $table->string('timeline')->nullable()->after('results_ar');
            $table->string('team_size')->nullable()->after('timeline');
            $table->json('services_used')->nullable()->after('team_size');
        });
    }

    public function down(): void
    {
        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->dropColumn([
                'outcome_headline_en',
                'outcome_headline_ar',
                'challenge_en',
                'challenge_ar',
                'approach_en',
                'approach_ar',
                'solution_en',
                'solution_ar',
                'results_en',
                'results_ar',
                'timeline',
                'team_size',
                'services_used',
            ]);
        });
    }
};
