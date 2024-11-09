import authOptions from '@/auth/auth';
import { getEvent } from '@/auth/tihlde';
import { EventForm } from '@/components/events/EventForm';
import { EventsHeader } from '@/components/events/Header';
import { getServerSession } from 'next-auth';

interface EventEditPageProps {
  params: {
    id: string;
  };
}

const EventEditPage = async ({ params }: EventEditPageProps) => {
  const session = await getServerSession(authOptions);
  const token = session?.user?.tihldeUserToken ?? '';

  const event = await getEvent(token, params.id);

  return (
    <main className="w-full space-y-12 px-12 py-8">
      <EventsHeader
        back_text={`CODEX / ${event.id} - Rediger`}
        back_url={`/events/${event.id}`}
      />
      <EventForm event={event} />
    </main>
  );
};

export default EventEditPage;
