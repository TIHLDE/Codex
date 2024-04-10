import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextField } from '@/components/TextField';
import MDEditor from '@uiw/react-md-editor';
import { minuteTags, SingleMinutesPostResponse } from '@/auth/types';
import TagDropdown from '@/app/(private)/minutes/editor/tagDropdown';
import { Button } from '@/components/Button';
import { useEffect } from 'react';

const validationSchema = yup.object({
  title: yup.string().required('Du må fylle inn tittel'),
  content: yup.string().required('Du må fylle inn innholdet'),
  tag: yup.string().oneOf(minuteTags).required('Du må bruke en tag'),
});

export type MinutesFormValues = yup.InferType<typeof validationSchema>;

const initialValues = {
  title: '',
  content: '',
  tag: 'Møtereferat',
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
  useEffect(() => {
    if (existingMinute) {
      formik.setValues({
        tag: existingMinute.tag,
        content: existingMinute.content,
        title: existingMinute.title,
      });
    }
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
        <div className={'flex w-full items-start justify-start gap-4'}>
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
          <div className={'flex h-full flex-col justify-center'}>
            <Button type={'submit'}>Lagre</Button>
          </div>
          <div className={'flex h-full flex-col justify-center'}>
            <Button
              type={'button'}
              onClick={handleDiscard}
              className={'bg-red-500 text-white'}
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
