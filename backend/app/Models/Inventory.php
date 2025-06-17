<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    // Define the table name if it's not the default 'inventories'
    protected $table = 'inventories';

    // Define fillable attributes for mass assignment
    protected $fillable = [
        'product_id',
        'quantity',
        'location',
    ];

    // Define relationships
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
