import { ChevronRightIcon } from '@heroicons/react/20/solid';
import MinutesListHeader from './minutesListHeader';
import { useSession } from 'next-auth/react';
import { formatDate, formatRelative } from 'date-fns';
import { nb } from 'date-fns/locale';
import { ClockIcon } from '@heroicons/react/24/outline';
import { PagedResponse } from '@/auth/types';

const tagStyles = {
  ['Møtereferat']: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
  ['Dokument']: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export interface MinutesListProps {
  onSelect: (postId: number) => void;
  selectedPostId: number | null;
  onCreate: () => void;
  minutePosts: PagedResponse | null;
  isLoading: boolean;
}

export default function MinutesList({
  onSelect,
  selectedPostId,
  onCreate,
  isLoading,
  minutePosts,
}: MinutesListProps) {
  const session = useSession({
    required: true,
  });

  if (isLoading || !minutePosts) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="flex w-full max-w-md flex-col">
      <MinutesListHeader onCreate={onCreate} />
      <ul role="list" className="divide-y divide-white/5">
        {minutePosts.results.map((minute) => (
          <li
            onClick={() => onSelect(minute.id)}
            key={minute.id}
            className="relative flex cursor-pointer items-center space-x-4 rounded-md px-2 py-4 hover:bg-slate-800"
          >
            <div className="min-w-0 flex-auto">
              <div className="flex items-center gap-x-3">
                <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                  <span className="flex items-center gap-x-2">
                    <span className="truncate text-lg">{minute.title}</span>
                    <span className="text-gray-400">/</span>
                    <span className="whitespace-nowrap text-gray-300">
                      {`${minute.author.first_name} ${minute.author.last_name}`}
                    </span>
                    <span className="absolute inset-0" />
                  </span>
                </h2>
              </div>
              <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                <p className="inline-flex items-center gap-1 truncate">
                  <ClockIcon className={'h-4 w-4'} aria-hidden="true" />
                  {formatDate(minute.created_at, 'HH:mm' + ' dd.MM.yy', {
                    locale: nb,
                  })}
                </p>
                <svg
                  viewBox="0 0 2 2"
                  className="h-0.5 w-0.5 flex-none fill-gray-300"
                >
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <p className="whitespace-nowrap">
                  Sist oppdatert{' '}
                  {formatRelative(minute.updated_at, new Date(), {
                    locale: nb,
                  })}
                </p>
              </div>
            </div>
            <div
              className={classNames(
                tagStyles[minute.tag],
                'flex-none rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
              )}
            >
              {minute.tag}
            </div>
            <ChevronRightIcon
              className="h-5 w-5 flex-none text-gray-400"
              aria-hidden="true"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
