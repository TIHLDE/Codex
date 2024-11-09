'use client';

import { EventDetailResponse } from '@/auth/types';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { deleteEvent } from '@/auth/tihlde';
import { useRouter } from 'next/navigation';

interface EventDeleteButtonProps {
  event: EventDetailResponse;
  token: string;
  className?: string;
}

export const EventDeleteButton = ({
  event,
  token,
  className,
}: EventDeleteButtonProps) => {
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
          className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-70"
          onClick={handleExpand}
        >
          <div
            className="z-20 mx-auto w-full max-w-2xl space-y-12 rounded-md border border-gray-300 bg-white p-4 px-6 py-4 shadow-lg dark:border-slate-800 dark:bg-slate-950"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">
                Er du sikker på at du vil slette arrangementet?
              </h1>
              <p>
                Dette vil slette arrangementet permanent og kan ikke angres.
                Alle påmeldinger vil bli fjernet.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={handleExpand}>
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
