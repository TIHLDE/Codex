'use client';

import { Registration } from '@/auth/types';
import { useState } from 'react';

interface EventRegistrationsProps {
  registrations: Registration[];
  numberOfRegistrations: number;
}

interface AvatarProps {
  registration: Registration;
}

export const EventRegistrations = ({
  registrations,
  numberOfRegistrations,
}: EventRegistrationsProps) => {
  const USER_LIMIT = 5;
  const [expandRegistrations, setExpandRegistrations] =
    useState<boolean>(false);

  if (registrations.length === 0) {
    return <p className="text-center text-sm">Ingen påmeldinger</p>;
  }

  const Avatar = ({ registration }: AvatarProps) => {
    return (
      <div>
        {registration.user_info.image ? (
          <img
            src={registration.user_info.image}
            alt={registration.user_info.first_name}
            className="h-10 w-10 rounded-full border border-gray-300"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-800 bg-sky-950">
            <p className="text-sm font-semibold text-white">
              {registration.user_info.first_name[0]}
            </p>
            <p className="text-sm font-semibold text-white">
              {registration.user_info.last_name[0]}
            </p>
          </div>
        )}
      </div>
    );
  };

  const toggleAllRegistrations = () => {
    setExpandRegistrations(!expandRegistrations);
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        <div className="flex items-center space-x-1">
          {registrations.slice(0, USER_LIMIT).map((registration) => (
            <Avatar
              key={registration.registration_id}
              registration={registration}
            />
          ))}
        </div>
        {numberOfRegistrations > USER_LIMIT && (
          <p
            onClick={toggleAllRegistrations}
            className="cursor-pointer self-center text-sm text-slate-500 hover:text-sky-500"
          >
            {!expandRegistrations
              ? `+${numberOfRegistrations - USER_LIMIT} til`
              : 'Skjul'}
          </p>
        )}
      </div>

      <div>
        {expandRegistrations && (
          <div className="space-y-2">
            {registrations.slice(USER_LIMIT).map((registration) => (
              <div
                key={registration.registration_id}
                className="flex items-center space-x-2 rounded-md border border-slate-600 p-2"
              >
                <Avatar
                  key={registration.registration_id}
                  registration={registration}
                />
                <p className="text-sm">
                  {registration.user_info.first_name}{' '}
                  {registration.user_info.last_name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
