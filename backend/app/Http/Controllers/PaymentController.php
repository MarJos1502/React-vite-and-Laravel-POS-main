<?php

namespace App\Http\Controllers;

use App\Mail\ReceiptMail;
use App\Models\Payment;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'amount' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'email' => 'required|email',
        ]);

        // Fetch product
        $product = \App\Models\Product::findOrFail($validated['product_id']);

        // Calculate final amount
        $amount = $validated['amount'];
        $discount = $validated['discount'] ?? 0;
        $finalAmount = max($amount - $discount, 0);

        // Update product stock (assuming 1 item per sale, adjust as needed)
        if ($product->stock <= 0) {
            return response()->json(['error' => 'Product out of stock'], 400);
        }
        $product->stock -= 1;
        $product->save();

        // Save payment
        $payment = \App\Models\Payment::create([
            'product_id' => $product->id,
            'amount' => $amount,
            'discount' => $discount,
            'final_amount' => $finalAmount,
            'customer_email' => $validated['email'],
        ]);

        // Low stock alert
        $lowStockThreshold = 5; // Set your threshold
        if ($product->stock <= $lowStockThreshold) {
            Log::warning("Low stock alert for product: {$product->name} (Stock: {$product->stock})");
            // Optionally, send an email to admin here
        }

        // Prepare receipt data
        $receiptData = [
            'product' => $product->name,
            'amount' => $amount,
            'discount' => $discount,
            'final_amount' => $finalAmount,
        ];

        // Send receipt email
        Mail::to($validated['email'])->send(new \App\Mail\ReceiptMail($receiptData));

        return response()->json([
            'message' => 'Payment recorded and receipt sent.',
            'payment' => $payment,
        ]);
    }
}
