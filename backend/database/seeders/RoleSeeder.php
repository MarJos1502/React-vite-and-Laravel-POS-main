<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::firstOrCreate(['name' => 'cashier']);
        Role::firstOrCreate(['name' => 'manager']);
        Role::firstOrCreate(['name' => 'administrator']);

        $admin = User::first(); // Or find a specific user
        if ($admin) {
            $admin->assignRole('administrator');
        }
    }
}
