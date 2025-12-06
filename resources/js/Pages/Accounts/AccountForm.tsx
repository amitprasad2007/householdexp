import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Account } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface Props {
    show: boolean;
    onClose: () => void;
    account?: Account | null;
}

export default function AccountForm({ show, onClose, account }: Props) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        type: 'Cash',
        balance: '0',
    });

    useEffect(() => {
        if (account) {
            setData({
                name: account.name,
                type: account.type,
                balance: account.balance.toString(),
            });
        } else {
            reset();
        }
    }, [account, show]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (account) {
            put(route('accounts.update', account.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('accounts.store'), {
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
                    {account ? 'Edit Account' : 'Add New Account'}
                </h2>

                <div className="mt-6">
                    <InputLabel htmlFor="name" value="Account Name" />
                    <TextInput
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 block w-full"
                        isFocused
                        placeholder="e.g. HDFC Bank"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="type" value="Account Type" />
                    <select
                        id="type"
                        name="type"
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                        <option value="Cash">Cash</option>
                        <option value="Bank">Bank</option>
                        <option value="Mobile Wallet">Mobile Wallet</option>
                        <option value="Credit Card">Credit Card</option>
                    </select>
                    <InputError message={errors.type} className="mt-2" />
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="balance" value="Current Balance" />
                    <TextInput
                        id="balance"
                        type="number"
                        step="0.01"
                        name="balance"
                        value={data.balance}
                        onChange={(e) => setData('balance', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.balance} className="mt-2" />
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        {account ? 'Update Account' : 'Save Account'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
