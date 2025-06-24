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

    public function index()
    {
        return FarewellMessage::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:255',
        ]);
        $msg = FarewellMessage::create([
            'message' => $validated['message'],
            'active' => true,
        ]);
        return FarewellMessage::all();
    }
}
