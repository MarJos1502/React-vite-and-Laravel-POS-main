<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FarewellMessage extends Model
{
    protected $fillable = [
        'message',
        'active',
    ];
}
