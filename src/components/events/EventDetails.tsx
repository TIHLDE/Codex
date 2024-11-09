import { EventDetailResponse, MinuteGroup, Registration } from '@/auth/types';
import { EventTag } from './EventTag';
import { EventOrganizer } from './EventOrganizer';
import { RegisterToEvent } from './Register';
import { EventDate } from './EventDate';
import { CalendarIcon, HomeIcon } from '@heroicons/react/24/outline';
import { EventLecturer } from './EventLecturer';
import { MarkdownRenderer } from '../documentation/MarkdownRenderer';
import { EventRegistrations } from './Registrations';
import Link from 'next/link';

interface EventDetailsProps {
  event: EventDetailResponse;
  registrations: Registration[];
  numberOfRegistrations: number;
}

export const EventDetails = ({
  event,
  registrations,
  numberOfRegistrations,
}: EventDetailsProps) => {
  return (
    <div className="mx-auto w-full space-y-12 pb-12">
      <div className="flex space-x-8">
        <div className="w-full max-w-md space-y-4">
          {event.viewer_is_registered && (
            <div className="w-full rounded-md border border-emerald-500 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-200">
              <p className="text-center text-emerald-500 dark:text-emerald-800">
                Du er påmeldt til arrangementet
              </p>
            </div>
          )}

          <div className="w-full space-y-4 rounded-md border border-slate-600 p-4 shadow-sm">
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

          <div className="w-full space-y-4 rounded-md border border-slate-600 p-4 shadow-sm">
            <div className="space-y-1">
              <h1 className="text-sm font-semibold text-sky-600 dark:text-sky-500">
                Lokasjon:
              </h1>
              <div className="flex items-center space-x-2">
                <HomeIcon className="h-5 w-5" />
                <a
                  target="_blank"
                  href={event.mazemap_link}
                  className="text-sm text-gray-600 underline hover:text-sky-500 dark:text-gray-400 dark:hover:text-sky-400"
                >
                  {event.location}
                </a>
              </div>
            </div>
          </div>

          <RegisterToEvent event={event} registrations={registrations} />

          <EventRegistrations
            registrations={registrations}
            numberOfRegistrations={numberOfRegistrations}
          />
        </div>

        <div className="w-full space-y-12">
          <div className="flex items-baseline justify-between space-x-20">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{event.title}</h1>
              <EventLecturer lecturer={event.lecturer} />

              {event.permissions.update && (
                <Link
                  className="block rounded-md bg-sky-700 px-4 py-1 text-sm text-white"
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

          <div className="h-0.5 w-full rounded-md bg-slate-700" />

          <MarkdownRenderer content={event.description} />
        </div>
      </div>
    </div>
  );
};
