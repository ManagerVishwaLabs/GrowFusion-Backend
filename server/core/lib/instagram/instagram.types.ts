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
  username: string;
  account_type: string;
  media_count: number;
}

export { InstagramResponse, ProfileField, ProfileFields, InstagramProfile };
