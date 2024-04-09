'use client';

import { getMinutesPost } from '@/auth/tihlde';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { MinutesPostResponse } from '@/auth/types';

export interface MinutesContentProps {
  selectedMinuteId: number | null;
}
export default function MinutesContent({
  selectedMinuteId,
}: MinutesContentProps) {
  const session = useSession();
  const [minutesPost, setMinutesPost] = useState<MinutesPostResponse | null>(
    null,
  );

  useEffect(() => {
    if (!session?.data?.user?.tihldeUserToken) return;

    if (!selectedMinuteId) {
      setMinutesPost(null);
    } else {
      getMinutesPost(session.data.user.tihldeUserToken, selectedMinuteId).then(
        setMinutesPost,
      );
    }
  }, [selectedMinuteId, session]);

  return (
    <main
      className={
        'h-full w-full rounded-lg bg-slate-800 p-4 lg:h-[calc(100svh-2rem)]'
      }
    >
      {minutesPost && <h1>{minutesPost.title}</h1>}
    </main>
  );
}
