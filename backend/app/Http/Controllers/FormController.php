<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FormController extends Controller
{
    public function submit(Request $request)
    {
        // Validate input including captchaValue
        $request->validate([
            'name' => 'required|string',
            'captchaValue' => 'required|string',
        ]);

        // 🔐 Log the reCAPTCHA secret key only in local environment
        if (app()->isLocal()) {
            Log::info('reCAPTCHA Secret Key:', ['key' => env('RECAPTCHA_SECRET_KEY')]);
        }

        // CAPTCHA verification
        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => env('RECAPTCHA_SECRET_KEY'),
            'response' => $request->input('captchaValue'),
        ]);

        Log::info('reCAPTCHA API Response:', $response->json());

        if (!$response->json('success')) {
            return response()->json(['error' => 'CAPTCHA verification failed'], 400);
        }

        // Continue with your form logic (e.g., save data)
        return response()->json(['message' => 'Form submitted successfully.']);
    }
}
