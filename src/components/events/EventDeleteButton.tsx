"use client";

import { EventDetailResponse } from "@/auth/types";
import { useState } from "react";
import { Button } from "../Button";
import { deleteEvent } from "@/auth/tihlde";
import { useRouter } from "next/navigation";


interface EventDeleteButtonProps {
    event: EventDetailResponse;
    token: string;
    className?: string;
};

export const EventDeleteButton = ({ event, token, className }: EventDeleteButtonProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            await deleteEvent(token, event.id);
            router.replace('/events');
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    };

    const handleExpand = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    };


    return (
        <div onClick={(e) => e.stopPropagation()}>
            {isOpen && (
            <div 
                className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10"
                onClick={handleExpand}
            >
                <div 
                    className="max-w-2xl w-full mx-auto dark:bg-slate-950 bg-white border border-gray-300 dark:border-slate-800 p-4 rounded-md shadow-lg z-20 py-4 px-6 space-y-12"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">
                            Er du sikker på at du vil slette arrangementet?
                        </h1>
                        <p>
                            Dette vil slette arrangementet permanent og kan ikke angres. Alle påmeldinger vil bli fjernet.
                        </p>
                    </div>

                    <div className="flex items-center space-x-2 justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleExpand}
                        >
                            Avbryt
                        </Button>
                        <Button
                            onClick={handleDelete}
                            type="button"
                            variant="destructive"
                        >
                            Slett arrangement
                        </Button>
                    </div>
                </div>
            </div>
            )}

            <Button
                className={className}
                type="button"
                onClick={handleExpand}
                variant="destructive"
            >
                Slett arrangement
            </Button>
        </div>
    );
};