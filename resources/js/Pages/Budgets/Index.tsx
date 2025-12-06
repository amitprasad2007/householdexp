import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Category, PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import SecondaryButton from '@/Components/SecondaryButton';
import BudgetForm from './BudgetForm';
import {
    AlertCircle,
    Banknote,
    Briefcase,
    CheckCircle2,
    Film,
    Home,
    MoreHorizontal,
    PiggyBank,
    ShoppingCart,
    Truck,
    Wallet,
    Zap
} from 'lucide-react';

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

// Helper to map icon strings to Lucide components
const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
        case 'shopping-cart': return <ShoppingCart className="w-6 h-6" />;
        case 'home': return <Home className="w-6 h-6" />;
        case 'lightning-bolt': return <Zap className="w-6 h-6" />;
        case 'film': return <Film className="w-6 h-6" />;
        case 'truck': return <Truck className="w-6 h-6" />;
        case 'cash': return <Banknote className="w-6 h-6" />;
        case 'briefcase': return <Briefcase className="w-6 h-6" />;
        default: return <Wallet className="w-6 h-6" />;
    }
};

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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const totalBudget = budgets.reduce((sum, item) => sum + Number(item.limit), 0);
    const totalSpent = budgets.reduce((sum, item) => sum + Number(item.spent), 0);
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Budgets for {currentMonth}
                    </h2>
                    <div className="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold">Total Budget</p>
                            <p className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(totalBudget)}</p>
                        </div>
                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold">Total Spent</p>
                            <p className={`font-bold ${totalSpent > totalBudget ? 'text-red-600' : 'text-emerald-600'}`}>
                                {formatCurrency(totalSpent)}
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Budgets" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {budgets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 text-center shadow-sm dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                            <PiggyBank className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Categories Found</h3>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">Creates some expense categories to start budgeting.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {budgets.map((item) => {
                                const isOverBudget = item.percentage >= 100;
                                const isNearBudget = item.percentage >= 80;
                                const remaining = Math.max(0, item.limit - item.spent);
                                const progressColor = isOverBudget
                                    ? 'bg-red-500'
                                    : isNearBudget
                                        ? 'bg-yellow-500'
                                        : 'bg-emerald-500';

                                return (
                                    <div
                                        key={item.category.id}
                                        className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`rounded-lg p-2.5 shadow-sm text-white`}
                                                    style={{ backgroundColor: item.category.color || '#6366f1' }}
                                                >
                                                    {getCategoryIcon(item.category.icon || '')}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        {item.category.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Monthly Budget
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => openModal(item)}
                                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            >
                                                <MoreHorizontal className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="mt-6">
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Spent</p>
                                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                        {formatCurrency(item.spent)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Limit</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {item.limit > 0 ? formatCurrency(item.limit) : 'Not Set'}
                                                    </p>
                                                </div>
                                            </div>

                                            {item.limit > 0 ? (
                                                <div className="mt-4">
                                                    <div className="flex items-center justify-between text-xs mb-1.5">
                                                        <span className={`font-medium ${isOverBudget ? 'text-red-600 dark:text-red-400' :
                                                            isNearBudget ? 'text-yellow-600 dark:text-yellow-400' :
                                                                'text-emerald-600 dark:text-emerald-400'
                                                            }`}>
                                                            {item.percentage}% used
                                                        </span>
                                                        <span className="text-gray-500 dark:text-gray-400">
                                                            {formatCurrency(remaining)} left
                                                        </span>
                                                    </div>
                                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                                                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-4 flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 py-3 dark:border-gray-700 dark:bg-gray-800/50">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        No limit set for this category
                                                    </p>
                                                </div>
                                            )}

                                            <div className="mt-6">
                                                <SecondaryButton
                                                    onClick={() => openModal(item)}
                                                    className="w-full justify-center"
                                                >
                                                    {item.limit > 0 ? 'Adjust Budget' : 'Set Budget Limit'}
                                                </SecondaryButton>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
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
