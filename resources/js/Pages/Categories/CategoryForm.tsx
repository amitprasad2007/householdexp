import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Category } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface Props {
    show: boolean;
    onClose: () => void;
    category?: Category | null;
}

export default function CategoryForm({ show, onClose, category }: Props) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        type: 'expense',
        color: '#3B82F6', // Default Blue
        icon: '',
    });

    useEffect(() => {
        if (category) {
            setData({
                name: category.name,
                type: category.type,
                color: category.color,
                icon: category.icon || '',
            });
        } else {
            reset();
        }
    }, [category, show]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (category) {
            put(route('categories.update', category.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('categories.store'), {
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
                    {category ? 'Edit Category' : 'Add New Category'}
                </h2>

                <div className="mt-6">
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 block w-full"
                        isFocused
                        placeholder="e.g. Groceries"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="type" value="Type" />
                    <select
                        id="type"
                        name="type"
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                    <InputError message={errors.type} className="mt-2" />
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="color" value="Color" />
                    <div className="flex items-center space-x-2 mt-2">
                        <input
                            type="color"
                            value={data.color}
                            onChange={(e) => setData('color', e.target.value)}
                            className="h-10 w-20 rounded border border-gray-300 p-1"
                        />
                        <span className="text-sm text-gray-500">{data.color}</span>
                    </div>
                    <InputError message={errors.color} className="mt-2" />
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        {category ? 'Update Category' : 'Save Category'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
