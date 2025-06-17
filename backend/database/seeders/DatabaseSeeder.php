<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create roles if they don't already exist
        $cashierRole = Role::firstOrCreate(['name' => 'cashier']);
        $managerRole = Role::firstOrCreate(['name' => 'manager']);
        $adminRole = Role::firstOrCreate(['name' => 'administrator']);

        // Create a manager user
        $manager = User::firstOrCreate([
            'email' => 'step@pos.com',
        ], [
            'name' => 'Stefan John',
            'password' => bcrypt('Step2024'), // Ensure the password is hashed
        ]);

        // Assign the manager role to the user
        $manager->assignRole($managerRole);

        // Create admin user with same password pattern
        $admin = User::firstOrCreate([
            'email' => 'admin@pos.com',
        ], [
            'name' => 'Admin User',
            'password' => bcrypt('Admin2024'), // Using a consistent pattern
        ]);
        $admin->assignRole($adminRole);

        // Create cashier user with same password pattern
        $cashier = User::firstOrCreate([
            'email' => 'cashier@pos.com',
        ], [
            'name' => 'Cashier User',
            'password' => bcrypt('Cashier2024'), // Using a consistent pattern
        ]);
        $cashier->assignRole($cashierRole);

        // Output a message to confirm seeding
        $this->command->info('Users and roles seeded successfully.');
        $this->command->info('Admin login: admin@pos.com / Admin2024');
        $this->command->info('Cashier login: cashier@pos.com / Cashier2024');
    }
}
