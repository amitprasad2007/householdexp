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
    category: Category | null;
    currentLimit: number;
}

export default function BudgetForm({ show, onClose, category, currentLimit }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        category_id: '',
        amount: '',
    });

    useEffect(() => {
        if (category) {
            setData({
                category_id: category.id.toString(),
                amount: currentLimit.toString(),
            });
        }
    }, [category, show]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('budgets.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Set Budget for {category?.name}
                </h2>

                <div className="mt-6">
                    <InputLabel htmlFor="amount" value="Budget Limit" />
                    <TextInput
                        id="amount"
                        type="number"
                        step="1"
                        name="amount"
                        value={data.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        className="mt-1 block w-full"
                        isFocused
                        placeholder="e.g. 5000"
                    />
                    <InputError message={errors.amount} className="mt-2" />
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        Save Budget
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
