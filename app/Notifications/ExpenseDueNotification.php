<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ExpenseDueNotification extends Notification
{
    use Queueable;

    public $expenseTitle;
    public $amount;

    /**
     * Create a new notification instance.
     */
    public function __construct($expenseTitle, $amount)
    {
        $this->expenseTitle = $expenseTitle;
        $this->amount = $amount;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Expense Due: ' . $this->expenseTitle)
                    ->line('This is a reminder that a recurring expense is due.')
                    ->line('Expense: ' . $this->expenseTitle)
                    ->line('Amount: ' . $this->amount)
                    ->action('View Dashboard', url('/dashboard'))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
