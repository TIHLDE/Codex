import { EventDetailResponse, MinuteGroup, Registration } from "@/auth/types";
import { EventTag } from "./EventTag";
import { EventOrganizer } from "./EventOrganizer";
import { RegisterToEvent } from "./Register";


interface EventDetailsProps {
    event: EventDetailResponse;
    registrations: Registration[];
};

export const EventDetails = ({ event, registrations }: EventDetailsProps) => {
    return (
        <div className="max-w-4xl w-full space-y-12 mx-auto">
            <div className="w-full flex justify-between">
                <h1 className="font-bold text-3xl">
                    {event.title}
                </h1>

                <div className="flex items-center space-x-2">
                    <EventTag tag={event.tag} />
                    <EventOrganizer organizer={event.organizer.name as MinuteGroup} />
                </div>
            </div>

            <div>

            </div>

            <RegisterToEvent event={event} registrations={registrations} />
        </div>
    );
};