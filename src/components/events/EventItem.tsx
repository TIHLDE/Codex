'use client';

import { Event, MinuteGroup } from '@/auth/types';
import { EventTag } from './EventTag';
import { EventOrganizer } from './EventOrganizer';
import { Button } from '../ui/Button';
import { EventDate } from './EventDate';
import { EventLecturer } from './EventLecturer';

interface EventItemProps {
  event: Event;
}

export const EventItem = ({ event }: EventItemProps) => {
  return (
    <div className="w-full space-y-8 rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-slate-600">
      <div className="space-y-2">
        <div>
          <h1 className="text-xl font-bold">{event.title}</h1>
          <div className="flex items-center justify-between">
            <EventDate date={event.start_date} />

            <p className="text-sm text-gray-400">
              {event.number_of_registrations === 0 && 'Ingen påmeldte'}

              {event.number_of_registrations === 1 && '1 påmeldt'}

              {event.number_of_registrations > 1 &&
                `${event.number_of_registrations} påmeldte`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <EventTag tag={event.tag} />
          <EventOrganizer organizer={event.organizer.name as MinuteGroup} />
        </div>
      </div>

      <EventLecturer lecturer={event.lecturer} />

      <Button className="block w-full text-center" href={`/events/${event.id}`}>
        Les mer
      </Button>
    </div>
  );
};
