import { ErrorCode } from "../../../utils/errors";
import { INSTAGRAM_SCOPES } from "../instagram.constants";

type InstagramScope = (typeof INSTAGRAM_SCOPES)[keyof typeof INSTAGRAM_SCOPES];

type InstagramResponse<T, E = string> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error?: E;
      code: ErrorCode;
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

export {
  GenerateOAuthUrlParams,
  InstagramLongLivedToken,
  InstagramOAuthUrl,
  InstagramResponse,
  InstagramScope,
  InstagramShortLivedToken,
};
