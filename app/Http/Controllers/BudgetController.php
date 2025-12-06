<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BudgetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::id();
        $currentMonth = now()->month;
        $currentYear = now()->year;

        // Fetch all expense categories
        $categories = Category::where('user_id', $userId)
            ->where('type', 'expense')
            ->get();

        // Fetch existing budgets for current month
        $budgets = Budget::where('user_id', $userId)
            ->where('month', $currentMonth)
            ->where('year', $currentYear)
            ->with('category')
            ->get()
            ->keyBy('category_id');

        // Calculate actual spending per category for current month
        $actuals = Transaction::where('user_id', $userId)
            ->where('type', 'expense')
            ->whereMonth('date', $currentMonth)
            ->whereYear('date', $currentYear)
            ->select('category_id', DB::raw('sum(amount) as total'))
            ->groupBy('category_id')
            ->pluck('total', 'category_id');

        // Combine data for frontend
        $budgetData = $categories->map(function ($category) use ($budgets, $actuals) {
            $budget = $budgets->get($category->id);
            $limit = $budget ? $budget->amount : 0;
            $spent = $actuals->get($category->id) ?? 0;
            
            return [
                'category' => $category,
                'limit' => $limit,
                'spent' => $spent,
                'percentage' => $limit > 0 ? min(round(($spent / $limit) * 100), 100) : ($spent > 0 ? 100 : 0),
                'budget_id' => $budget ? $budget->id : null,
            ];
        });

        return Inertia::render('Budgets/Index', [
            'budgets' => $budgetData,
            'categories' => $categories,
        ]);
    }

    /**
     * Update or Create a budget for a category.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'amount' => 'required|numeric|min:0',
        ]);

        $userId = Auth::id();
        $currentMonth = now()->month;
        $currentYear = now()->year;

        Budget::updateOrCreate(
            [
                'user_id' => $userId,
                'category_id' => $validated['category_id'],
                'month' => $currentMonth,
                'year' => $currentYear,
            ],
            [
                'amount' => $validated['amount'],
            ]
        );

        return redirect()->back()->with('success', 'Budget updated successfully.');
    }
}
