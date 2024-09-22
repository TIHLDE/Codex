"use client";

import { createEventRegistration, deleteEventRegistration } from "@/auth/tihlde";
import { EventDetailResponse, Registration } from "@/auth/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../Button";


interface RegisterToEventProps {
    event: EventDetailResponse;
    registrations: Registration[];
};

export const RegisterToEvent = ({ event, registrations }: RegisterToEventProps) => {
    const router = useRouter();
    const session = useSession();
    const token = session.data?.user.tihldeUserToken ?? '';

    const register = async () => {
        try {
            if (event.viewer_is_registered) {
                const reg = registrations.find(reg => reg.user_info.user_id === session.data?.user?.user_id);
                if (!reg) {
                    return;
                }
                await deleteEventRegistration(token, event.id, reg.registration_id);
            } else {
                await createEventRegistration(token, event.id);
            }

            router.refresh();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Button
            onClick={register}
            className="w-full"
        >
            {
                event.viewer_is_registered ? "Meld deg av" : "Meld deg på"
            }
        </Button>
    );
};