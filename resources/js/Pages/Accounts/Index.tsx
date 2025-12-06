import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Account, PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import AccountForm from './AccountForm';

interface Props extends PageProps {
    accounts: Account[];
}

export default function Index({ auth, accounts }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    const openModal = (account: Account | null = null) => {
        setSelectedAccount(account);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedAccount(null);
        setShowModal(false);
    };

    const deleteAccount = (id: number) => {
        if (confirm('Are you sure you want to delete this account? Transactions related to it might be affected.')) {
            router.delete(route('accounts.destroy', id), {
                onSuccess: () => {
                    // Toast or generic success handling usually picked up by layout
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Accounts
                    </h2>
                    <PrimaryButton onClick={() => openModal()}>Add Account</PrimaryButton>
                </div>
            }
        >
            <Head title="Accounts" />

            <div className="py-4 sm:py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-4 sm:p-6 text-gray-900 dark:text-gray-100">
                            {accounts.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    No accounts found. Click "Add Account" to create one.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Type</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Balance</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                            {accounts.map((account) => (
                                                <tr key={account.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                        {account.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                        {account.type}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                                                        ₹{Number(account.balance).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <SecondaryButton
                                                            onClick={() => openModal(account)}
                                                            className="mr-2"
                                                        >
                                                            Edit
                                                        </SecondaryButton>
                                                        <DangerButton onClick={() => deleteAccount(account.id)}>
                                                            Delete
                                                        </DangerButton>
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

            <AccountForm
                show={showModal}
                onClose={closeModal}
                account={selectedAccount}
            />
        </AuthenticatedLayout>
    );
}
