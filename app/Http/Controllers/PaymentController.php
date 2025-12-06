<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Razorpay\Api\Api;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    private $api;

    public function __construct()
    {
        $this->api = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
    }

    public function createOrder(Transaction $expense)
    {
        if ($expense->user_id !== Auth::id()) {
            abort(403);
        }

        if ($expense->status === 'completed') {
            return response()->json(['message' => 'Expense already paid.'], 400);
        }

        $orderData = [
            'receipt'         => (string) $expense->id,
            'amount'          => $expense->amount * 100, // Amount in paise
            'currency'        => 'INR',
            'payment_capture' => 1
        ];

        $razorpayOrder = $this->api->order->create($orderData);

        return response()->json([
            'order_id' => $razorpayOrder['id'],
            'key' => env('RAZORPAY_KEY_ID'),
            'amount' => $orderData['amount'],
            'name' => 'Expense Tracker',
            'description' => 'Payment for ' . $expense->title,
            'prefill' => [
                'name' => Auth::user()->name,
                'email' => Auth::user()->email,
            ],
            'notes' => [
                'merchant_order_id' => (string) $expense->id,
            ],
            'theme' => [
                'color' => '#3399cc'
            ]
        ]);
    }

    public function verifyPayment(Request $request)
    {
        $success = true;
        $error = "Payment Failed";

        try {
            $attributes = [
                'razorpay_order_id' => $request->razorpay_order_id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature
            ];

            $this->api->utility->verifyPaymentSignature($attributes);
        } catch (\Exception $e) {
            $success = false;
            $error = 'Razorpay Error : ' . $e->getMessage();
        }

        if ($success) {
            $expenseId = $request->expense_id;
            $expense = Transaction::find($expenseId);

            if ($expense && $expense->user_id === Auth::id()) {
                $expense->update([
                    'status' => 'completed',
                    'payment_method' => 'Online', // Update logic as needed
                    'notes' => $expense->notes . "\nPaid via Razorpay: " . $request->razorpay_payment_id
                ]);

                // Deduct balance
                $account = Account::find($expense->account_id);
                if($account) {
                    $account->decrement('balance', $expense->amount);
                }
            }

            return redirect()->back()->with('success', 'Payment successful!');
        } else {
            return redirect()->back()->with('error', $error);
        }
    }
}
