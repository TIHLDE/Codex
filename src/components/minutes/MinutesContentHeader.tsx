import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { SingleMinutesPostResponse } from '@/auth/types';
import { Button } from '@/components/Button';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export interface MinutesContentHeaderProps {
  minute: SingleMinutesPostResponse;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MinutesContentHeader({
  minute,
  onEdit,
  onDelete,
}: MinutesContentHeaderProps) {
  return (
    <div className="border-b border-gray-400 pb-5 dark:border-gray-200">
      <div className="sm:flex sm:items-baseline sm:justify-between">
        <div className="sm:w-0 sm:flex-1">
          <h1
            id="message-heading"
            className="text-2xl font-semibold leading-6 text-gray-800 dark:text-gray-100"
          >
            {minute.title}
          </h1>
          <p className="mt-1 truncate text-lg text-gray-700 dark:text-gray-500">
            {`${minute.author.first_name} ${minute.author.last_name}`}
          </p>
        </div>

        <div className={'flex justify-end gap-4'}>
          <Button variant={'secondary'} onClick={onEdit}>
            Rediger
          </Button>
          <Button variant={'destructive'} onClick={onDelete}>
            Slett
          </Button>
        </div>
      </div>
    </div>
  );
}
