import Link from 'next/link';
import clsx from 'clsx';

const variantStyles = {
  primary:
    'rounded-lg bg-sky-700 py-2 px-4 text-sm font-semibold text-white hover:bg-sky-600' +
    ' focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/50 active:bg-sky-500',
  secondary:
    ' text-gray-800 rounded-lg ring-1 ring-gray-300 dark:ring-none dark:bg-slate-800 py-2 px-4' +
    ' text-sm' +
    ' font-medium' +
    ' dark:text-white' +
    ' hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:outline-2' +
    ' focus-visible:outline-offset-2 focus-visible:outline-white/50 active:text-slate-400',
  destructive:
    'rounded-lg bg-red-500 py-2 px-4 text-sm font-medium text-white hover:bg-red-400' +
    ' focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2' +
    ' focus-visible:outline-white/50 active:text-red-400',
  submit:
    'rounded-lg bg-emerald-500 dark:bg-emerald-600 py-2 px-4 text-sm font-medium text-white hover:bg-emerald-400 dark:hover:bg-emerald-500' +
    ' focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2' +
    ' focus-visible:outline-white/50 active:text-emerald-400',
};

type ButtonProps = {
  variant?: keyof typeof variantStyles;
} & (
    | React.ComponentPropsWithoutRef<typeof Link>
    | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
  );

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  className = clsx(variantStyles[variant], className);

  return typeof props.href === 'undefined' ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  );
}
