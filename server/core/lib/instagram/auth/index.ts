import { DEFAULT_SCOPES } from "../instagram.constants";
import instagramLib from "../instagram.lib";
import instagramAuthLib from "./instagram.auth.lib";
import {
  GenerateOAuthUrlParams,
  InstagramLongLivedToken,
  InstagramOAuthUrl,
  InstagramResponse,
  InstagramShortLivedToken,
} from "./instagram.auth.types";
import validator from "./instagram.auth.validator";

class InstagramAuth {
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

    return instagramAuthLib.generateOAuthUrl({
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

    return instagramAuthLib.exchangeCode(code);
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

    return instagramAuthLib.exchangeShortLivedToken(
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

    return instagramAuthLib.refreshLongLivedToken(
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

    const profileRes = await instagramLib.getProfile();

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

export default new InstagramAuth();
