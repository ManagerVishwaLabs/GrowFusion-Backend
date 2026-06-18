import { UserType } from "../../../database/models/user.model";
import { DEFAULT_SCOPES } from "../instagram.constants";
import InstagramAuthLib from "./instagram.auth.lib";
import {
  GenerateOAuthUrlParams,
  InstagramLongLivedToken,
  InstagramOAuthUrl,
  InstagramResponse,
  InstagramShortLivedToken,
} from "./instagram.auth.types";
import validator from "./instagram.auth.validator";

class InstagramAuth {
  constructor(private instagramAuthLib: InstagramAuthLib) {}

  public static async init(user: UserType | undefined) {
    const instagramAuthLib = await InstagramAuthLib.init(user);

    return new InstagramAuth(instagramAuthLib);
  }

  public static async generateOAuthUrl({
    scopes = DEFAULT_SCOPES,
    state,
  }: GenerateOAuthUrlParams = {}): Promise<
    InstagramResponse<InstagramOAuthUrl>
  > {
    const validation = validator.generateOAuthUrl(scopes);

    if (!validation.success) {
      return validation;
    }

    return InstagramAuthLib.generateOAuthUrl({
      scopes,
      state,
    });
  }

  public static async exchangeCode(
    code: string,
  ): Promise<InstagramResponse<InstagramShortLivedToken>> {
    const validation = validator.exchangeCode(code);

    if (!validation.success) {
      return validation;
    }

    return InstagramAuthLib.exchangeCode(code);
  }

  public static async exchangeShortLivedToken(
    user: UserType,
    tokenApiUserId: string,
    shortLivedToken: string,
    scopes?: string[],
  ): Promise<InstagramResponse<InstagramLongLivedToken>> {
    const validation = validator.exchangeShortLivedToken(shortLivedToken);

    if (!validation.success) {
      return validation;
    }

    return InstagramAuthLib.exchangeShortLivedToken(
      user,
      tokenApiUserId,
      shortLivedToken,
      scopes,
    );
  }

  public async refreshLongLivedToken(
    tokenApiUserId: string,
    longLivedToken: string,
  ): Promise<InstagramResponse<InstagramLongLivedToken>> {
    const validation = validator.refreshLongLivedToken(longLivedToken);

    if (!validation.success) {
      return validation;
    }

    return this.instagramAuthLib.refreshLongLivedToken(
      tokenApiUserId,
      longLivedToken,
    );
  }
}

export default InstagramAuth;
