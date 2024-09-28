"use client";

import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import * as yup from 'yup';
import { TextAreaField } from '../forms/TextAreaField';
import { TextField } from '../forms/TextField';
import GroupDropdown from '../minutes/editor/GroupDropdown';
import { DateTimePicker } from '../forms/DateTimePicker';
import { UserSearch } from '../forms/UserSearch';
import { Button } from '../Button';
import { useRouter } from 'next/navigation';
import { addEvent, updateEvent } from '@/auth/tihlde';
import { EventDetailResponse, eventTags, Group, MinuteGroup, minuteGroups } from '@/auth/types';
import EventTagDropdown from './EventTagDropdown';
import { EventDeleteButton } from './EventDeleteButton';


const validationSchema = yup.object().shape({
    title: yup.string().required('Du må fylle inn tittel'),
    description: yup.string(),
    start_date: yup.date().required('Du må fylle inn startdato'),
    start_registration_at: yup.date().required('Du må fylle inn startdato for påmelding'),
    end_registration_at: yup.date().required('Du må fylle inn sluttdato for påmelding'),
    location: yup.string().required('Du må fylle inn lokasjon'),
    mazemap_link: yup.string().url('Må være en gyldig URL').required('Du må fylle inn Mazemap-link'),
    organizer: yup.string().oneOf(minuteGroups).required('Du må velge en gruppe'),
    lecturer: yup.string().required('Du må fylle inn kursholder'),
    tag: yup.string().oneOf(eventTags).required('Du må velge en tag'),
});

export type EventFormValues = yup.InferType<typeof validationSchema>;


interface EventFormProps {
    event?: EventDetailResponse;
};

export const EventForm = ({ event }: EventFormProps) => {
    const router = useRouter();
    const session = useSession();
    
    const initialValues = {
        title: event?.title ?? '',
        description: event?.description ?? '',
        start_date: event?.start_date ??  new Date(new Date().setDate(new Date().getDate() + 7)),
        start_registration_at: event?.start_registration_at ?? new Date(),
        end_registration_at: event?.end_registration_at ?? new Date(new Date().setDate(new Date().getDate() + 6)),
        location: event?.location ?? '',
        mazemap_link: event?.mazemap_link ?? '',
        organizer: event?.organizer.name as MinuteGroup ?? '',
        lecturer: event?.lecturer.user_id ?? '',
        tag: event?.tag ?? '',
    } satisfies EventFormValues;

    const groups = [
        {
            slug: 'index',
            name: 'Index',
        },
        {
            slug: 'drift',
            name: 'Drift',
        },
    ]

    const token = useMemo(
      () => session?.data?.user?.tihldeUserToken ?? '',
      [session],
    );

    const onSave = async (values: EventFormValues) => {
        try {
            if (event) {
                await updateEvent(
                    token,
                    event.id,
                    values.title,
                    values.start_date,
                    values.start_registration_at,
                    values.end_registration_at,
                    values.location,
                    values.mazemap_link,
                    values.organizer,
                    values.lecturer,
                    values.tag,
                    values.description
                )
            } else {
                await addEvent(
                    token,
                    values.title,
                    values.start_date,
                    values.start_registration_at,
                    values.end_registration_at,
                    values.location,
                    values.mazemap_link,
                    values.organizer,
                    values.lecturer,
                    values.tag,
                    values.description
                );
            }

            router.replace('/events');
            router.refresh();
        } catch (e) {
            console.error(e);
        }
    };  

    const formik = useFormik<EventFormValues>({
        initialValues,
        validationSchema,
        onSubmit: onSave,
    });

    return (
        <form
            className='max-w-6xl w-full py-6 px-12 border border-gray-300 dark:border-slate-600 rounded-md mx-auto space-y-8'
            onSubmit={formik.handleSubmit}
        >
            <div className='flex space-x-8'>
                <TextField
                    formik={formik}
                    name='Tittel'
                    field='title'
                    className='w-full'
                />

                <DateTimePicker
                    formik={formik}
                    name='Startdato'
                    field='start_date'
                    className='w-full'
                />
            </div>

            <div className='flex space-x-8'>
                <DateTimePicker
                    formik={formik}
                    name='Start påmelding'
                    field='start_registration_at'
                    className='w-full'
                />

                <DateTimePicker
                    formik={formik}
                    name='Slutt påmelding'
                    field='end_registration_at'
                    className='w-full'
                />

            </div>

            <div className='flex space-x-8'>
                <TextField
                    formik={formik}
                    name='Lokasjon'
                    field='location'
                    className='w-full'
                />
                
                <TextField
                    formik={formik}
                    name='Mazemap-link'
                    field='mazemap_link'
                    className='w-full'
                />
            </div>

            <div className='flex space-x-8'>
                <GroupDropdown
                    value={formik.values.organizer}
                    onChange={(organizer) => formik.setFieldValue('organizer', organizer, true)}
                    groups={groups as Group[]}
                />

                <EventTagDropdown
                    value={formik.values.tag}
                    onChange={(tag) => formik.setFieldValue('tag', tag, true)}
                />

                <UserSearch
                    formik={formik}
                    name='Kursholder'
                    field='lecturer'
                    className='w-full'
                    placeholderUser={event?.lecturer}
                />
            </div>

            <TextAreaField
                formik={formik}
                name='Beskrivelse'
                field='description'
                className='w-full min-h-60'
            />

            <div className='space-y-2'>
                <Button
                    type='submit'
                    className='w-full'
                    variant='submit'
                >
                    {event ? 'Oppdater arrangement' : 'Legg til arrangement'}
                </Button>

                {event && <EventDeleteButton className='w-full' event={event} token={token} />}
            </div>
        </form>
    );
};