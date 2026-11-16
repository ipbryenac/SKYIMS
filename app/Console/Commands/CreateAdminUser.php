<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'skyims:create-admin {name?} {email?} {password?}';

    /**
     * The console command description.
     */
    protected $description = 'Quickly register an SK Official or Chairperson in SKYIMS';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->argument('name') ?? $this->ask('Full Name', 'SK Chairperson');
        $email = $this->argument('email') ?? $this->ask('Email Address', 'chairperson@skyims.test');
        $password = $this->argument('password') ?? $this->secret('Password (default: password123)');

        if (empty($password)) {
            $password = 'password123';
        }

        $role = $this->choice(
            'Select Council Role',
            ['sk_chairperson', 'sk_official', 'super_admin'],
            0
        );

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make($password),
                'role' => $role,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $this->info("✅ Successfully created/updated Admin user: {$user->email} [{$user->role}]");
    }
}

