import { INSTAGRAM_SCOPES } from "../constants.lib";

type InstagramScope = (typeof INSTAGRAM_SCOPES)[keyof typeof INSTAGRAM_SCOPES];

interface GenerateOAuthUrlParams {
  scopes?: InstagramScope[];
  state?: string;
}

type InstagramValidatorType = {
  success: boolean;
  message?: string;
};

type InstagramLibType = {
  success: boolean;
  message?: string;
  data?: {
    url?: string;
    scopes?: InstagramScope[];
  };
};

export {
  InstagramScope,
  GenerateOAuthUrlParams,
  InstagramValidatorType,
  InstagramLibType,
};
