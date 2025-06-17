<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReceiptMail;

class TransactionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'products' => 'required|array|min:1',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'discount' => 'nullable|numeric|min:0',
            'email' => 'required|email'
        ]);

        $items = [];
        $total = 0;

        foreach ($validated['products'] as $productData) {
            $product = Product::findOrFail($productData['id']);

            if ($product->stock < $productData['quantity']) {
                return response()->json(['error' => "Insufficient stock for {$product->name}"], 400);
            }

            $product->stock -= $productData['quantity'];
            $product->save();

            $items[] = [
                'product_id' => $product->id,
                'quantity' => $productData['quantity'],
                'price' => $product->price,
            ];

            $total += $product->price * $productData['quantity'];
        }

        $discount = $validated['discount'] ?? 0;
        $final = max($total - $discount, 0);

        $transaction = Transaction::create([
            'total_amount' => $total,
            'discount' => $discount,
            'final_amount' => $final,
            'customer_email' => $validated['email'],
        ]);

        foreach ($items as $item) {
            $transaction->items()->create($item);
        }

        $transaction->load('items.product'); // Load relationship for response

        // Email
        Mail::to($validated['email'])->send(new ReceiptMail([
            'items' => $transaction->items->map(fn($i) => [
                'name' => $i->product->name,
                'price' => $i->price,
                'quantity' => $i->quantity,
            ]),
            'total' => $total,
            'discount' => $discount,
            'final' => $final,
        ]));

        return response()->json([
            'message' => 'Transaction complete.',
            'transaction' => [
                'id' => $transaction->id,
                'date' => $transaction->created_at->format('Y-m-d H:i'),
                'items' => $transaction->items->map(fn($i) => [
                    'name' => $i->product->name,
                    'price' => $i->price,
                    'quantity' => $i->quantity,
                ]),
                'discount' => $transaction->discount,
                'total' => $transaction->total_amount,
                'final' => $transaction->final_amount,
            ]
        ]);
    }
}
