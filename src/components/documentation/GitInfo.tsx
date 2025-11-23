'use client';

import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
// @ts-ignore
import { gitData } from '@/markdoc/with-git-reflection.mjs';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import Link from 'next/link';

const formatDate = (date: Date): string => {
  return format(date, 'd. MMM yyyy', { locale: nb });
};

interface GitInfo {
  updatedByAuthor: string;
  updatedDateIso: string;
  updatedMessage: string;
  updatedHash: string;
  createdByAuthor: string;
  createdDateIso: string;
  createdMessage: string;
  createdHash: string;
}

export default function GitInfo() {
  const pathName = usePathname();
  const git = useMemo(() => gitData[pathName] as GitInfo, [pathName]);

  if (
    !git?.createdByAuthor ||
    !git?.updatedByAuthor ||
    !git?.createdDateIso ||
    !git?.updatedDateIso ||
    !git?.createdMessage ||
    !git?.updatedMessage ||
    !git?.createdHash ||
    !git?.updatedHash
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
          hash: git.updatedHash,
        },
        {
          title: 'Opprettet',
          author: git.createdByAuthor,
          date: new Date(git.createdDateIso),
          hash: git.createdHash,
        },
      ].map((item) => (
        <div
          key={item.title}
          className="flex items-center justify-between overflow-hidden rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-transparent"
        >
          <div>
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              {item.title}
            </dt>
            <dd className="text-base font-medium tracking-tight text-gray-900 dark:text-gray-200">
              {formatDate(item.date)}{' '}
              <span className="text-sm font-normal"> av {item.author}</span>
            </dd>
          </div>
          <Link
            href={`https://github.com/TIHLDE/Codex/commit/${item.hash}`}
            className="text-sm font-light underline underline-offset-2"
          >
            {item.hash.substring(0, 7)}
          </Link>
        </div>
      ))}
    </dl>
  );
}
