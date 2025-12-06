<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $currentMonth = now()->month;
        $currentYear = now()->year;

        // Total Income
        $totalIncome = Transaction::where('user_id', $userId)
            ->where('type', 'income')
            ->whereMonth('date', $currentMonth)
            ->whereYear('date', $currentYear)
            ->sum('amount');

        // Total Expense
        $totalExpense = Transaction::where('user_id', $userId)
            ->where('type', 'expense')
            ->whereMonth('date', $currentMonth)
            ->whereYear('date', $currentYear)
            ->sum('amount');

        // Balance (Overall)
        // Calculated via account balances or sum of all transactions?
        // Using transactions sum for simplicity of "This Month", but usually Accounts hold the real balance.
        // Let's fetch total current balance from Accounts for "Net Worth" or similar.
        $totalBalance = \App\Models\Account::where('user_id', $userId)->sum('balance');


        // Expense by Category (For Chart)
        $expensesByCategory = Transaction::where('transactions.user_id', $userId)
            ->where('transactions.type', 'expense')
            ->whereMonth('transactions.date', $currentMonth)
            ->whereYear('transactions.date', $currentYear)
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->select('categories.name', DB::raw('sum(transactions.amount) as total'), 'categories.color')
            ->groupBy('categories.name', 'categories.color')
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'income' => $totalIncome,
                'expense' => $totalExpense,
                'balance' => $totalBalance,
            ],
            'chartData' => $expensesByCategory
        ]);
    }
}
