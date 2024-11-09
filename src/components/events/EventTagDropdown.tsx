/*
  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { useState } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Combobox } from '@headlessui/react';
import { EventTag, eventTags } from '@/auth/types';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export interface EventTagDropdownProps {
  value?: EventTag;
  onChange: (value: EventTag) => void;
}

export default function EventTagDropdown({
  value,
  onChange,
}: EventTagDropdownProps) {
  const [query, setQuery] = useState('');

  const filteredTags =
    query === ''
      ? eventTags
      : eventTags.filter((tag) => {
          return tag.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox as="div" value={value} onChange={onChange}>
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">
        Tag
      </Combobox.Label>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-gray-100 dark:ring-slate-600"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(tag: EventTag) => tag}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredTags.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-slate-900">
            {filteredTags.map((tag) => (
              <Combobox.Option
                key={tag}
                value={tag}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active
                      ? 'bg-sky-500 text-white dark:bg-sky-700 dark:text-slate-100'
                      : 'text-gray-900 dark:text-slate-200',
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        'block truncate',
                        selected ? 'font-semibold' : '',
                      )}
                    >
                      {tag}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-sky-300',
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
