"use client";

import type { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import type { FormikProps } from 'formik';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import clsx from 'clsx';

export interface TextAreaFieldProps<T extends Record<string, unknown>>
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  formik: FormikProps<T>;
  field: keyof T;
  name: string;
}

export function TextAreaField<T extends Record<string, unknown>>({
  field,
  formik,
  name,
  ...props
}: TextAreaFieldProps<T>) {
  const isError = formik.errors[field] && formik.touched[field];
  return (
    <div className={props.className}>
      <label
        htmlFor={field as string}
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
      >
        {name}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <textarea
          {...props}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[field] as string}
          name={field as string}
          id={field as string}
          className={clsx(props.className, {
            [`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-slate-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6`]:
              !isError,
            [`sm:leading-6 block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm`]:
              isError,
            'dark:bg-slate-900 dark:text-white': true
          })}
        />
        {isError && (
          <div className="pointer-events-none absolute inset-y-0 right-0 top-2 pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {isError && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {formik.errors[field] as string}
        </p>
      )}
    </div>
  );
}
