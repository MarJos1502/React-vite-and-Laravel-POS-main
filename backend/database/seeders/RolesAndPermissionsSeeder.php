<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        Permission::firstOrCreate(['name' => 'manage products']);
        Permission::firstOrCreate(['name' => 'view reports']);
        Permission::firstOrCreate(['name' => 'process payments']);
        Permission::firstOrCreate(['name' => 'manage users']);

        // Create roles and assign permissions
        $cashier = Role::firstOrCreate(['name' => 'cashier']);
        $cashier->givePermissionTo(['process payments']);

        $manager = Role::firstOrCreate(['name' => 'manager']);
        $manager->givePermissionTo(['manage products', 'view reports', 'process payments']);

        $admin = Role::firstOrCreate(['name' => 'administrator']);
        $admin->givePermissionTo(Permission::all());

        // Assign roles to users (example)
        $adminUser = User::first(); // Change as needed
        if ($adminUser) {
            $adminUser->assignRole('administrator');
        }
    }
}
