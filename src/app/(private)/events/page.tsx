import { EventsHeader } from '@/components/events/Header';
import { EventsList } from '@/components/events/List';

const EventsPage = () => {
  return (
    <main className="w-full px-12 py-8">
      <EventsHeader
        back_text="CODEX / Arrangementer"
        back_url="/"
        next_page="/events/create"
      />
      <EventsList />
    </main>
  );
};

export default EventsPage;
