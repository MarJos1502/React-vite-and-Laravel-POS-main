<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    // Define the table name if it's not the default 'orders'
    protected $table = 'orders';

    // Define fillable attributes for mass assignment
    protected $fillable = [
        'user_id',
        'total_amount',
        'status',
    ];

    // Define relationships
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
