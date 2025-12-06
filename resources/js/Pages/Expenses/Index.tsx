import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Account, Category, PageProps, Transaction } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import ExpenseForm from './ExpenseForm';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import axios from 'axios';

interface Props extends PageProps {
    expenses: {
        data: Transaction[];
        links: any[];
    };
    categories: Category[];
    accounts: Account[];
}

export default function Index({ auth, expenses, categories, accounts }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Transaction | null>(null);

    const openModal = (expense: Transaction | null = null) => {
        setSelectedExpense(expense);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedExpense(null);
        setShowModal(false);
    };

    const deleteExpense = (id: number) => {
        if (confirm('Are you sure you want to delete this expense?')) {
            router.delete(route('expenses.destroy', id));
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePay = async (expense: Transaction) => {
        const res = await loadRazorpay();

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        try {
            const response = await axios.post(route('payment.create-order', expense.id));
            const options = {
                key: response.data.key,
                amount: response.data.amount,
                currency: "INR",
                name: response.data.name,
                description: response.data.description,
                image: "https://example.com/your_logo", // You can replace this
                order_id: response.data.order_id,
                handler: function (response: any) {
                    router.post(route('payment.verify'), {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        expense_id: expense.id
                    });
                },
                prefill: {
                    name: response.data.prefill.name,
                    email: response.data.prefill.email,
                },
                notes: response.data.notes,
                theme: {
                    color: response.data.theme.color,
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error(error);
            alert('Something went wrong creating the order.');
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Expenses
                    </h2>
                    <PrimaryButton onClick={() => openModal()}>Add Expense</PrimaryButton>
                </div>
            }
        >
            <Head title="Expenses" />

            <div className="py-4 sm:py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 sm:p-6 text-gray-900 dark:text-gray-100">
                            {expenses.data.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    No expenses found. Click "Add Expense" to create one.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Title</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Category</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Account</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                            {expenses.data.map((expense) => (
                                                <tr key={expense.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                        {new Date(expense.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                        {expense.title}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                            {expense.category?.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                        {expense.account?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-bold">
                                                        ₹{Number(expense.amount).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {expense.status === 'pending' ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                                Pending
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                                Completed
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        {expense.status === 'pending' && (
                                                            <button
                                                                onClick={() => handlePay(expense)}
                                                                className="mr-2 px-3 py-1 bg-indigo-600 text-white rounded-md text-xs hover:bg-indigo-500"
                                                            >
                                                                Pay Now
                                                            </button>
                                                        )}
                                                        <SecondaryButton
                                                            onClick={() => openModal(expense)}
                                                            className="mr-2"
                                                        >
                                                            Edit
                                                        </SecondaryButton>
                                                        <DangerButton onClick={() => deleteExpense(expense.id)}>
                                                            Delete
                                                        </DangerButton>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination Links (Simplified) */}
                            {expenses.links.length > 3 && (
                                <div className="mt-4 flex justify-center">
                                    {/* Implement pagination component here if needed */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ExpenseForm
                show={showModal}
                onClose={closeModal}
                expense={selectedExpense}
                categories={categories}
                accounts={accounts}
            />
        </AuthenticatedLayout>
    );
}
