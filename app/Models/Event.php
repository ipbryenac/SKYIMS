<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'category',
        'venue',
        'start_datetime',
        'end_datetime',
        'registration_deadline',
        'capacity',
        'points_reward',
        'status',
        'banner_image_path',
        'created_by',
    ];

    protected $casts = [
        'start_datetime' => 'datetime',
        'end_datetime' => 'datetime',
        'registration_deadline' => 'datetime',
        'capacity' => 'integer',
        'points_reward' => 'integer',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(EventAttendance::class);
    }

    /**
     * Automatically synchronize event statuses based on current time:
     * - Events whose end_datetime has passed are marked as 'completed'.
     * - Published events currently within start and end time are marked as 'ongoing'.
     */
    public static function syncStatuses(): void
    {
        $now = now();

        // 1. Mark finished events as completed (unless manually cancelled)
        static::where('end_datetime', '<', $now)
            ->whereNotIn('status', ['completed', 'cancelled'])
            ->update(['status' => 'completed']);

        // 2. Mark ongoing events currently in progress
        static::where('start_datetime', '<=', $now)
            ->where('end_datetime', '>=', $now)
            ->where('status', 'published')
            ->update(['status' => 'ongoing']);
    }
}
