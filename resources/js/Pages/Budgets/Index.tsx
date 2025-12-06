import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Category, PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import BudgetForm from './BudgetForm';

interface BudgetData {
    category: Category;
    limit: number;
    spent: number;
    percentage: number;
    budget_id: number | null;
}

interface Props extends PageProps {
    budgets: BudgetData[];
    categories: Category[];
}

export default function Index({ auth, budgets, categories }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedLimit, setSelectedLimit] = useState<number>(0);

    const openModal = (budget: BudgetData) => {
        setSelectedCategory(budget.category);
        setSelectedLimit(budget.limit);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedCategory(null);
        setShowModal(false);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Monthly Budgets
                </h2>
            }
        >
            <Head title="Budgets" />

            <div className="py-4 sm:py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 sm:p-6 text-gray-900 dark:text-gray-100">
                            {budgets.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    No expense categories found to set budgets for.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {budgets.map((item) => (
                                        <div key={item.category.id} className="border rounded-lg p-4 dark:border-gray-700">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center">
                                                    {/* Category Icon Placeholder or Colour */}
                                                    <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: item.category.color || 'gray' }}></div>
                                                    <h3 className="font-semibold text-lg">{item.category.name}</h3>
                                                </div>
                                                <SecondaryButton size="sm" onClick={() => openModal(item)}>
                                                    {item.limit > 0 ? 'Edit Limit' : 'Set Limit'}
                                                </SecondaryButton>
                                            </div>

                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Spent: ₹{Number(item.spent).toLocaleString()}</span>
                                                <span>Limit: {item.limit > 0 ? `₹${Number(item.limit).toLocaleString()}` : 'Not Set'}</span>
                                            </div>

                                            {item.limit > 0 && (
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                    <div
                                                        className={`h-2.5 rounded-full ${item.percentage >= 100 ? 'bg-red-600' : (item.percentage >= 80 ? 'bg-yellow-400' : 'bg-green-600')}`}
                                                        style={{ width: `${item.percentage}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                            {item.limit > 0 && (
                                                <div className="text-xs text-right mt-1 text-gray-500">
                                                    {item.percentage}% used
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <BudgetForm
                show={showModal}
                onClose={closeModal}
                category={selectedCategory}
                currentLimit={selectedLimit}
            />
        </AuthenticatedLayout>
    );
}
