import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface Account {
    id: number;
    name: string;
    type: string;
    balance: number;
}

export interface Category {
    id: number;
    name: string;
    type: string;
    icon?: string;
    color?: string;
}

export interface Transaction {
    id: number;
    title: string;
    amount: number;
    date: string;
    type: string;
    payment_method: string;
    status: string;
    category: Category;
    account: Account;
    notes?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};
