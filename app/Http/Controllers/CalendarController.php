<?php

namespace App\Http\Controllers;

use App\Models\RecurringRule;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CalendarController extends Controller
{
    public function index()
    {
        $events = [];

        // Expenses created
        $transactions = Transaction::where('user_id', Auth::id())->get();

        foreach ($transactions as $transaction) {
            $events[] = [
                'title' => $transaction->title . ' (' . $transaction->amount . ')',
                'start' => $transaction->date,
                'backgroundColor' => $transaction->type == 'income' ? '#10B981' : '#EF4444', // Green for income, Red for expense
                'borderColor' => $transaction->type == 'income' ? '#10B981' : '#EF4444',
                'extendedProps' => [
                    'amount' => $transaction->amount,
                    'type' => $transaction->type,
                ]
            ];
        }

        // Recurring Rules (Next Due)
        $recurringRules = RecurringRule::where('user_id', Auth::id())->get();

        foreach ($recurringRules as $rule) {
            $events[] = [
                'title' => $rule->title . ' (' . $rule->amount . ')',
                'start' => $rule->next_due_date,
                'backgroundColor' => '#3B82F6', // Blue
                'borderColor' => '#3B82F6',
                'extendedProps' => [
                    'amount' => $rule->amount,
                    'type' => 'recurring',
                ]
            ];
        }

        return Inertia::render('Calendar/Index', [
            'events' => $events,
        ]);
    }
}
