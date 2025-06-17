<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;

class ReceiptController extends Controller
{
    public function download($id)
    {
        $transaction = Transaction::with('items.product')->findOrFail($id);

        $pdf = Pdf::loadView('pdf.receipt', [
            'transaction' => [
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

        return $pdf->download('receipt-' . $transaction->id . '.pdf');
    }

    public function sendEmail(Request $request)
    {
        // Optional: Already handled in TransactionController
    }
}
