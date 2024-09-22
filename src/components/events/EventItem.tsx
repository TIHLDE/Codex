"use client";

import { Event, MinuteGroup } from "@/auth/types";
import { EventTag } from "./EventTag";
import { EventOrganizer } from "./EventOrganizer";
import { Button } from "../Button";


interface EventItemProps {
    event: Event;
};

export const EventItem = ({ event }: EventItemProps) => {
    return (
        <div className="w-full border px-3 py-2 rounded-md space-y-8">
            <div className="space-y-2">
                <div>
                    <h1 className="text-xl font-bold">
                        {event.title}
                    </h1>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                            {new Date(event.start_date).toLocaleDateString('nb-NO', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })} {new Date(event.start_date).toLocaleTimeString('nb-NO', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>

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
            
            
            <div className="space-y-2">
                <p className="text-sm">
                    Foredragsholder:
                </p>
                <div className="flex items-center space-x-2">
                    <div>
                        {event.lecturer.image ? (
                            <img src={event.lecturer.image} alt={event.lecturer.first_name} className="w-10 h-10 rounded-full" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center">
                                <p className="text-white font-bold">
                                    {event.lecturer.first_name[0]}
                                </p>
                            </div>
                        )}
                    </div>
                    <p className="text-sm">
                        {event.lecturer.first_name} {event.lecturer.last_name}
                    </p>
                </div>
            </div>

            <Button
                className="w-full block text-center"
                href={`/events/${event.id}`}
            >
                Les mer
            </Button>
        </div>
    );
};