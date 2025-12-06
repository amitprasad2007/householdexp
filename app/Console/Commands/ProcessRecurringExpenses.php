<?php

namespace App\Console\Commands;

use App\Models\RecurringRule;
use App\Models\Transaction;
use App\Notifications\ExpenseDueNotification;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ProcessRecurringExpenses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'expenses:process-recurring';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process recurring expenses due today';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today();

        $rules = RecurringRule::whereDate('next_due_date', '<=', $today)->get();

        foreach ($rules as $rule) {
            DB::transaction(function () use ($rule, $today) {
                // Create Transaction
                Transaction::create([
                    'user_id' => $rule->user_id,
                    'account_id' => 1, // Default or logic to pick account
                    'category_id' => 1, // Default or logic to pick category
                    'amount' => $rule->amount,
                    'type' => 'expense',
                    'title' => $rule->title,
                    'date' => $today->toDateString(),
                    'payment_method' => 'Pending',
                    'status' => 'pending', // Created as pending bill
                    'notes' => 'Auto-generated recurring expense',
                    'is_recurring' => true,
                    'recurring_group_id' => $rule->id,
                ]);

                // Update Next Due Date
                // Simple logic: add 30 days for monthly. Ideally store frequency in rule.
                $newDate = Carbon::parse($rule->next_due_date)->addMonth();
                $rule->update(['next_due_date' => $newDate]);

                // Send Notification
                $rule->user->notify(new ExpenseDueNotification($rule->title, $rule->amount));
                
                $this->info("Processed rule: {$rule->title}");
            });
        }

        $this->info('Recurring expenses processed successfully.');
    }
}
