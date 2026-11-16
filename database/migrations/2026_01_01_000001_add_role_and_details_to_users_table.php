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
            $table->enum('role', ['super_admin', 'sk_chairperson', 'sk_official', 'youth_member'])
                  ->default('youth_member')
                  ->after('email');
            $table->string('phone_number', 15)->nullable()->unique()->after('role');
            $table->boolean('is_active')->default(true)->after('phone_number');
            $table->softDeletes()->after('updated_at');

            $table->index(['role', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role', 'is_active']);
            $table->dropSoftDeletes();
            $table->dropColumn(['role', 'phone_number', 'is_active']);
        });
    }
};

