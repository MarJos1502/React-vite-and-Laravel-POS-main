<?php

namespace App\Http\Controllers;

use App\Mail\LowStockAlertMail;
use Illuminate\Support\Facades\Mail;

abstract class Controller
{
    // Example method to send low stock alert
    protected function sendLowStockAlert($product)
    {
        Mail::to('staff@example.com')->send(new LowStockAlertMail($product));
    }
}
