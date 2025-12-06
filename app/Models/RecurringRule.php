<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecurringRule extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'amount',
        'frequency',
        'next_due_date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
