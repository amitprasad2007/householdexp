import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { lazy, Suspense, useEffect, useState } from 'react';

const FullCalendar = lazy(() => import('@fullcalendar/react'));

interface Event {
    title: string;
    start: string;
    backgroundColor: string;
    borderColor: string;
    extendedProps: {
        amount: number;
        type: string;
    };
}

interface Props extends PageProps {
    events: Event[];
}

export default function Index({ auth, events }: Props) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleDateClick = (arg: any) => {
        // alert(arg.dateStr)
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Calendar
                </h2>
            }
        >
            <Head title="Calendar" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800 p-6">
                        {/* FullCalendar Component */}
                        <div className="calendar-container text-gray-900 dark:text-gray-100">
                            <style>{`
                                .fc-daygrid-day-number { color: inherit; text-decoration: none; }
                                .fc-col-header-cell-cushion { color: inherit; text-decoration: none; }
                            `}</style>
                            {isMounted && (
                                <Suspense fallback={<div>Loading Calendar...</div>}>
                                    <FullCalendar
                                        plugins={[dayGridPlugin, interactionPlugin]}
                                        initialView="dayGridMonth"
                                        events={events}
                                        dateClick={handleDateClick}
                                        headerToolbar={{
                                            left: 'prev,next today',
                                            center: 'title',
                                            right: 'dayGridMonth,dayGridWeek'
                                        }}
                                        height="auto"
                                        dayMaxEvents={3}
                                        moreLinkClick={(arg) => {
                                            // Extract date from the argument.
                                            // The arg object has a `date` property which is a native Date object.
                                            // We format it to YYYY-MM-DD
                                            const offset = arg.date.getTimezoneOffset();
                                            const date = new Date(arg.date.getTime() - (offset * 60 * 1000));
                                            const dateStr = date.toISOString().split('T')[0];

                                            // Navigate using Inertia router
                                            // We need to import router from @inertiajs/react first (I'll add import below)
                                            // Since I can't add imports easily here, I'll assume it's imported or I will do a separate edit.
                                            // Let's use window.location as a fallback or cleaner way if router isn't available in scope yet.
                                            // Better to just use window.location.href for now to be safe or add import.
                                            // Actually I can see imports at top. I need to add router import.
                                            window.location.href = route('calendar.day', dateStr);
                                            return "function"; // prevent default popover
                                        }}
                                    />
                                </Suspense>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
