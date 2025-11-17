'use client';

import Image from 'next/image';
import logo from '@/images/logo.png';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { env } from '@/lib/env';

const validationSchema = yup.object({
  username: yup.string().required('Brukernavn må fylles ut'),
  password: yup.string().required('Passord må fylles ut '),
});

type FormValues = yup.InferType<typeof validationSchema>;

const initialValues = {
  username: '',
  password: '',
} satisfies FormValues;

export default function SigninPage() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.data?.user?.tihldeUserToken) {
      router.replace('/');
    }
  }, [session, router]);

  const onSubmit = async (values: FormValues) => {
    const response = await signIn('credentials', {
      username: values.username,
      password: values.password,
      redirect: false,
    });

    if (response?.error) {
      const groups = env.NEXT_PUBLIC_ALLOWED_GROUP_SLUGS.map(
        (group) => group[0].toUpperCase() + group.slice(1),
      ).join('/');

      formik.setErrors({
        username: `Feil brukernavn eller passord, eller ikke med i ${groups}`,
      });
    }
  };

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit,
  });

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image src={logo} className="mx-auto h-10 w-auto" alt="Codex" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
            Logg inn til Codex
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Brukernavn (TIHLDE)
              </label>
              <div className="mt-2">
                <input
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  id="username"
                  name="username"
                  type="username"
                  autoComplete="username"
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-700 dark:focus:ring-blue-200"
                  formNoValidate
                />
                {formik.errors.username && formik.touched.username && (
                  <p className="mt-2 text-sm text-red-500">
                    {formik.errors.username}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Passord
                </label>
              </div>
              <div className="mt-2">
                <input
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-700 dark:focus:ring-blue-200"
                  formNoValidate
                />
                {formik.errors.password && formik.touched.password && (
                  <p className="mt-2 text-sm text-red-500">
                    {formik.errors.password}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {formik.isSubmitting ? 'Logger deg inn ...' : 'Logg inn'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
