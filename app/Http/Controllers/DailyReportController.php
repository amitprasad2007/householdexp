<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DailyReportController extends Controller
{
    public function index($date)
    {
        $transactions = Transaction::where('user_id', Auth::id())
            ->whereDate('date', $date)
            ->with(['category', 'account'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Calendar/Day', [
            'date' => $date,
            'transactions' => $transactions,
        ]);
    }
}
