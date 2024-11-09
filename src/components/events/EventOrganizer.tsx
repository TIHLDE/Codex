import { MinuteGroup } from '@/auth/types';
import clsx from 'clsx';

interface EventOrganizerProps {
  organizer: MinuteGroup;
}

export const EventOrganizer = ({ organizer }: EventOrganizerProps) => {
  const getColor = () => {
    switch (organizer) {
      case 'Index':
        return 'bg-orange-500';
      case 'Drift':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={clsx(`rounded-lg px-2 py-1 text-white`, getColor())}>
      <p className="text-xs">{organizer}</p>
    </div>
  );
};
