import { INSTAGRAM_SCOPES } from "../instagram.constants";

type InstagramScope = (typeof INSTAGRAM_SCOPES)[keyof typeof INSTAGRAM_SCOPES];

type InstagramResponse<T, E = string> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: E;
    };

interface InstagramOAuthUrl {
  url?: string;
  scopes: string[];
}

interface GenerateOAuthUrlParams {
  scopes?: InstagramScope[];
  state?: string;
}

interface InstagramShortLivedToken {
  access_token: string;
  user_id: string;
  permissions?: string[];
}

interface InstagramLongLivedToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface InstagramProfile {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
}

export {
  InstagramResponse,
  InstagramScope,
  GenerateOAuthUrlParams,
  InstagramOAuthUrl,
  InstagramShortLivedToken,
  InstagramLongLivedToken,
  InstagramProfile,
};
