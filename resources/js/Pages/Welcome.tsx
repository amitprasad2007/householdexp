import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, LayoutDashboard, PieChart, Wallet } from 'lucide-react';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gray-50 text-black dark:bg-zinc-950 dark:text-white">
                {/* Navigation */}
                <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80 sticky top-0 z-50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-600 rounded-lg">
                                    <Wallet className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                                    Household
                                </span>
                            </div>
                            <div className="flex gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-800 transition-all duration-200"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative isolate pt-14 dark:bg-zinc-950">
                    <div
                        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>

                    <div className="py-24 sm:py-32 lg:pb-40">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                                    Master Your Finances with{' '}
                                    <span className="text-indigo-600 dark:text-indigo-400">Confidence</span>
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                                    Track expenses, manage budgets, and gain insights into your financial health.
                                    Simple, powerful, and designed for modern households.
                                </p>
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center gap-2"
                                        >
                                            Go to Dashboard <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route('register')}
                                            className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center gap-2"
                                        >
                                            Start for Free <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    )}
                                    <a href="#features" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white flex items-center gap-1 hover:gap-2 transition-all">
                                        Learn more <span aria-hidden="true">→</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Section */}
                <div id="features" className="py-24 sm:py-32 bg-white dark:bg-zinc-900">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:text-center">
                            <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">Everything you need</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                                Smart Financial Management
                            </p>
                            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                                Stop guessing where your money goes. Take control with intuitive tools designed to help you save more and spend wisely.
                            </p>
                        </div>
                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                                            <PieChart className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        Visual Reports
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                                        <p className="flex-auto">
                                            See exactly where your money is going with beautiful, interactive charts and graphs.
                                        </p>
                                    </dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                                            <LayoutDashboard className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        Budget Tracking
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                                        <p className="flex-auto">
                                            Set monthly budgets for different categories and get notified when you're close to the limit.
                                        </p>
                                    </dd>
                                </div>
                                <div className="flex flex-col">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                                            <CheckCircle2 className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        Goal Setting
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                                        <p className="flex-auto">
                                            Define financial goals and track your progress towards achieving them effortlessly.
                                        </p>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800">
                    <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
                        <div className="mt-10 flex justify-center space-x-10">
                            <p className="text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
                                &copy; {new Date().getFullYear()} Household Finance. All rights reserved.
                            </p>
                        </div>
                        <div className="mt-4 text-center text-xs text-gray-400 dark:text-gray-600">
                            Laravel v{laravelVersion} (PHP v{phpVersion})
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
