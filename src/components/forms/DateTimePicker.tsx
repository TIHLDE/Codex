import type { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import type { FormikProps } from 'formik';
import clsx from 'clsx';


export interface DateTimePicerProps<T extends Record<string, unknown>>
    extends DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
        formik: FormikProps<T>;
        field: keyof T;
        name: string;
    }


export const DateTimePicker = <T extends Record<string, unknown>>({
    field,
    formik,
    name,
    ...props
}: DateTimePicerProps<T>) => {
    const isError = formik.errors[field] && formik.touched[field];

    return (
        <div className={props.className}>
            <label
                className='block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100'
                htmlFor={field as string}
            >
                {name}
            </label>
            <div className='relative mt-2 rounded-md shadow-sm'>
                <input
                    className={clsx({
                        'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6':
                            !isError,
                        'sm:leading-6 block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm':
                            isError,
                        'bg-slate-700 text-white': true,
                    })}
                    type='datetime-local'
                    name={field as string}
                    id={field as string}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values[field] as string}
                />
            </div>
            {isError && (
                <p className='mt-2 text-sm text-red-600' id='datetimepicker-error'>
                    {formik.errors[field] as string}
                </p>
            )}
        </div>
    );
};