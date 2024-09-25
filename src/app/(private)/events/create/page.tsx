import authOptions from "@/auth/auth";
import { isLeader } from "@/auth/tihlde";
import { EventForm } from "@/components/events/EventForm";
import { EventsHeader } from "@/components/events/Header";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


const EventCreatePage = async () => {
    const session = await getServerSession(authOptions);

    const hasAccess = await isLeader(session?.user.tihldeUserToken ?? "");

    if (!hasAccess) {
        redirect("/events");
    }

    return (
        <main className="w-full px-12 py-8 space-y-12">
            <EventsHeader
                back_text="CODEX / Nytt arrangement"
                back_url="/events"
            />
            <EventForm />
        </main>
    );
};


export default EventCreatePage;