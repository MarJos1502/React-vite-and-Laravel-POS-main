<?php

namespace App\Http\Controllers;

use App\Models\FarewellMessage;
use Illuminate\Http\Request;

class FarewellMessageController extends Controller
{
    public function active()
    {
        return FarewellMessage::where('active', true)->inRandomOrder()->first();
    }
}
