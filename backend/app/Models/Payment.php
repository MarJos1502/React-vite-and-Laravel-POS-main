<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order;

class Payment extends Model
{
    use HasFactory;

    // Define the table name if it's not the default 'payments'
    protected $table = 'payments';

    // Define fillable attributes for mass assignment
    protected $fillable = [
        'order_id',
        'amount',
        'payment_method',
        'status',
    ];

    // Define relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
