'use client';

import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
// @ts-ignore
import { gitData } from '@/markdoc/with-git-reflection.mjs';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const formatDate = (date: Date): string => {
  return format(date, 'd. MMM yyyy', { locale: nb });
};

interface GitInfo {
  updatedByAuthor: string;
  updatedDateIso: string;
  updatedMessage: string;
  createdByAuthor: string;
  createdDateIso: string;
  createdMessage: string;
}

export default function GitInfo() {
  const pathName = usePathname();
  const git = useMemo(() => gitData[pathName], [pathName]);

  if (
    !git?.createdByAuthor ||
    !git?.updatedByAuthor ||
    !git?.createdDateIso ||
    !git?.updatedDateIso
  ) {
    return null;
  }

  return (
    <dl className="mb-5 grid w-full grid-cols-2 gap-5 sm:grid-cols-2 ">
      {[
        {
          title: 'Sist oppdatert',
          author: git.updatedByAuthor,
          date: new Date(git.updatedDateIso),
        },
        {
          title: 'Opprettet',
          author: git.createdByAuthor,
          date: new Date(git.createdDateIso),
        },
      ].map((item) => (
        <div
          key={item.title}
          className="overflow-hidden rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-transparent"
        >
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            {item.title}
          </dt>
          <dd className="text-base font-medium tracking-tight text-gray-900 dark:text-gray-200">
            {formatDate(item.date)}{' '}
            <span className="text-sm font-normal"> av {item.author}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
