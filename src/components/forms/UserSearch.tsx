'use client';

import { getUsers } from '@/auth/tihlde';
import { User } from '@/auth/types';
import { useDebounce } from '@/lib/hooks';
import { FormikProps } from 'formik';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';

export interface UserSearchProps<T extends Record<string, unknown>> {
  formik: FormikProps<T>;
  field: keyof T;
  name: string;
  className?: string;
  placeholderUser?: User;
}

export function UserSearch<T extends Record<string, unknown>>({
  formik,
  field,
  name,
  className,
  placeholderUser,
}: UserSearchProps<T>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(placeholderUser ?? null);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);

  const session = useSession();
  const token = useMemo(
    () => session.data?.user?.tihldeUserToken ?? '',
    [session],
  );

  const searchUser = async () => {
    const users = await getUsers(token, debouncedSearch);
    setUsers(users);
  };

  useEffect(() => {
    if (debouncedSearch.length === 0) {
      setUsers([]);
    }

    if (debouncedSearch) {
      searchUser();
    }
  }, [debouncedSearch]);

  const handleExpand = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <div className={className} onClick={(e) => e.stopPropagation()}>
      {isOpen && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-70"
          onClick={handleExpand}
        >
          <div
            className="z-20 mx-auto min-h-96 w-full max-w-2xl space-y-4 rounded-md border border-gray-300 bg-white p-4 px-6 py-4 shadow-lg dark:border-slate-800 dark:bg-slate-950"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <label
                htmlFor={field as string}
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Søk etter bruker
              </label>
              <input
                id={field as string}
                name={field as string}
                className="block w-full cursor-pointer rounded-md border-0 bg-white px-3 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 dark:bg-slate-950 dark:text-white dark:ring-slate-800"
                type="text"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="h-0.5 w-full rounded-md bg-gray-200 dark:bg-slate-900" />

            <div className="space-y-2">
              {users.map((u) => (
                <div
                  key={u.user_id}
                  className="flex cursor-pointer items-center justify-between rounded-md border border-gray-300 bg-white px-2 py-1.5 dark:border-slate-800 dark:bg-slate-950"
                  onClick={() => {
                    handleExpand();
                    formik.setFieldValue(field as string, u.user_id);
                    setUser(u);
                    setUsers([]);
                  }}
                >
                  <p className="dark:text-white">
                    {u.first_name} {u.last_name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <label
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
        htmlFor={field as string}
      >
        {name}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <div
          className="block w-full cursor-pointer rounded-md border-0 px-3 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-slate-600 dark:placeholder:text-gray-400"
          onClick={handleExpand}
        >
          {user ? user.first_name + ' ' + user.last_name : 'Velg en bruker'}
        </div>
      </div>
    </div>
  );
}
