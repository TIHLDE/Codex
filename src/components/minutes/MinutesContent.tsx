import React from 'react';
import { SingleMinutesPostResponse } from '@/auth/types';
import MinutesContentHeader from '@/components/minutes/MinutesContentHeader';
import { MarkdownRenderer } from '../content/MarkdownRenderer';

export interface MinutesContentProps {
  minute: SingleMinutesPostResponse | null;
  onEdit: () => void;
  onDelete: () => void;
}
export default function MinutesContent({
  minute,
  onDelete,
  onEdit,
}: MinutesContentProps) {
  return (
    <main
      className={
        'h-full w-full rounded-lg bg-slate-100 p-4 lg:h-[calc(100svh-2rem)] dark:bg-slate-800 overflow-y-scroll'
      }
    >
      {minute && (
        <MinutesContentHeader
          minute={minute}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      {minute && (
        <div className={'my-3'}>
          <MarkdownRenderer content={minute.content} />
        </div>
      )}
    </main>
  );
};
