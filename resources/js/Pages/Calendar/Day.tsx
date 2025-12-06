import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Transaction } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface Props extends PageProps {
    date: string;
    transactions: Transaction[];
}

export default function Day({ auth, date, transactions }: Props) {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Details for {new Date(date).toLocaleDateString()}
                    </h2>
                    <Link
                        href={route('calendar')}
                        className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        Back to Calendar
                    </Link>
                </div>
            }
        >
            <Head title={`Details for ${date}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* Summary Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="bg-white p-6 shadow sm:rounded-lg dark:bg-gray-800">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</div>
                            <div className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                                +₹{totalIncome.toFixed(2)}
                            </div>
                        </div>
                        <div className="bg-white p-6 shadow sm:rounded-lg dark:bg-gray-800">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expense</div>
                            <div className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                                -₹{totalExpense.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {transactions.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    No transactions found for this date.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Type</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Title</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Category</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Account</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                            {transactions.map((transaction) => (
                                                <tr key={transaction.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.type === 'income'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                            }`}>
                                                            {transaction.type.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                        {transaction.title}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                        {transaction.category?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                        {transaction.account?.name}
                                                    </td>
                                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${transaction.type === 'income'
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-red-600 dark:text-red-400'
                                                        }`}>
                                                        {transaction.type === 'income' ? '+' : '-'}₹{Number(transaction.amount).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
