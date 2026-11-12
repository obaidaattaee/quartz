<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Lets unverified marketing content (placeholder case studies, FAQs about
 * products we no longer market, placeholder team members) be hidden
 * without deleting it.
 */
return new class extends Migration
{
    /** @var list<string> */
    private array $tables = ['landing_case_studies', 'landing_faqs', 'team_members'];

    public function up(): void
    {
        foreach ($this->tables as $table) {
            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->boolean('is_visible')->default(true)->after('sort_order');
            });
        }
    }

    public function down(): void
    {
        foreach ($this->tables as $table) {
            Schema::table($table, function (Blueprint $blueprint) {
                $blueprint->dropColumn('is_visible');
            });
        }
    }
};
