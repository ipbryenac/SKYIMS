<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create or update primary SK Chairperson Admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@skyims.test'],
            [
                'name' => 'SK Chairperson Tibao',
                'password' => Hash::make('password123'),
                'role' => 'sk_chairperson',
                'phone_number' => '09171234567',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // 2. Also promote any first existing user (e.g. Fretchelyn) to SK Official/Admin
        $firstUser = User::where('email', '!=', 'admin@skyims.test')->first();
        if ($firstUser) {
            $firstUser->update([
                'role' => 'sk_chairperson',
            ]);
        }
    }
}

