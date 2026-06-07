import { PROFILE_FIELDS } from "./instagram.constants";

type InstagramResponse<T, E = string> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: E;
    };

type ProfileField = (typeof PROFILE_FIELDS)[number];
type ProfileFields = ProfileField[];

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  username: string;
  account_type: string;
  profile_picture_url: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
}

type CarouselItem = {
  type: "IMAGE" | "VIDEO";
  url: string;
};

type MediaIDResponse = {
  id: string;
};

type ContainerStatusResponse = {
  status_code: "IN_PROGRESS" | "FINISHED" | "ERROR" | "EXPIRED";
};

type MediaListResponse = {
  data: {
    id: string;
  }[];
  paging?: {
    cursors?: {
      after?: string;
      before?: string;
    };
  };
};

type MediaDetailsResponse = {
  id: string;
  caption: string;
  media_type: string;
  media_product_type: string;
  media_url: string;
  thumbnail_url: string;
  permalink: string;
  shortcode: string;
  timestamp: string;
  username: string;
  owner: string;
  children: {
    data: [{ id: string; media_type: string; media_url: string }];
  };
  comments_count: number;
  like_count: number;
  is_comment_enabled: boolean;
};

export {
  InstagramResponse,
  ProfileField,
  ProfileFields,
  UserProfile,
  CarouselItem,
  MediaIDResponse,
  ContainerStatusResponse,
  MediaListResponse,
  MediaDetailsResponse,
};
