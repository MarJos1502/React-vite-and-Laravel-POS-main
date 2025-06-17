<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Product::create([
            'name' => 'Sample Product',
            'description' => 'This is a sample product.',
            'price' => 100.00,
            'sku' => 'PROD001',
        ]);
    }
}
