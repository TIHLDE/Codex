export interface MembershipResponse {
  count: number;
  next: null;
  previous: null;
  results: Result[];
}

export interface Result {
  group: Group;
  membership_type: string;
  created_at: string;
  expiration_date: null;
  user: User;
}

export interface Group {
  name: string;
  slug: string;
  type: string;
  viewer_is_member: boolean;
  image: null | string;
  image_alt: null;
}

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  image: null;
  email: string;
  gender: number;
  study: Study;
  studyyear: Study;
}

export interface Study {
  group: Group;
  membership_type: string;
  created_at: string;
  expiration_date: null;
}

export type TIHLDEAuthParams = {
  user_id: string;
  password: string;
};

export interface UserResponse {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface UserPagedResponse {
  count: number;
  next: null;
  previous: null;
  results: UserResponse[];
};

export interface PagedResponse {
  count: number;
  next: number | null;
  previous: number | null;
  results: MinutesPostResponse[];
}

export interface MinutesPostResponse {
  id: number;
  title: string;
  author: {
    user_id: string;
    last_name: string;
    first_name: string;
    image: string | null;
  };
  created_at: Date;
  updated_at: Date;
  tag: MinuteTag;
  group: Group;
}

export interface SingleMinutesPostResponse extends MinutesPostResponse {
  content: string;
}

export interface PaginationRequest {
  ordering: MinuteOrdering;
  ascending: boolean;
  search?: string;
  page: number;
}

export interface CoursePostResponse {
  id: number;
  title: string;
  description: string;
  start_date: Date;
  start_registration_at: Date;
  end_registration_at: Date;
  location: string;
  mazemap_link: string;
  organizer: string;
  lecturer: string;
  tag: CourseTag;
};

export const minuteOrderings = [
  'created_at',
  'updated_at',
  'title',
  'author',
  'tag',
] as const;
export type MinuteOrdering = (typeof minuteOrderings)[number];

export const minuteTags = ['Møtereferat', 'Dokument'] as const;
export type MinuteTag = (typeof minuteTags)[number];

export const minuteGroups = ['Index', 'Drift'] as const;
export type MinuteGroup = (typeof minuteGroups)[number];

export const courseTags = ['Workshop', 'Lecture'];
export type CourseTag = (typeof courseTags)[number];

export const courseObjectTags = [
  { value: 'Workshop', label: 'Workshop' },
  { value: 'Lecture', label: 'Forelesning' }
];
export type CourseObjectTag = (typeof courseObjectTags)[number];
