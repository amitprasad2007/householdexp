<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $expenses = Transaction::where('user_id', Auth::id())
            ->where('type', 'expense')
            ->with(['category', 'account'])
            ->orderBy('date', 'desc')
            ->paginate(10);

        $categories = Category::where('user_id', Auth::id())
            ->where('type', 'expense')
            ->get();

        $accounts = Account::where('user_id', Auth::id())->get();

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
            'categories' => $categories,
            'accounts' => $accounts,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'category_id' => 'required|exists:categories,id',
            'account_id' => 'required|exists:accounts,id',
            'payment_method' => 'required|string|in:UPI,Card,Cash',
            'notes' => 'nullable|string',
            'is_recurring' => 'boolean',
            'status' => 'required|string|in:pending,completed',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['type'] = 'expense';
        // 'status' is already in validated from request

        Transaction::create($validated);

        // Update account balance only if completed
        if ($validated['status'] === 'completed') {
            $account = Account::find($validated['account_id']);
            $account->decrement('balance', $validated['amount']);
        }

        return redirect()->back()->with('success', 'Expense added successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $expense)
    {
        // Ensure user owns the expense
        if ($expense->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'category_id' => 'required|exists:categories,id',
            'account_id' => 'required|exists:accounts,id',
            'payment_method' => 'required|string|in:UPI,Card,Cash',
            'notes' => 'nullable|string',
            'status' => 'required|string|in:pending,completed',
        ]);

        // Revert old balance if it was completed
        if ($expense->status === 'completed') {
            $oldAccount = Account::find($expense->account_id);
            $oldAccount->increment('balance', $expense->amount);
        }

        $expense->update($validated);

        // Apply new balance if it is completed
        if ($validated['status'] === 'completed') {
            $newAccount = Account::find($validated['account_id']);
            $newAccount->decrement('balance', $validated['amount']);
        }

        return redirect()->back()->with('success', 'Expense updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $expense)
    {
        if ($expense->user_id !== Auth::id()) {
            abort(403);
        }

        // Revert balance if completed
        if ($expense->status === 'completed') {
            $account = Account::find($expense->account_id);
            $account->increment('balance', $expense->amount);
        }

        $expense->delete();

        return redirect()->back()->with('success', 'Expense deleted successfully.');
    }
}
