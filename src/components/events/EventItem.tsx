"use client";

import { Event, MinuteGroup } from "@/auth/types";
import { EventTag } from "./EventTag";
import { EventOrganizer } from "./EventOrganizer";
import { Button } from "../Button";
import { EventDate } from "./EventDate";
import { EventLecturer } from "./EventLecturer";


interface EventItemProps {
    event: Event;
};

export const EventItem = ({ event }: EventItemProps) => {
    return (
        <div className="w-full shadow-sm border border-gray-300 dark:border-slate-600 px-3 py-2 rounded-md space-y-8">
            <div className="space-y-2">
                <div>
                    <h1 className="text-xl font-bold">
                        {event.title}
                    </h1>
                    <div className="flex items-center justify-between">
                        <EventDate date={event.start_date} />

                        <p className="text-sm text-gray-400">
                            {
                                event.number_of_registrations === 0 && (
                                    "Ingen påmeldte"
                                )
                            }

                            {
                                event.number_of_registrations === 1 && (
                                    "1 påmeldt"
                                )
                            }

                            {
                                event.number_of_registrations > 1 && (
                                    `${event.number_of_registrations} påmeldte`
                                )
                            }
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <EventTag tag={event.tag} />
                    <EventOrganizer organizer={event.organizer.name as MinuteGroup} />
                </div>
            </div>
            
            
            <EventLecturer lecturer={event.lecturer} />

            <Button
                className="w-full block text-center"
                href={`/events/${event.id}`}
            >
                Les mer
            </Button>
        </div>
    );
};