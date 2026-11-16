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
        // 1. Registrations (Intent to join an activity)
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // Unique QR token for the event pass
            $table->uuid('ticket_token')->unique();

            $table->enum('status', ['registered', 'attended', 'cancelled', 'no_show'])
                  ->default('registered');

            $table->timestamps();

            $table->unique(['event_id', 'user_id']);
        });

        // 2. Attendance Logging (Recorded via on-site QR scanner)
        Schema::create('event_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // SK Official who verified the attendance
            $table->foreignId('scanned_by')->constrained('users')->cascadeOnDelete();
            $table->timestamp('scanned_at');

            $table->enum('check_in_method', ['QR_SCAN', 'MANUAL_ENTRY'])->default('QR_SCAN');
            $table->string('remarks')->nullable();

            $table->timestamps();

            $table->unique(['event_id', 'user_id']);
            $table->index(['event_id', 'scanned_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_attendances');
        Schema::dropIfExists('event_registrations');
    }
};

