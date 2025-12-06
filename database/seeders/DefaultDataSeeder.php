<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DefaultDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
            ]
        );

        // Accounts
        Account::firstOrCreate(
            ['user_id' => $user->id, 'name' => 'Cash Wallet'],
            ['type' => 'cash', 'balance' => 1000]
        );

        Account::firstOrCreate(
            ['user_id' => $user->id, 'name' => 'HDFC Bank'],
            ['type' => 'bank', 'balance' => 50000]
        );

        // Expense Categories
        $expenseCategories = [
            ['name' => 'Groceries', 'icon' => 'shopping-cart', 'color' => 'blue'],
            ['name' => 'Rent', 'icon' => 'home', 'color' => 'red'],
            ['name' => 'Utilities', 'icon' => 'lightning-bolt', 'color' => 'yellow'],
            ['name' => 'Entertainment', 'icon' => 'film', 'color' => 'purple'],
            ['name' => 'Transport', 'icon' => 'truck', 'color' => 'green'],
        ];

        foreach ($expenseCategories as $cat) {
            Category::firstOrCreate(
                ['user_id' => $user->id, 'name' => $cat['name'], 'type' => 'expense'],
                ['icon' => $cat['icon'], 'color' => $cat['color']]
            );
        }

        // Income Categories
        $incomeCategories = [
            ['name' => 'Salary', 'icon' => 'cash', 'color' => 'green'],
            ['name' => 'Freelance', 'icon' => 'briefcase', 'color' => 'blue'],
        ];

        foreach ($incomeCategories as $cat) {
            Category::firstOrCreate(
                ['user_id' => $user->id, 'name' => $cat['name'], 'type' => 'income'],
                ['icon' => $cat['icon'], 'color' => $cat['color']]
            );
        }
    }
}
