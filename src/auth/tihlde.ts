import { env } from '../lib/env';
import {
  EventDetailResponse,
  EventPagedResponse,
  EventPostResponse,
  EventRegistrationsPagedResponse,
  EventTag,
  Group,
  MembershipResponse,
  MinuteGroup,
  MinutesPostResponse,
  MinuteTag,
  PagedResponse,
  PaginationRequest,
  Registration,
  SingleMinutesPostResponse,
  User,
  UserPagedResponse,
  UserResponse,
} from './types';

const getHeaders = (token: string) => {
  return {
    'Content-Type': 'application/json',
    'x-csrf-token': token,
  };
};

export const loginToTIHLDE = async (
  user_id: string,
  password: string,
): Promise<string> => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_TIHLDE_API_URL}/auth/login/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id, password }),
    },
  );

  if (response.status !== 200) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to login to TIHLDE');
  }
  return (await response.json()).token as string;
};

export const getTIHLDEUser = async (token: string, user_id: string) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_TIHLDE_API_URL}/users/${user_id}/`,
    {
      headers: getHeaders(token),
    },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to fetch user');
  }

  return (await response.json()) as UserResponse;
};

export const getIsInPermittedGroup = async (token: string): Promise<boolean> => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_TIHLDE_API_URL}/users/me/memberships/`,
    {
      headers: getHeaders(token),
    },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to fetch memberships');
  }

  const data = (await response.json()) as MembershipResponse;

  return data.results.some((r) => env.NEXT_PUBLIC_ALLOWED_GROUP_SLUGS.includes(r.group.slug));
};

export const getValidGroupMemberships = async (token: string): Promise<Group[]> => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_TIHLDE_API_URL}/users/me/memberships/`,
    {
      headers: getHeaders(token),
    },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to fetch memberships');
  }

  const data = (await response.json()) as MembershipResponse;

  return data.results
    .filter((r) => env.NEXT_PUBLIC_ALLOWED_GROUP_SLUGS.includes(r.group.slug))
    .map((r) => r.group);
};

export const addMinutesPost = async (
  token: string,
  title: string,
  content: string,
  tag: MinuteTag,
  group: MinuteGroup
): Promise<MinutesPostResponse> => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_TIHLDE_API_URL}/minutes/`,
    {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ title, content, tag, group: group.toLowerCase() }),
    },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to add minutes post');
  }

  return (await response.json()) as MinutesPostResponse;
};

export const getMinutesPost = async (
  token: string,
  id: number,
): Promise<SingleMinutesPostResponse> => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_TIHLDE_API_URL}/minutes/${id}/`,
    { headers: getHeaders(token) },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to fetch minutes post by id');
  }

  return (await response.json()) as SingleMinutesPostResponse;
};

export const updateMinutesPost = async (
  token: string,
  id: number,
  title: string,
  content: string,
  tag: MinuteTag,
  group: MinuteGroup
): Promise<MinutesPostResponse> => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_TIHLDE_API_URL}/minutes/${id}/`,
    {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ title, content, tag, group: group.toLowerCase() }),
    },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to update minutes post');
  }

  return (await response.json()) as MinutesPostResponse;
};

export const deleteMinutesPost = async (
  token: string,
  id: number,
): Promise<MinutesPostResponse> => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_TIHLDE_API_URL}/minutes/${id}`,
    {
      method: 'DELETE',
      headers: getHeaders(token),
    },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to delete minutes post');
  }

  return (await response.json()) as MinutesPostResponse;
};

export const getPagedMinutesPosts = async (
  token: string,
  pagination: PaginationRequest,
): Promise<PagedResponse> => {
  const params = {
    page: pagination.page.toString(),
    ordering: (!pagination.ascending ? '-' : '') + `${pagination.ordering}`,
  } satisfies any;

  if (pagination.search) {
    // @ts-ignore
    params.search = pagination.search;
  }

  const query = new URLSearchParams(params);

  const response = await fetch(
    `${env.NEXT_PUBLIC_TIHLDE_API_URL}/minutes/?${query}`,
    {
      method: 'GET',
      headers: getHeaders(token),
    },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to fetch paged minutes response');
  }

  return (await response.json()) as PagedResponse;
};

export const isLeader = async (token: string): Promise<boolean> => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_TIHLDE_API_URL}/users/me/memberships/`,
    {
      headers: getHeaders(token),
    },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to fetch memberships');
  }

  const data = await response.json() as MembershipResponse;

  const isLeader = data.results.some((r) => r.membership_type === 'LEADER');

  return isLeader;
};

export const addEvent = async (
  token: string,
  title: string,
  start_date: Date,
  start_registration_at: Date,
  end_registration_at: Date,
  location: string,
  mazemap_link: string,
  organizer: MinuteGroup,
  lecturer: string,
  tag: EventTag,
  description?: string,
): Promise<EventPostResponse> => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_TIHLDE_API_URL}/codex/events/`,
    {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        title,
        description,
        start_date,
        start_registration_at,
        end_registration_at,
        location,
        mazemap_link,
        organizer: organizer.toLowerCase(),
        lecturer,
        tag,
      }),
    },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to add course');
  }

  return (await response.json()) as EventPostResponse;
};

export const getUsers = async (token: string, search: string): Promise<User[]> => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_TIHLDE_API_URL}/users/?search=${search}`,
    {
      headers: getHeaders(token),
    },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to fetch user');
  }

  const data = await response.json() as UserPagedResponse;
  const results = data.results as User[];

  return results;
}

export const getEvents = async (token: string): Promise<EventPagedResponse> => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_TIHLDE_API_URL}/codex/events/`,
    {
      headers: getHeaders(token),
    },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to fetch events');
  }

  return (await response.json()) as EventPagedResponse;
};

export const getEvent= async (token: string, id: string): Promise<EventDetailResponse> => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_TIHLDE_API_URL}/codex/events/${id}/`,
    {
      headers: getHeaders(token),
    },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to fetch course');
  }

  const data = await response.json();

  return data as EventDetailResponse;
}

export const createEventRegistration = async (token: string, event_id: number): Promise<void> => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_TIHLDE_API_URL}/codex/events/${event_id}/registrations/`,
    {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        event: event_id,
      }),
    },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to register for event');
  }
}

export const getEventRegistrations = async (token: string, event_id: number): Promise<EventRegistrationsPagedResponse> => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_TIHLDE_API_URL}/codex/events/${event_id}/registrations/`,
    {
      headers: getHeaders(token),
    },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to fetch registrations');
  }

  const data = await response.json();

  return data as EventRegistrationsPagedResponse;
};

export const deleteEventRegistration = async (token: string, event_id: number, registration_id: number): Promise<void> => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_TIHLDE_API_URL}/codex/events/${event_id}/registrations/${registration_id}/`,
    {
      method: 'DELETE',
      headers: getHeaders(token),
    },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to delete registration');
  }
};
