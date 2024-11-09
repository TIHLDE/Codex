import { EventTag as EventTagType } from '@/auth/types';
import clsx from 'clsx';

interface EventTagProps {
  tag: EventTagType;
}

export const EventTag = ({ tag }: EventTagProps) => {
  const getColor = () => {
    switch (tag) {
      case 'Lecture':
        return 'bg-sky-500';
      case 'Workshop':
        return 'bg-emerald-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getText = () => {
    switch (tag) {
      case 'Lecture':
        return 'Foredrag';
      case 'Workshop':
        return 'Workshop';
      default:
        return 'Ukjent';
    }
  };

  return (
    <div className={clsx(`rounded-md px-2 py-1 text-white`, getColor())}>
      <p className="text-xs">{getText()}</p>
    </div>
  );
};
