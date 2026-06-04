import validator from "./instagram.validator";
import instagramLib from "./instagram.lib";

import { DEFAULT_SCOPES } from "../constants.lib";
import {
  GenerateOAuthUrlParams,
  InstagramLongLivedToken,
  InstagramOAuthUrl,
  InstagramResponse,
  InstagramShortLivedToken,
} from "./instagram.types";

class Instagram {
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

    return instagramLib.generateOAuthUrl({
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

    return instagramLib.exchangeCode(code);
  }

  public async getProfile(accessToken: string) {
    const validation = validator.getProfile(accessToken);

    if (!validation.success) {
      return validation;
    }

    return instagramLib.getProfile(accessToken);
  }

  public async exchangeShortLivedToken(
    shortLivedToken: string,
  ): Promise<InstagramResponse<InstagramLongLivedToken>> {
    const validation = validator.exchangeShortLivedToken(shortLivedToken);

    if (!validation.success) {
      return validation;
    }

    return instagramLib.exchangeShortLivedToken(shortLivedToken);
  }

  public async refreshLongLivedToken(
    longLivedToken: string,
  ): Promise<InstagramResponse<InstagramLongLivedToken>> {
    const validation = validator.refreshLongLivedToken(longLivedToken);

    if (!validation.success) {
      return validation;
    }

    return instagramLib.refreshLongLivedToken(longLivedToken);
  }

  public async exchangeCodeToLongLivedToken(code: string): Promise<
    InstagramResponse<{
      shortLived: InstagramShortLivedToken;
      longLived: InstagramLongLivedToken;
    }>
  > {
    const shortTokenRes = await this.exchangeCode(code);

    if (!shortTokenRes.success) {
      return {
        success: false,
        message: shortTokenRes.message || "Failed to get short-lived token",
      };
    }

    const shortLived = shortTokenRes.data;

    const longTokenRes = await this.exchangeShortLivedToken(
      shortLived.access_token,
    );

    if (!longTokenRes.success) {
      return {
        success: false,
        message: longTokenRes.message || "Failed to get long-lived token",
      };
    }

    const longLived = longTokenRes.data;

    return {
      success: true,
      data: {
        shortLived,
        longLived,
      },
    };
  }
}

export default new Instagram();
