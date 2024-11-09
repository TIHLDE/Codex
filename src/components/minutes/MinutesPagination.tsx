import { PagedResponse, PaginationRequest } from '@/auth/types';
import { Button } from '@/components/ui/Button';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/16/solid';

interface MinutesPaginationProps {
  minutePosts?: PagedResponse | null;
  onNext: () => void;
  onPrevious: () => void;
  pagination: PaginationRequest;
}

export default function MinutesPagination({
  pagination,
  minutePosts,
  onPrevious,
  onNext,
}: MinutesPaginationProps) {
  if (!minutePosts) {
    return null;
  }

  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:bg-slate-900"
      aria-label="Pagination"
    >
      <div className="flex flex-1 items-center justify-center gap-4 ">
        {minutePosts.previous && (
          <Button onClick={onPrevious} variant={'secondary'}>
            <ArrowLeftIcon
              className={'h-5 w-5 text-slate-900 dark:text-slate-100'}
            />
          </Button>
        )}
        <p className="text-sm text-gray-700 dark:text-slate-100">
          Viser side{' '}
          <span className="font-medium">{pagination.page ?? '0'}</span> med{' '}
          <span className="font-medium">{minutePosts.results.length}</span>{' '}
          {minutePosts.count === 0 || minutePosts.count > 1
            ? 'resultater'
            : 'resultat'}{' '}
          av <span className="font-medium">{minutePosts.count}</span>{' '}
        </p>
        {minutePosts.next && (
          <Button onClick={onNext} variant={'secondary'}>
            <ArrowRightIcon
              className={'h-5 w-5 text-slate-900 dark:text-slate-100'}
            />
          </Button>
        )}
      </div>
    </nav>
  );
}
