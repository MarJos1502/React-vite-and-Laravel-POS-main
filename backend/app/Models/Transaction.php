<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = ['total_amount', 'discount', 'final_amount', 'customer_email'];

    public function items()
    {
        return $this->hasMany(TransactionItem::class);
    }
}
