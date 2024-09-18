"use client";

import { getUsers } from "@/auth/tihlde";
import { User } from "@/auth/types";
import { useDebounce } from "@/lib/hooks";
import { FormikProps } from "formik";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";


export interface UserSearchProps<T extends Record<string, unknown>> {
    formik: FormikProps<T>;
    field: keyof T;
    name: string;
    className?: string;
};

export function UserSearch<T extends Record<string, unknown>>({
    formik,
    field,
    name,
    className
}: UserSearchProps<T>) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [user, setUser] = useState<User>();
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState<string>('');
    const debouncedSearch = useDebounce(search, 500);

    const session = useSession();
    const token = useMemo(() => session.data?.user?.tihldeUserToken ?? '', [session]);

    const searchUser = async () => {
        const users = await getUsers(token, debouncedSearch);
        setUsers(users);
    };

    useEffect(() => {
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
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"
                onClick={handleExpand}
            >
                <div 
                    className="max-w-2xl w-full mx-auto bg-slate-700 p-4 rounded-md shadow-lg z-20 py-4 px-6 space-y-4"
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
                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 bg-slate-700 text-white px-3 cursor-pointer"
                            type="text"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div>
                        {user && (
                            <div>
                                <p>
                                    {user.first_name} {user.last_name}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        {users.map((u) => (
                            <div 
                                key={u.user_id}
                                className="flex items-center justify-between px-2 py-1.5 bg-slate-800 rounded-md cursor-pointer"
                                onClick={() => {
                                    setUser(u);
                                    formik.setFieldValue(field as string, u.user_id);
                                }}
                            >
                                <p className="text-white">{u.first_name} {u.last_name}</p>
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
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 bg-slate-700 text-white px-3 cursor-pointer"
                onClick={handleExpand}
            >
                {user
                ? user.first_name + ' ' + user.last_name
                : "Velg en bruker"
                }
            </div>
            </div>
        </div>
    );
};