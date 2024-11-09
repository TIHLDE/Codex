import authOptions from '@/auth/auth';
import { getEvents } from '@/auth/tihlde';
import { getServerSession } from 'next-auth';
import { EventItem } from './EventItem';

export const EventsList = async () => {
  const session = await getServerSession(authOptions);
  const token = session?.user.tihldeUserToken ?? '';

  const events = await getEvents(token);

  return (
    <div className="mx-auto mt-20 grid w-full max-w-4xl grid-cols-1 gap-4">
      {events.results.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </div>
  );
};
