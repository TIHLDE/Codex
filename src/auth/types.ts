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
  tag: 'Møtereferat' | 'Dokument';
}

export interface SingleMinutesPostResponse extends MinutesPostResponse {
  content: string;
}

export interface PaginationRequest {
  ordering: 'created_at' | 'updated_at' | 'title' | 'author' | 'tag';
  ascending: boolean;
  title?: string;
  author?: string;
  tag?: string;
  search?: string;
  page: number;
}
