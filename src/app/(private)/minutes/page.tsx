'use client';

import MinutesList from '../../../components/minutes/MinutesList';
import MinutesContent from '@/components/minutes/MinutesContent';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import MinutesContentEditor, {
  MinutesFormValues,
} from '@/components/minutes/editor/MinutesContentEditor';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  addMinutesPost,
  deleteMinutesPost,
  getMinutesPost,
  getPagedMinutesPosts,
  updateMinutesPost,
} from '@/auth/tihlde';
import {
  MinuteGroup,
  MinutesPostResponse,
  MinuteTag,
  PaginationRequest,
} from '@/auth/types';
import ConfirmDeletePostDialog from '@/components/minutes/ConfirmDeletePostDialog';
import MinutePostSkeleton from '@/components/minutes/MinutePostSkeleton';
import { useDebounce } from 'use-debounce';

export default function MinutesPage() {
  const [selectedMinuteId, setSelectedMinuteId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const session = useSession();
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [tempPagination, setTempPagination] = useState<PaginationRequest>({
    search: '',
    ordering: 'title',
    ascending: true,
    page: 1,
  });
  const [pagination] = useDebounce(tempPagination, 1000);

  const token = useMemo(
    () => session?.data?.user?.tihldeUserToken ?? '',
    [session],
  );

  const {
    data: minutes,
    isLoading: isPostsLoading,
    isRefetching: isPostsRefetching,
    refetch: refetchAllPosts,
  } = useQuery({
    queryKey: [
      'minutes',
      pagination.page,
      pagination.ascending,
      pagination.search,
      pagination.ordering,
    ],
    queryFn: () =>
      getPagedMinutesPosts(token ?? '', {
        page: pagination.page,
        ascending: pagination.ascending,
        ordering: pagination.ordering,
        search: pagination.search,
      }),
    enabled: Boolean(token),
  });

  useEffect(() => {
    void refetchAllPosts();
  }, [pagination]);

  const {
    data: minutePost,
    isLoading: isPostLoading,
    refetch: refetchMinutePost,
  } = useQuery({
    queryKey: ['minute', selectedMinuteId],
    queryFn: () => getMinutesPost(token, selectedMinuteId ?? 0),
    enabled: selectedMinuteId !== null && Boolean(token),
  });

  const { mutateAsync: updatePost } = useMutation<
    MinutesPostResponse,
    Error,
    {
      content: string;
      title: string;
      id: number;
      tag: MinuteTag;
      group: MinuteGroup;
    }
  >({
    mutationFn: (context) =>
      updateMinutesPost(
        token,
        context.id,
        context.title,
        context.content,
        context.tag,
        context.group,
      ),
    onSuccess: () => refetchMinutePost(),
  });

  const { mutateAsync: createPost } = useMutation<
    MinutesPostResponse,
    Error,
    { content: string; title: string; tag: MinuteTag; group: MinuteGroup }
  >({
    mutationFn: (context) =>
      addMinutesPost(
        token,
        context.title,
        context.content,
        context.tag,
        context.group,
      ),
    onSuccess: async (data) => {
      await refetchAllPosts();
      setSelectedMinuteId(data.id);
      await refetchMinutePost();
    },
  });

  const { mutateAsync: deletePost } = useMutation<
    MinutesPostResponse,
    Error,
    { id: number }
  >({
    mutationFn: (context) => deleteMinutesPost(token, context.id),
    onSuccess: async () => {
      await refetchAllPosts();
      setSelectedMinuteId(null);
    },
  });

  const handleCreate = () => {
    setSelectedMinuteId(null);
    setIsEditing(true);
  };

  const handleDiscard = () => {
    setIsEditing(false);
  };

  const handleSave = async (values: MinutesFormValues) => {
    if (selectedMinuteId) {
      // Run update
      await updatePost({
        id: selectedMinuteId,
        tag: values.tag,
        title: values.title,
        content: values.content,
        group: values.group,
      });
    } else {
      // Create new
      await createPost({
        tag: values.tag,
        content: values.content,
        title: values.title,
        group: values.group,
      });
    }
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (!selectedMinuteId) return;

    setIsEditing(true);
  };

  const handleDelete = () => {
    if (!selectedMinuteId) return;
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMinuteId) return;
    setIsConfirmDeleteDialogOpen(false);
    await deletePost({ id: selectedMinuteId });
  };

  return (
    <main className="flex h-full w-full flex-row gap-4 p-4">
      <MinutesList
        onSelect={setSelectedMinuteId}
        selectedPostId={selectedMinuteId}
        onCreate={handleCreate}
        minutePosts={minutes ?? null}
        isLoading={
          isPostsLoading || isPostsRefetching || tempPagination !== pagination
        }
        onChangePagination={setTempPagination}
        pagination={tempPagination}
        onNext={() => {
          if (minutes?.next) {
            setTempPagination((p) => ({
              ...p,
              page: minutes.next!,
            }));
          }
        }}
        onPrevious={() => {
          if (minutes?.previous) {
            setTempPagination((p) => ({
              ...p,
              page: minutes.previous!,
            }));
          }
        }}
      />
      {isEditing ? (
        <MinutesContentEditor
          onSave={handleSave}
          onDiscard={handleDiscard}
          existingMinute={minutePost}
        />
      ) : isPostLoading ? (
        <MinutePostSkeleton />
      ) : (
        <MinutesContent
          minute={minutePost!}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      <ConfirmDeletePostDialog
        isOpen={isConfirmDeleteDialogOpen}
        onCancel={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}
