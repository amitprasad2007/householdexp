import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Category, PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import CategoryForm from './CategoryForm';

interface Props extends PageProps {
    categories: Category[];
}

export default function Index({ auth, categories }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const openModal = (category: Category | null = null) => {
        setSelectedCategory(category);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedCategory(null);
        setShowModal(false);
    };

    const deleteCategory = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('categories.destroy', id));
        }
    };

    const expenseCategories = categories.filter(c => c.type === 'expense');
    const incomeCategories = categories.filter(c => c.type === 'income');

    const CategoryTable = ({ items, title }: { items: Category[], title: string }) => (
        <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
            {items.length === 0 ? (
                <p className="text-gray-500 italic">No {title.toLowerCase()} categories found.</p>
            ) : (
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Color</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {items.map((category) => (
                                    <tr key={category.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white flex items-center">
                                            <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: category.color }}></div>
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {category.color}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <SecondaryButton onClick={() => openModal(category)} className="mr-2">
                                                Edit
                                            </SecondaryButton>
                                            <DangerButton onClick={() => deleteCategory(category.id)}>
                                                Delete
                                            </DangerButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Categories
                    </h2>
                    <PrimaryButton onClick={() => openModal()}>Add Category</PrimaryButton>
                </div>
            }
        >
            <Head title="Categories" />

            <div className="py-4 sm:py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <CategoryTable items={expenseCategories} title="Expense Categories" />
                    <CategoryTable items={incomeCategories} title="Income Categories" />
                </div>
            </div>

            <CategoryForm
                show={showModal}
                onClose={closeModal}
                category={selectedCategory}
            />
        </AuthenticatedLayout>
    );
}
