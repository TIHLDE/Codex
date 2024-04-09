import MinutesList from './minutesList';
import MinutesContent from '@/app/(private)/minutes/minutesContent';

export default function MinutesPage() {
  return (
    <main className="flex h-full w-full flex-row gap-4 p-4">
      <MinutesList
        onSelect={function (postId: number): void {
          throw new Error('Function not implemented.');
        }}
        selectedPostId={1}
      />
      <MinutesContent selectedMinuteId={1} />
    </main>
  );
}
