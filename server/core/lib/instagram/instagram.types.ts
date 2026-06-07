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

interface InstagramProfile {
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

export {
  InstagramResponse,
  ProfileField,
  ProfileFields,
  InstagramProfile,
  CarouselItem,
};
