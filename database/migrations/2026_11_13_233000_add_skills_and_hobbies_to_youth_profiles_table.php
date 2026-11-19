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
        Schema::table('youth_profiles', function (Blueprint $table) {
            $table->text('skills')->nullable()->after('work_status')->comment('Youth skills and proficiencies');
            $table->text('hobbies')->nullable()->after('skills')->comment('Hobbies, sports, and creative interests');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('youth_profiles', function (Blueprint $table) {
            $table->dropColumn(['skills', 'hobbies']);
        });
    }
};
