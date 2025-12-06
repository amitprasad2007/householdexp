<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $accounts = Account::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Accounts/Index', [
            'accounts' => $accounts,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:Bank,Cash,Mobile Wallet,Credit Card',
            'balance' => 'required|numeric',
        ]);

        $validated['user_id'] = Auth::id();

        Account::create($validated);

        return redirect()->back()->with('success', 'Account created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Account $account)
    {
        if ($account->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:Bank,Cash,Mobile Wallet,Credit Card',
            'balance' => 'required|numeric',
        ]);

        $account->update($validated);

        return redirect()->back()->with('success', 'Account updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account)
    {
        if ($account->user_id !== Auth::id()) {
            abort(403);
        }

        // Optional: Check if account has transactions before deleting?
        // For now, allow delete (might cascade or leave orphaned transactions, ideally check)
        
        $account->delete();

        return redirect()->back()->with('success', 'Account deleted successfully.');
    }
}
