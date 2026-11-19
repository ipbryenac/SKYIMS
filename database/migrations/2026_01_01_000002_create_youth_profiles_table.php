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
        Schema::create('youth_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // System Unique Identification for QR Attendance & Digital Pass
            $table->string('youth_code', 30)->unique();

            // Personal Demographics
            $table->string('first_name', 100);
            $table->string('middle_name', 100)->nullable();
            $table->string('last_name', 100);
            $table->string('suffix', 10)->nullable();
            $table->enum('gender', ['Male', 'Female', 'Prefer not to say']);
            $table->date('birthdate');
            $table->enum('civil_status', ['Single', 'Married', 'Widowed', 'Separated', 'Live-in'])->default('Single');

            // Barangay Tibao Local Address
            $table->string('purok_sitio', 100)->comment('e.g., Purok 1, Purok 2, Sitio Crossing');
            $table->string('barangay')->default('Tibao');
            $table->string('municipality')->default('Mlang');
            $table->string('province')->default('Cotabato');

            // NYC Katipunan ng Kabataan Sectoral Classifications
            $table->enum('youth_classification', [
                'In-School Youth',
                'Out-of-School Youth',
                'Working Youth',
                'Youth with Specific Needs',
            ])->default('In-School Youth');

            $table->json('specific_needs_details')->nullable();

            // Educational & Employment Background
            $table->enum('educational_attainment', [
                'Elementary Level',
                'Elementary Graduate',
                'High School Level',
                'High School Graduate',
                'Senior High Level',
                'Senior High Graduate',
                'Vocational Course',
                'College Level',
                'College Graduate',
                'Post-Graduate Level',
            ]);

            $table->enum('work_status', [
                'Employed',
                'Unemployed',
                'Self-Employed',
                'Looking for Job',
                'Not Applicable',
            ])->default('Not Applicable');

            // Electoral Participation
            $table->boolean('is_registered_sk_voter')->default(false);
            $table->boolean('is_registered_national_voter')->default(false);
            $table->boolean('voted_last_sk_election')->default(false);

            // Verification Pipeline
            $table->enum('verification_status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->string('id_type')->nullable()->comment('Student ID, Barangay Clearance, PhilSys, etc.');
            $table->string('id_photo_path')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->text('rejection_reason')->nullable();

            // Gamification Points
            $table->unsignedInteger('xp_points')->default(0);

            $table->timestamps();

            // Indexes for fast dashboard filtering
            $table->index('purok_sitio');
            $table->index('youth_classification');
            $table->index('verification_status');
            $table->index('birthdate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('youth_profiles');
    }
};
