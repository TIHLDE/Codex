import clsx from 'clsx';

export default function MinutePostSkeleton() {
  return (
    <main
      className={
        'h-full w-full rounded-lg bg-slate-800 p-4 lg:h-[calc(100svh-2rem)]'
      }
    >
      <div className="border-b border-gray-200 pb-5">
        <div className="sm:flex sm:items-baseline sm:justify-between">
          <div className="sm:w-0 sm:flex-1">
            <h1
              id="message-heading"
              className="text-2xl font-semibold leading-6 text-gray-100"
            >
              <Skeleton className={'h-7 w-64'} />
            </h1>
            <p className="mt-1 truncate text-lg text-gray-500">
              <Skeleton className={'h-5 w-44'} />
            </p>
          </div>
        </div>
      </div>
      <div className={'my-3 flex flex-col gap-3'}>
        <Skeleton className={'h-7 w-[200px]'} />
        <Skeleton className={'h-5 w-[150px]'} />
        <Skeleton className={'h-5 w-[320px]'} />
        <Skeleton className={'mb-5 h-5 w-[220px]'} />
        <Skeleton className={'h-7 w-[120px]'} />
        <Skeleton className={'h-5 w-[520px]'} />
        <Skeleton className={'h-5 w-[120px]'} />
        <Skeleton className={'h-5 w-[440px]'} />
        <Skeleton className={'h-5 w-[340px]'} />
        <Skeleton className={'h-5 w-[220px]'} />
        <Skeleton className={'h-5 w-[620px]'} />
        <Skeleton className={'h-5 w-[440px]'} />
        <Skeleton className={'h-5 w-[540px]'} />
      </div>
    </main>
  );
}

export function Skeleton({ className }: { className: string }) {
  return (
    <div className={clsx('animate-pulse rounded-md bg-slate-600', className)} />
  );
}
