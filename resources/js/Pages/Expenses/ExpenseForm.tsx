import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Account, Category, Transaction } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface Props {
    show: boolean;
    onClose: () => void;
    expense?: Transaction | null;
    categories: Category[];
    accounts: Account[];
}

export default function ExpenseForm({ show, onClose, expense, categories, accounts }: Props) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category_id: '',
        account_id: '',
        payment_method: 'UPI',
        status: 'completed',
        notes: '',
    });

    useEffect(() => {
        if (expense) {
            setData({
                title: expense.title,
                amount: expense.amount.toString(),
                date: expense.date,
                category_id: expense.category.id.toString(),
                account_id: expense.account.id.toString(),
                payment_method: expense.payment_method,
                status: expense.status || 'completed',
                notes: expense.notes || '',
            });
        } else {
            reset();
            setData('date', new Date().toISOString().split('T')[0]);
        }
    }, [expense, show]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (expense) {
            put(route('expenses.update', expense.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('expenses.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {expense ? 'Edit Expense' : 'Add New Expense'}
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="col-span-2">
                        <InputLabel htmlFor="title" value="Title" />
                        <TextInput
                            id="title"
                            type="text"
                            name="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="mt-1 block w-full"
                            isFocused
                            placeholder="e.g. Weekly Groceries"
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="amount" value="Amount" />
                        <TextInput
                            id="amount"
                            type="number"
                            step="0.01"
                            name="amount"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.amount} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="date" value="Date" />
                        <TextInput
                            id="date"
                            type="date"
                            name="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.date} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="category_id" value="Category" />
                        <select
                            id="category_id"
                            name="category_id"
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.category_id} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="account_id" value="Account" />
                        <select
                            id="account_id"
                            name="account_id"
                            value={data.account_id}
                            onChange={(e) => setData('account_id', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                        >
                            <option value="">Select Account</option>
                            {accounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.name} ({account.type})
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.account_id} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="payment_method" value="Payment Method" />
                        <select
                            id="payment_method"
                            name="payment_method"
                            value={data.payment_method}
                            onChange={(e) => setData('payment_method', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                        >
                            <option value="UPI">UPI</option>
                            <option value="Card">Card</option>
                            <option value="Cash">Cash</option>
                        </select>
                        <InputError message={errors.payment_method} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="status" value="Status" />
                        <select
                            id="status"
                            name="status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                        >
                            <option value="completed">Completed</option>
                            <option value="pending">Pending (Bill)</option>
                        </select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div className="col-span-2">
                        <InputLabel htmlFor="notes" value="Notes (Optional)" />
                        <textarea
                            id="notes"
                            name="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            rows={3}
                        />
                        <InputError message={errors.notes} className="mt-2" />
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        {expense ? 'Update Expense' : 'Save Expense'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
