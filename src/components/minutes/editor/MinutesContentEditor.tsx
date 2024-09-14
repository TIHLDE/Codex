import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField } from '@/components/TextField';
import MDEditor from '@uiw/react-md-editor';
import { Group, MinuteGroup, minuteGroups, minuteTags, SingleMinutesPostResponse } from '@/auth/types';
import TagDropdown from '@/components/minutes/editor/TagDropdown';
import { Button } from '@/components/Button';
import { useEffect, useMemo, useState } from 'react';
import GroupDropdown from './GroupDropdown';
import { useSession } from 'next-auth/react';
import { getValidGroupMemberships } from '@/auth/tihlde';

const validationSchema = yup.object({
  title: yup.string().required('Du må fylle inn tittel'),
  content: yup.string().required('Du må fylle inn innholdet'),
  tag: yup.string().oneOf(minuteTags).required('Du må bruke en tag'),
  group: yup.string().oneOf(minuteGroups).required('Du må velge en gruppe'),
});

export type MinutesFormValues = yup.InferType<typeof validationSchema>;

const initialValues = {
  title: '',
  content: '',
  tag: 'Møtereferat',
  group: 'Index',
} satisfies MinutesFormValues;

export interface MinutesContentEditorProps {
  onSave: (values: MinutesFormValues) => void;
  existingMinute?: SingleMinutesPostResponse;
  onDiscard: () => void;
}

export default function MinutesContentEditor({
  onSave,
  existingMinute,
  onDiscard,
}: MinutesContentEditorProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGroupsLoading, setIsGroupsLoading] = useState<boolean>(false);
  const session = useSession();

  const token = useMemo(
    () => session?.data?.user?.tihldeUserToken ?? '',
    [session],
  );

  const getGroups = async () => {
    setIsGroupsLoading(true);
    try {
      if (!token) {
        return [];
      }
      const groups = await getValidGroupMemberships(token);
  
      if (!groups.length) return;
  
      formik.setValues(values => ({
        ...values,
        group: groups[0].name as MinuteGroup,
      }));
      setGroups(groups);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGroupsLoading(false);
    }
  };

  useEffect(() => {
    if (existingMinute) {
      formik.setValues({
        tag: existingMinute.tag,
        content: existingMinute.content,
        title: existingMinute.title,
        group: existingMinute.group,
      });
    }

    getGroups();
  }, [existingMinute]);

  const formik = useFormik<MinutesFormValues>({
    validationSchema,
    onSubmit: onSave,
    initialValues,
  });

  const handleDiscard = () => {
    formik.resetForm();
    onDiscard();
  };

  return (
    <main
      className={
        'h-full w-full rounded-lg bg-slate-800 p-4 lg:h-[calc(100svh-2rem)]'
      }
    >
      <form
        onSubmit={formik.handleSubmit}
        className={'flex h-full w-full flex-col gap-4'}
      >
        <div className={'flex w-full items-start justify-between gap-4'}>
          <div className={'flex justify-start gap-4'}>
            <TextField
              formik={formik}
              field={'title'}
              name={'Tittel'}
              className={'max-w-sm'}
            />
            <TagDropdown
              value={formik.values.tag}
              onChange={(tag) => formik.setFieldValue('tag', tag, true)}
            />
            <GroupDropdown
              value={formik.values.group}
              onChange={(group) => formik.setFieldValue('group', group, true)}
              groups={groups}
              isLoading={isGroupsLoading}
            />
          </div>
          <div className={'flex h-full items-center justify-end gap-4'}>
            <Button type={'submit'}>Lagre</Button>
            <Button
              type={'button'}
              variant={'destructive'}
              onClick={handleDiscard}
            >
              Forkast endringer
            </Button>
          </div>
        </div>
        <MDEditor
          height={'100%'}
          value={formik.values.content}
          onChange={(value) => formik.setFieldValue('content', value, true)}
        />
      </form>
    </main>
  );
}
