'use client';

import MinutesList from './minutesList';
import MinutesContent from '@/app/(private)/minutes/minutesContent';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';

export default function MinutesPage() {
  const [selectedMinuteId, setSelectedMinuteId] = useState<number | null>(null);

  return (
    <SessionProvider>
      <main className="flex h-full w-full flex-row gap-4 p-4">
        <MinutesList
          onSelect={setSelectedMinuteId}
          selectedPostId={selectedMinuteId}
        />
        <MinutesContent selectedMinuteId={selectedMinuteId} />
      </main>
    </SessionProvider>
  );
}
