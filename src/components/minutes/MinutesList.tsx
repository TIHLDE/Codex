import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { formatDate, formatRelative } from 'date-fns';
import { nb } from 'date-fns/locale';
import { ClockIcon } from '@heroicons/react/24/outline';
import { MinuteOrdering, PagedResponse, PaginationRequest } from '@/auth/types';
import clsx from 'clsx';
import { Button } from '@/components/Button';
import { useState } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Combobox } from '@headlessui/react';
import { ArrowLeftIcon, BarsArrowDownIcon } from '@heroicons/react/16/solid';
import MinutesPostListSkeleton from '@/components/minutes/MinutePostListSkeleton';
import MinutesPagination from '@/components/minutes/MinutesPagination';
import Link from 'next/link';

const tagStyles = {
  ['Møtereferat']:
    'text-gray-700 dark:text-gray-400 bg-gray-400/10 ring-gray-400/20',
  ['Dokument']: 'text-sky-700 dark:text-sky-400 bg-sky-400/10 ring-sky-400/30',
};

export interface MinutesListProps {
  onSelect: (postId: number) => void;
  selectedPostId: number | null;
  onCreate: () => void;
  minutePosts: PagedResponse | null;
  isLoading: boolean;
  onChangePagination: (options: PaginationRequest) => void;
  pagination: PaginationRequest;
  onNext: () => void;
  onPrevious: () => void;
}

export default function MinutesList({
  onPrevious,
  onNext,
  onSelect,
  onCreate,
  selectedPostId,
  minutePosts,
  onChangePagination,
  pagination,
  isLoading,
}: MinutesListProps) {
  return (
    <div className="flex max-h-[calc(100svh-2rem)] max-w-xl w-full flex-col overflow-y-scroll px-2">
      <div className="flex flex-col gap-3 py-5 sm:px-2 dark:bg-slate-900">
        <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <Link
              href={'/'}
              className="flex flex-row items-center text-base font-semibold leading-6 text-gray-900 dark:text-gray-100"
            >
              <ArrowLeftIcon className='mr-2 inline h-5 w-5' /> CODEX /
              Dokumenter
            </Link>
          </div>
          <div className="ml-4 mt-2 flex-shrink-0">
            <Button onClick={onCreate} type="button">
              Nytt dokument
            </Button>
          </div>
        </div>
        <div className={'flex w-full flex-row flex-wrap gap-3'}>
          <div className={'flex w-full items-end gap-2'}>
            <SearchField
              value={pagination.search ?? ''}
              onChange={(value) =>
                onChangePagination({
                  ...pagination,
                  search: value,
                })
              }
            />
            <SortingDropdown
              onChange={(field) =>
                onChangePagination({
                  ...pagination,
                  ordering: field.id,
                })
              }
              field={sortingOptions.find((s) => s.id === pagination.ordering)!}
            />
            <Button
              variant={'secondary'}
              onClick={() =>
                onChangePagination({
                  ...pagination,
                  ascending: !pagination.ascending,
                })
              }
            >
              <BarsArrowDownIcon
                className={clsx(
                  'h-5 w-5 text-slate-800 duration-200 dark:text-slate-100',
                  pagination.ascending ? 'rotate-180' : '',
                )}
              />
            </Button>
          </div>
        </div>
      </div>
      {Boolean(minutePosts) && !isLoading ? (
        <>
          <ul
            role="list"
            className="divide-black/4 divide-y dark:divide-white/5"
          >
            {minutePosts!.results.map((minute) => (
              <li
                onClick={() => onSelect(minute.id)}
                key={minute.id}
                className={clsx(
                  'relative flex cursor-pointer items-center space-x-4 rounded-md px-2 py-4' +
                  ' hover:bg-slate-100 dark:hover:bg-slate-700',
                  selectedPostId === minute.id
                    ? 'bg-slate-200 dark:bg-slate-800'
                    : '',
                )}
              >
                <div className="min-w-0 flex-auto">
                  <div className="flex items-center gap-x-3">
                    <h2 className="min-w-0 text-sm font-semibold leading-6 text-slate-800 dark:text-white">
                      <span className="flex items-center gap-x-2">
                        <span className="truncate text-lg">{minute.title}</span>
                        <span className="absolute inset-0" />
                      </span>
                    </h2>
                  </div>
                  <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-800 dark:text-gray-400">
                    <p className="inline-flex items-center gap-1 truncate">
                      <ClockIcon
                        className={'min-h-4 min-w-4'}
                        aria-hidden="true"
                      />
                      {formatDate(minute.created_at, 'HH:mm' + ' dd.MM.yy', {
                        locale: nb,
                      })}
                    </p>
                    <svg
                      viewBox="0 0 2 2"
                      className="h-0.5 w-0.5 flex-none fill-gray-700 dark:fill-gray-300"
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
                  className={clsx(
                    tagStyles[minute.tag],
                    'flex-none rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
                  )}
                >
                  {minute.tag}
                </div>
                <ChevronRightIcon
                  className="h-5 w-5 flex-none text-gray-700 dark:text-gray-400"
                  aria-hidden="true"
                />
              </li>
            ))}
          </ul>
          <MinutesPagination
            minutePosts={minutePosts}
            onNext={onNext}
            onPrevious={onPrevious}
            pagination={pagination}
          />
        </>
      ) : (
        <MinutesPostListSkeleton />
      )}
    </div>
  );
}

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchField({ value, onChange }: SearchFieldProps) {
  return (
    <div>
      <label
        htmlFor="search"
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
      >
        Søk
      </label>
      <div className="relative mt-2 flex items-center">
        <input
          onChange={(e) => onChange(e.target.value)}
          value={value}
          type="text"
          name="search"
          id="search"
          className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white"
        />
        {/*<div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">*/}
        {/*  <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">*/}
        {/*    ⌘K*/}
        {/*  </kbd>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}

type SortOption = { id: MinuteOrdering; name: string };
const sortingOptions: SortOption[] = [
  { id: 'title', name: 'Tittel' },
  { id: 'tag', name: 'Tag' },
  { id: 'author', name: 'Forfatter' },
  { id: 'updated_at', name: 'Sist oppdatert' },
  { id: 'created_at', name: 'Opprettet' },
];

interface SortingDropdownProps {
  onChange: (field: SortOption) => void;
  field: SortOption;
}

function SortingDropdown({ onChange, field }: SortingDropdownProps) {
  const [query, setQuery] = useState('');

  const filtered =
    query === ''
      ? sortingOptions
      : sortingOptions.filter((person) => {
        return person.name.toLowerCase().includes(query.toLowerCase());
      });

  return (
    <Combobox as="div" value={field} onChange={onChange}>
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-100">
        Sorter etter
      </Combobox.Label>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(sort: SortOption) => sort.name}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filtered.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-slate-800">
            {filtered.map((field) => (
              <Combobox.Option
                key={field.id}
                value={field}
                className={({ active }) =>
                  clsx(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active
                      ? 'bg-sky-600 text-white'
                      : 'text-gray-800 dark:text-gray-100',
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={clsx(
                        'block truncate',
                        selected ? 'font-semibold' : '',
                      )}
                    >
                      {field.name}
                    </span>

                    {selected && (
                      <span
                        className={clsx(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-sky-600',
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
