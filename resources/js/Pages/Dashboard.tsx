import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface Props extends PageProps {
    stats: {
        income: number;
        expense: number;
        balance: number;
    };
    chartData: Array<{
        name: string;
        total: number;
        color: string;
    }>;
}

export default function Dashboard({
    auth,
    stats = { income: 0, expense: 0, balance: 0 },
    chartData = []
}: Props) {

    // Prepare Chart Data
    const barData = {
        labels: chartData.map(item => item.name),
        datasets: [
            {
                label: 'Expenses by Category',
                data: chartData.map(item => item.total),
                backgroundColor: chartData.map(item => item.color || '#3B82F6'),
            },
        ],
    };

    const doughnutData = {
        labels: ['Income', 'Expense'],
        datasets: [
            {
                data: [stats.income, stats.expense],
                backgroundColor: ['#10B981', '#EF4444'],
                hoverOffset: 4
            },
        ],
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-4 sm:py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 sm:mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800 p-6">
                            <div className="text-gray-500 text-sm uppercase font-bold">Total Balance</div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                                ₹{Number(stats.balance).toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800 p-6">
                            <div className="text-gray-500 text-sm uppercase font-bold">This Month's Income</div>
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                                +₹{Number(stats.income).toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800 p-6">
                            <div className="text-gray-500 text-sm uppercase font-bold">This Month's Expense</div>
                            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                                -₹{Number(stats.expense).toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800 p-4 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Expense Breakdown</h3>
                            {chartData.length > 0 ? (
                                <Bar options={{ responsive: true }} data={barData} />
                            ) : (
                                <p className="text-gray-500">No expense data for this month.</p>
                            )}
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800 p-4 sm:p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Income vs Expense</h3>
                            <div className="w-full sm:w-3/4 md:w-1/2 mx-auto">
                                <Doughnut data={doughnutData} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
