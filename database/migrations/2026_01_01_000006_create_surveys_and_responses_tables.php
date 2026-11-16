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
        Schema::create('surveys', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('year')->default(2026);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('xp_reward')->default(25);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('survey_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_id')->constrained('surveys')->cascadeOnDelete();
            $table->text('question_text');
            $table->enum('question_type', ['single_choice', 'multiple_choice', 'text'])->default('single_choice');
            $table->string('category')->default('General');
            $table->json('options')->nullable();
            $table->unsignedInteger('order')->default(1);
            $table->timestamps();
        });

        Schema::create('survey_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_id')->constrained('surveys')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('youth_profile_id')->nullable()->constrained('youth_profiles')->cascadeOnDelete();
            $table->json('answers');
            $table->string('primary_interest')->default('Sports');
            $table->string('purok_sitio')->default('Purok 1');
            $table->string('youth_classification')->default('In-School Youth');
            $table->string('age_bracket')->default('Core Youth (18-24)');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();

            $table->unique(['survey_id', 'user_id']);
            $table->index('primary_interest');
            $table->index('purok_sitio');
            $table->index('youth_classification');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('survey_responses');
        Schema::dropIfExists('survey_questions');
        Schema::dropIfExists('surveys');
    }
};

