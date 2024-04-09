import { getMinutesPost } from '@/auth/tihlde';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { SingleMinutesPostResponse } from '@/auth/types';
import MinutesContentHeader from '@/app/(private)/minutes/minutesContentHeader';
import Markdown from 'react-markdown';

export interface MinutesContentProps {
  selectedMinuteId: number | null;
}
export default function MinutesContent({
  selectedMinuteId,
}: MinutesContentProps) {
  const session = useSession();
  const [minutesPost, setMinutesPost] =
    useState<SingleMinutesPostResponse | null>(null);

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
      {minutesPost && <MinutesContentHeader minute={minutesPost} />}
      {minutesPost && (
        <div className={'my-3'}>
          <Markdown
            components={{
              h1: H1,
              h2: H2,
              h3: H3,
              strong: Strong,
            }}
          >
            {minutesPost.content}
          </Markdown>
        </div>
      )}
    </main>
  );
}

function H1({ children }: { children?: React.ReactNode }) {
  return <h1 className={'text-2xl font-bold'}>{children}</h1>;
}
function H2({ children }: { children?: React.ReactNode }) {
  return <h1 className={'text-xl font-bold'}>{children}</h1>;
}
function H3({ children }: { children?: React.ReactNode }) {
  return <h1 className={'text-lg font-bold'}>{children}</h1>;
}
function Strong({ children }: { children?: React.ReactNode }) {
  return <strong className={'font-bold'}>{children}</strong>;
}
