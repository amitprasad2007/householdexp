<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/calendar', [\App\Http\Controllers\CalendarController::class, 'index'])->name('calendar');
    Route::get('/calendar/day/{date}', [\App\Http\Controllers\DailyReportController::class, 'index'])->name('calendar.day');
    Route::resource('accounts', \App\Http\Controllers\AccountController::class);
    Route::resource('budgets', \App\Http\Controllers\BudgetController::class)->only(['index', 'store']);
    Route::resource('categories', \App\Http\Controllers\CategoryController::class);
    Route::resource('expenses', \App\Http\Controllers\ExpenseController::class);
    Route::resource('income', \App\Http\Controllers\IncomeController::class);
    Route::post('/payment/create-order/{expense}', [\App\Http\Controllers\PaymentController::class, 'createOrder'])->name('payment.create-order');
    Route::post('/payment/verify', [\App\Http\Controllers\PaymentController::class, 'verifyPayment'])->name('payment.verify');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
