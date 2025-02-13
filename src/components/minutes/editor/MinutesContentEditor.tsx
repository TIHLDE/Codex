import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Group,
  MinuteGroup,
  minuteGroups,
  minuteTags,
  SingleMinutesPostResponse,
} from '@/auth/types';
import TagDropdown from '@/components/minutes/editor/TagDropdown';
import { Button } from '@/components/ui/Button';
import { useEffect, useMemo, useState } from 'react';
import GroupDropdown from './GroupDropdown';
import { useSession } from 'next-auth/react';
import { getValidGroupMemberships } from '@/auth/tihlde';
import { TextField } from '@/components/forms/TextField';
import { TextAreaField } from '@/components/forms/TextAreaField';

const validationSchema = yup.object({
  title: yup.string().required('Du må fylle inn tittel'),
  content: yup.string().required('Du må fylle inn innhold'),
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
      const groups = await getValidGroupMemberships(token);

      if (groups.length) {
        formik.setValues((values) => ({
          ...values,
          group: groups[0].name as MinuteGroup,
        }));
      }

      if (existingMinute) {
        formik.setValues({
          tag: existingMinute.tag,
          content: existingMinute.content,
          title: existingMinute.title,
          group: existingMinute.group.name as MinuteGroup,
        });
      }
      setGroups(groups);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGroupsLoading(false);
    }
  };

  useEffect(() => {
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
        'h-full w-full rounded-lg p-2 lg:h-[calc(100svh-2rem)] dark:bg-slate-800'
      }
    >
      <form
        onSubmit={formik.handleSubmit}
        className={'flex h-full w-full flex-col gap-4'}
      >
        <div className="space-y-4">
          <div className="space-y-4">
            <TextField formik={formik} field={'title'} name={'Tittel'} />
            <div className={'flex justify-start gap-4'}>
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
          </div>
          <div className="flex items-center space-x-2">
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
        <TextAreaField
          formik={formik}
          field={'content'}
          name={'Innhold'}
          className="h-96"
        />
      </form>
    </main>
  );
}
