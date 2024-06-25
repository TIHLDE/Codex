import React from 'react';
import { SingleMinutesPostResponse } from '@/auth/types';
import MinutesContentHeader from '@/components/minutes/MinutesContentHeader';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

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
          <Markdown
            components={{
              h1: H1,
              h2: H2,
              h3: H3,
              strong: Strong,
              ol: Ol,
              ul: Ul,
            }}
            rehypePlugins={[rehypeRaw]}
          >
            {minute.content}
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
function Ol({ children }: { children?: React.ReactNode }) {
  return <ol className={'ml-2 list-inside list-decimal'}>{children}</ol>;
}
function Ul({ children }: { children?: React.ReactNode }) {
  return <ul className={'ml-2 list-inside list-disc'}>{children}</ul>;
}
