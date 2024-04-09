import {
  MembershipResponse,
  MinutesPostResponse,
  PagedResponse,
  PaginationRequest,
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
    `${process.env.NEXT_PUBLIC_TIHLDE_API_URL}/auth/login/`,
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
    `${process.env.NEXT_PUBLIC_TIHLDE_API_URL}/users/${user_id}/`,
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

export const getIsInIndex = async (token: string): Promise<boolean> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TIHLDE_API_URL}/users/me/memberships/`,
    {
      headers: getHeaders(token),
    },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to fetch memberships');
  }

  const data = (await response.json()) as MembershipResponse;

  return data.results.some((r) => r.group.slug === 'index');
};

export const addMinutesPost = async (
  token: string,
  title: string,
  content: string,
): Promise<MinutesPostResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TIHLDE_API_URL}/minutes/`,
    {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ title, content }),
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
): Promise<MinutesPostResponse> => {
  console.log(token);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TIHLDE_API_URL}/minutes/${id}/`,
    { headers: getHeaders(token) },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to fetch minutes post by id');
  }

  return (await response.json()) as MinutesPostResponse;
};

export const updateMinutesPost = async (
  token: string,
  id: number,
  title: string,
  content: string,
): Promise<MinutesPostResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TIHLDE_API_URL}/minutes/${id}`,
    {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ title, content }),
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
    `${process.env.NEXT_PUBLIC_TIHLDE_API_URL}/minutes/${id}`,
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

/*
export const getPagedMinutesPosts = async (
  token: string,
  pagination: PaginationRequest,
): Promise<PagedResponse> => {
  const headers = {
    'Content-Type': 'application/json',
    'x-csrf-token': token,
  };

  const params = new URLSearchParams({
    page: pagination.page.toString(),
    order_by: (!pagination.ascending ? '-' : '') + `${pagination.ordering}`,
    filter: pagination.filter,
    search: pagination.search,
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TIHLDE_API_URL}/minutes/?${params}`,
    {
      method: 'PUT',
      headers: headers,
    },
  );

  if (!response.ok) {
    console.error(response.status, response.statusText, await response.json());
    throw new Error('Failed to fetch paged minutes response');
  }

  return (await response.json()) as PagedResponse;
};
*/
