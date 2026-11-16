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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');

            // CBYDP 9 Centers of Youth Participation
            $table->enum('category', [
                'Governance & Leadership',
                'Active Citizenship',
                'Education',
                'Health & Mental Health',
                'Economic Empowerment & Livelihood',
                'Social Inclusion & Gender Equality',
                'Peace-building & Security',
                'Environment & Climate Action',
                'Global Mobility & Sports/Culture'
            ])->default('Global Mobility & Sports/Culture');

            $table->string('venue')->default('Barangay Tibao Multi-Purpose Gym');
            $table->dateTime('start_datetime');
            $table->dateTime('end_datetime');
            $table->dateTime('registration_deadline')->nullable();

            $table->unsignedInteger('capacity')->nullable()->comment('Null means unlimited');
            $table->unsignedInteger('points_reward')->default(50)->comment('Gamification XP for attendance');

            $table->enum('status', ['draft', 'published', 'ongoing', 'completed', 'cancelled'])
                  ->default('draft');

            $table->string('banner_image_path')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'start_datetime']);
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};

