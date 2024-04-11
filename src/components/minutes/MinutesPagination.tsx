import { PagedResponse, PaginationRequest } from '@/auth/types';

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
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700 dark:text-slate-100">
          Viser side <span className="font-medium">{pagination.page}</span> med{' '}
          <span className="font-medium">{minutePosts.count}</span>{' '}
          {minutePosts.count === 0 || minutePosts.count > 1
            ? 'resultater'
            : 'resultat'}
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        {minutePosts.previous && (
          <a
            href="#"
            className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
            onClick={onPrevious}
          >
            Previous
          </a>
        )}
        {minutePosts.next && (
          <a
            href="#"
            className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
            onClick={onNext}
          >
            Next
          </a>
        )}
      </div>
    </nav>
  );
}
