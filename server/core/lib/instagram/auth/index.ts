import { UserType } from "../../../../database/models/user.model";
import { DEFAULT_SCOPES } from "../instagram.constants";
import InstagramLib from "../instagram.lib";
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
  private instagramAuthLib: InstagramAuthLib;
  private instagramLib: InstagramLib;
  constructor(user: UserType | undefined) {
    this.instagramAuthLib = new InstagramAuthLib(user);
    this.instagramLib = new InstagramLib(user);
  }
  public async generateOAuthUrl({
    scopes = DEFAULT_SCOPES,
    state,
  }: GenerateOAuthUrlParams = {}): Promise<
    InstagramResponse<InstagramOAuthUrl>
  > {
    const validation = validator.generateOAuthUrl(scopes);

    if (!validation.success) {
      return validation;
    }

    return this.instagramAuthLib.generateOAuthUrl({
      scopes,
      state,
    });
  }

  public async exchangeCode(
    code: string,
  ): Promise<InstagramResponse<InstagramShortLivedToken>> {
    const validation = validator.exchangeCode(code);

    if (!validation.success) {
      return validation;
    }

    return this.instagramAuthLib.exchangeCode(code);
  }

  public async exchangeShortLivedToken(
    tokenApiUserId: string,
    shortLivedToken: string,
    scopes?: string[],
  ): Promise<InstagramResponse<InstagramLongLivedToken>> {
    const validation = validator.exchangeShortLivedToken(shortLivedToken);

    if (!validation.success) {
      return validation;
    }

    return this.instagramAuthLib.exchangeShortLivedToken(
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

  public async exchangeCodeToLongLivedToken(code: string): Promise<
    InstagramResponse<{
      shortLived: InstagramShortLivedToken;
      longLived: InstagramLongLivedToken;
    }>
  > {
    const shortTokenRes = await this.exchangeCode(code);

    if (!shortTokenRes.success) {
      return shortTokenRes;
    }

    const shortLived = shortTokenRes.data;

    const longTokenRes = await this.exchangeShortLivedToken(
      shortLived.user_id,
      shortLived.access_token,
      shortLived.permissions,
    );

    const profileRes = await this.instagramLib.getProfile();

    if (!profileRes.success) {
      return profileRes;
    }

    if (!longTokenRes.success) {
      return longTokenRes;
    }

    const longLived = longTokenRes.data;

    return {
      data: {
        longLived,
        shortLived,
      },
      success: true,
    };
  }
}

export default InstagramAuth;
