'use client';

import MinutesList from '../../../components/minutes/MinutesList';
import MinutesContent from '@/components/minutes/MinutesContent';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import MinutesContentEditor, {
  MinutesFormValues,
} from '@/components/minutes/editor/MinutesContentEditor';
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import {
  addMinutesPost,
  deleteMinutesPost,
  getMinutesPost,
  getPagedMinutesPosts,
  updateMinutesPost,
} from '@/auth/tihlde';
import {
  MinutesPostResponse,
  MinuteTag,
  PaginationRequest,
} from '@/auth/types';
import ConfirmDeletePostDialog from '@/components/minutes/ConfirmDeletePostDialog';

export default function MinutesPage() {
  const [selectedMinuteId, setSelectedMinuteId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const session = useSession();
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [currentPagination, setCurrentPagination] = useState<PaginationRequest>(
    {
      search: '',
      ordering: 'title',
      ascending: true,
      page: 1,
    },
  );

  const token = useMemo(
    () => session?.data?.user?.tihldeUserToken ?? '',
    [session],
  );

  const {
    data: minutes,
    isLoading,
    refetch: refetchAllPosts,
  } = useQuery({
    queryKey: ['minutes', currentPagination.page],
    queryFn: () =>
      getPagedMinutesPosts(token ?? '', {
        page: currentPagination.page,
        ascending: currentPagination.ascending,
        ordering: currentPagination.ordering,
        search: currentPagination.search,
      }),
    placeholderData: keepPreviousData,
    enabled: Boolean(token),
  });

  useEffect(() => {
    void refetchAllPosts();
  }, [currentPagination]);

  const {
    data: minutePost,
    isLoading: minutePostLoading,
    refetch: refetchMinutePost,
  } = useQuery({
    queryKey: ['minute', selectedMinuteId],
    queryFn: () => getMinutesPost(token, selectedMinuteId ?? 0),
    enabled: selectedMinuteId !== null && Boolean(token),
  });

  const { mutateAsync: updatePost } = useMutation<
    MinutesPostResponse,
    Error,
    { content: string; title: string; id: number; tag: MinuteTag }
  >({
    mutationFn: (context) =>
      updateMinutesPost(
        token,
        context.id,
        context.title,
        context.content,
        context.tag,
      ),
    onSuccess: () => refetchMinutePost(),
  });

  const { mutateAsync: createPost } = useMutation<
    MinutesPostResponse,
    Error,
    { content: string; title: string; tag: MinuteTag }
  >({
    mutationFn: (context) =>
      addMinutesPost(token, context.title, context.content, context.tag),
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
      });
    } else {
      // Create new
      await createPost({
        tag: values.tag,
        content: values.content,
        title: values.title,
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
    console.log(selectedMinuteId);
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
        isLoading={isLoading}
        onChangePagination={setCurrentPagination}
      />
      {isEditing ? (
        <MinutesContentEditor
          onSave={handleSave}
          onDiscard={handleDiscard}
          existingMinute={minutePost}
        />
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
