<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Define the table name if it's not the default 'products'
    protected $table = 'products';

    // Define fillable attributes for mass assignment
    protected $fillable = [
        'name',
        'description',
        'price',
        'sku',
        'stock',
        'image',
    ];

    // Define relationships
    public function inventory()
    {
        return $this->hasOne(Inventory::class);
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class)->withPivot('quantity');
    }
}
