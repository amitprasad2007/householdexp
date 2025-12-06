<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class IncomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $incomes = Transaction::where('user_id', Auth::id())
            ->where('type', 'income')
            ->with(['category', 'account'])
            ->orderBy('date', 'desc')
            ->paginate(10);

        $categories = Category::where('user_id', Auth::id())
            ->where('type', 'income')
            ->get();

        $accounts = Account::where('user_id', Auth::id())->get();

        return Inertia::render('Income/Index', [
            'incomes' => $incomes,
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
        ]);

        $validated['user_id'] = Auth::id();
        $validated['type'] = 'income';
        $validated['status'] = 'completed'; 

        Transaction::create($validated);

        // Update account balance (Increment for Income)
        $account = Account::find($validated['account_id']);
        $account->increment('balance', $validated['amount']);

        return redirect()->back()->with('success', 'Income added successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $income)
    {
        // Ensure user owns the transaction
        if ($income->user_id !== Auth::id()) {
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
        ]);

        // Revert old balance (Decrement what was added)
        $oldAccount = Account::find($income->account_id);
        $oldAccount->decrement('balance', $income->amount);

        $income->update($validated);

        // Apply new balance (Increment the new amount)
        $newAccount = Account::find($validated['account_id']);
        $newAccount->increment('balance', $validated['amount']);

        return redirect()->back()->with('success', 'Income updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $income)
    {
        if ($income->user_id !== Auth::id()) {
            abort(403);
        }

        // Revert balance (Decrement)
        $account = Account::find($income->account_id);
        $account->decrement('balance', $income->amount);

        $income->delete();

        return redirect()->back()->with('success', 'Income deleted successfully.');
    }
}
