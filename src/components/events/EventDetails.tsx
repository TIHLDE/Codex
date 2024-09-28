import { EventDetailResponse, MinuteGroup, Registration } from "@/auth/types";
import { EventTag } from "./EventTag";
import { EventOrganizer } from "./EventOrganizer";
import { RegisterToEvent } from "./Register";
import { EventDate } from "./EventDate";
import { CalendarIcon, HomeIcon } from "@heroicons/react/24/outline";
import { EventLecturer } from "./EventLecturer";
import { MarkdownRenderer } from "../content/MarkdownRenderer";
import { EventRegistrations } from "./Registrations";
import Link from "next/link";


interface EventDetailsProps {
    event: EventDetailResponse;
    registrations: Registration[];
    numberOfRegistrations: number;
};

export const EventDetails = ({ event, registrations, numberOfRegistrations }: EventDetailsProps) => {
    return (
        <div className="w-full space-y-12 mx-auto pb-12">
            <div className="flex space-x-8">
                <div className="max-w-md w-full space-y-4">
                    {event.viewer_is_registered && (
                        <div className="w-full border border-emerald-500 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-200 rounded-md p-4">
                            <p className="text-center text-emerald-500 dark:text-emerald-800">
                                Du er påmeldt til arrangementet
                            </p>
                        </div>
                    )}

                    <div className="w-full border border-slate-600 rounded-md shadow-sm space-y-4 p-4">
                        <div className="space-y-1">
                            <h1 className="text-sm font-semibold text-sky-600 dark:text-sky-500">
                                Startdato:
                            </h1>
                            <div className="flex items-center space-x-2">
                                <CalendarIcon className="h-5 w-5" />
                                <EventDate date={event.start_date.toString()} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-sm font-semibold text-sky-600 dark:text-sky-500">
                                Påmeldingsstart:
                            </h1>
                            <div className="flex items-center space-x-2">
                                <CalendarIcon className="h-5 w-5" />
                                <EventDate date={event.start_registration_at.toString()} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-sm font-semibold text-sky-600 dark:text-sky-500">
                                Påmeldingsslutt:
                            </h1>
                            <div className="flex items-center space-x-2">
                                <CalendarIcon className="h-5 w-5" />
                                <EventDate date={event.end_registration_at.toString()} />
                            </div>
                        </div>
                    </div>

                    <div className="w-full border border-slate-600 rounded-md shadow-sm space-y-4 p-4">
                        <div className="space-y-1">
                            <h1 className="text-sm font-semibold text-sky-600 dark:text-sky-500">
                                Lokasjon:
                            </h1>
                            <div className="flex items-center space-x-2">
                                <HomeIcon className="h-5 w-5" />
                                <a target="_blank" href={event.mazemap_link} className="text-sm text-gray-600 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 underline">
                                    {event.location}
                                </a>
                            </div>
                        </div>
                    </div>

                    <RegisterToEvent
                        event={event}
                        registrations={registrations}
                    />

                    <EventRegistrations
                        registrations={registrations}
                        numberOfRegistrations={numberOfRegistrations}
                    />
                </div>

                <div className="w-full space-y-12">
                    <div className="flex justify-between space-x-20 items-baseline">
                        <div className="space-y-4">
                            <h1 className="font-bold text-3xl">
                                {event.title}
                            </h1>
                            <EventLecturer lecturer={event.lecturer} />

                            {event.permissions.update && (
                                <Link
                                    className="block px-4 py-1 bg-sky-700 text-white rounded-md text-sm"
                                    href={`/events/${event.id}/edit`}
                                >
                                    Rediger arrangement
                                </Link>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <EventTag tag={event.tag} />
                            <EventOrganizer organizer={event.organizer.name as MinuteGroup} />
                        </div>
                    </div>

                    <div className="w-full h-0.5 bg-slate-700 rounded-md" />

                    <MarkdownRenderer content={event.description} />
                </div>
            </div>
        </div>
    );
};