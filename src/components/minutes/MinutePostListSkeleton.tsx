import clsx from 'clsx';
import { ClockIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { Skeleton } from '@/components/minutes/MinutePostSkeleton';

export default function MinutesPostListSkeleton() {
  return (
    <ul role="list" className="divide-y divide-white/5">
      <SkeletonListTile />
      <SkeletonListTile />
      <SkeletonListTile />
      <SkeletonListTile />
      <SkeletonListTile />
      <SkeletonListTile />
      <SkeletonListTile />
      <SkeletonListTile />
      <SkeletonListTile />
      <SkeletonListTile />
      <SkeletonListTile />
      <SkeletonListTile />
      <SkeletonListTile />
      <SkeletonListTile />
      <SkeletonListTile />
    </ul>
  );
}

function SkeletonListTile() {
  return (
    <li
      className={clsx(
        'relative flex items-center space-x-4 rounded-md px-2 py-4',
      )}
    >
      <div className="min-w-0 flex-auto">
        <div className="flex items-center gap-x-3">
          <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
            <span className="flex items-center gap-x-2">
              <span className="truncate text-lg">
                <Skeleton className={'h-5 w-[200px]'} />
              </span>
              <span className="text-gray-400">/</span>
              <span className="whitespace-nowrap text-gray-300">
                <Skeleton className={' h-5 w-[120px]'} />
              </span>
              <span className="absolute inset-0" />
            </span>
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
          <div className="inline-flex items-center gap-1 truncate">
            <ClockIcon className={'h-4 w-4'} aria-hidden="true" />
            <Skeleton className={'inline h-3 w-[100px]'} />
          </div>
          <svg
            viewBox="0 0 2 2"
            className="h-0.5 w-0.5 flex-none fill-gray-300"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          <div className="flex items-center gap-2 whitespace-nowrap">
            Sist oppdatert <Skeleton className={'h-3 w-[30px]'} />
          </div>
        </div>
      </div>
      <div
        className={clsx(
          'flex-none rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
        )}
      >
        <Skeleton className={'h-5 w-[60px]'} />
      </div>
      <ChevronRightIcon
        className="h-5 w-5 flex-none text-gray-400"
        aria-hidden="true"
      />
    </li>
  );
}
