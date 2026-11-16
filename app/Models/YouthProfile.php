<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class YouthProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'youth_code',
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'gender',
        'birthdate',
        'civil_status',
        'purok_sitio',
        'barangay',
        'municipality',
        'province',
        'youth_classification',
        'specific_needs_details',
        'educational_attainment',
        'work_status',
        'skills',
        'hobbies',
        'is_registered_sk_voter',
        'is_registered_national_voter',
        'voted_last_sk_election',
        'verification_status',
        'id_type',
        'id_photo_path',
        'verified_by',
        'verified_at',
        'rejection_reason',
        'xp_points',
    ];

    protected $casts = [
        'birthdate' => 'date',
        'specific_needs_details' => 'array',
        'is_registered_sk_voter' => 'boolean',
        'is_registered_national_voter' => 'boolean',
        'voted_last_sk_election' => 'boolean',
        'verified_at' => 'datetime',
        'xp_points' => 'integer',
    ];

    protected $appends = [
        'full_name',
        'age',
        'age_bracket',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function surveyResponses()
    {
        return $this->hasMany(SurveyResponse::class);
    }

    /**
     * Full Name accessor.
     */
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: function () {
                $parts = array_filter([
                    $this->first_name,
                    $this->middle_name ? substr($this->middle_name, 0, 1) . '.' : null,
                    $this->last_name,
                    $this->suffix,
                ]);

                return implode(' ', $parts);
            }
        );
    }

    /**
     * Dynamically computed age.
     */
    protected function age(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->birthdate ? Carbon::parse($this->birthdate)->age : null
        );
    }

    /**
     * NYC Katipunan ng Kabataan official age brackets.
     */
    protected function ageBracket(): Attribute
    {
        return Attribute::make(
            get: function () {
                $age = $this->age;

                if ($age === null) return 'Unknown';
                if ($age >= 15 && $age <= 17) return 'Child Youth (15-17)';
                if ($age >= 18 && $age <= 24) return 'Core Youth (18-24)';
                if ($age >= 25 && $age <= 30) return 'Young Adult (25-30)';

                return 'Out of SK Age Range (' . $age . ')';
            }
        );
    }
}

