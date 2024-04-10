import { Button } from '@/components/Button';

interface MinutesListHeaderProps {
  onCreate: () => void;
}

export default function MinutesListHeader({
  onCreate,
}: MinutesListHeaderProps) {
  return (
    <div className="bg-slate-900 px-4 py-5 sm:px-6">
      <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div className="ml-4 mt-2">
          <a
            href={'/'}
            className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100"
          >
            CODEX / Dokumenter
          </a>
        </div>
        <div className="ml-4 mt-2 flex-shrink-0">
          <Button onClick={onCreate} type="button">
            Nytt dokument
          </Button>
        </div>
      </div>
    </div>
  );
}
