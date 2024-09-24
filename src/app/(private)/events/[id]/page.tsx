import authOptions from "@/auth/auth";
import { getEvent, getEventRegistrations } from "@/auth/tihlde";
import { EventDetails } from "@/components/events/EventDetails";
import { EventsHeader } from "@/components/events/Header";
import { getServerSession } from "next-auth";


interface EventDetailPageProps {
    params: {
        id: string;
    }
};

const EventDetailPage = async ({ params }: EventDetailPageProps) => {
    const session = await getServerSession(authOptions);
    const token = session?.user?.tihldeUserToken ?? '';

    const event = await getEvent(token, params.id);
    const registrations = await getEventRegistrations(token, event.id);

    return (
        <main className="max-w-8xl w-full px-12 py-8 space-y-12">
            <EventsHeader
                back_text={`CODEX / ${event.id}`}
                back_url="/events"
            />

            <EventDetails
                event={event}
                registrations={registrations.results}
                numberOfRegistrations={registrations.count}
            />
        </main>
    );
};


export default EventDetailPage;