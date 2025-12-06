import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Account, Category, PageProps, Transaction } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import IncomeForm from './IncomeForm';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface Props extends PageProps {
    incomes: {
        data: Transaction[];
        links: any[];
    };
    categories: Category[];
    accounts: Account[];
}

export default function Index({ auth, incomes, categories, accounts }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState<Transaction | null>(null);

    const openModal = (income: Transaction | null = null) => {
        setSelectedIncome(income);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedIncome(null);
        setShowModal(false);
    };

    const deleteIncome = (id: number) => {
        if (confirm('Are you sure you want to delete this income?')) {
            router.delete(route('income.destroy', id)); // Use 'income.destroy'
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Income
                    </h2>
                    <PrimaryButton onClick={() => openModal()}>Add Income</PrimaryButton>
                </div>
            }
        >
            <Head title="Income" />

            <div className="py-4 sm:py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 sm:p-6 text-gray-900 dark:text-gray-100">
                            {incomes.data.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    No income entries found. Click "Add Income" to create one.
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
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                            {incomes.data.map((income) => (
                                                <tr key={income.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                        {new Date(income.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                        {income.title}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                            {income.category?.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                        {income.account?.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-bold text-green-600 dark:text-green-400">
                                                        +₹{Number(income.amount).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <SecondaryButton
                                                            onClick={() => openModal(income)}
                                                            className="mr-2"
                                                        >
                                                            Edit
                                                        </SecondaryButton>
                                                        <DangerButton onClick={() => deleteIncome(income.id)}>
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
                            {incomes.links.length > 3 && (
                                <div className="mt-4 flex justify-center">
                                    {/* Implement pagination component here if needed */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <IncomeForm
                show={showModal}
                onClose={closeModal}
                income={selectedIncome}
                categories={categories}
                accounts={accounts}
            />
        </AuthenticatedLayout>
    );
}
