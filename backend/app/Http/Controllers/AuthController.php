<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller
{
    // User registration
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:administrator,manager,cashier',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole($validated['role']);

        return response()->json([
            'message' => 'Registration successful.',
            'user' => $user,
        ]);
    }

    // User login
    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required', 'string'],
                'recaptcha_token' => ['required', 'string'],
            ]);

            // CAPTCHA verification
            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => env('RECAPTCHA_SECRET_KEY'),
                'response' => $credentials['recaptcha_token'],
            ]);

            Log::info('reCAPTCHA response', $response->json());

            if (!$response->json('success')) {
                return response()->json(['message' => 'CAPTCHA verification failed'], 400);
            }

            // Remove recaptcha_token from credentials before attempting auth
            unset($credentials['recaptcha_token']);

            if (Auth::attempt($credentials)) {
                $user = Auth::user();
                $token = $user->createToken('auth-token')->plainTextToken;

                // Get the user's first role
                $role = $user->getRoleNames()->first();

                // Include the role in the user object
                $userData = $user->toArray();
                $userData['role'] = $role;

                return response()->json([
                    'token' => $token,
                    'user' => $userData,
                    'message' => 'Login successful'
                ]);
            }

            return response()->json(['message' => 'Invalid credentials'], 401);

        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return response()->json(['message' => 'An error occurred during login: ' . $e->getMessage()], 500);
        }
    }

    // User logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
