import validator from "./instagram.validator";
import instagramLib from "./instagram.lib";

import { DEFAULT_SCOPES } from "../constants.lib";
import { GenerateOAuthUrlParams, InstagramLibType } from "./instagram.types";

class Instagram {
  public async generateOAuthUrl({
    scopes = DEFAULT_SCOPES,
    state,
  }: GenerateOAuthUrlParams = {}): Promise<InstagramLibType> {
    const validation = validator.generateOAuthUrl(scopes);

    if (!validation.success) {
      return validation;
    }

    return instagramLib.generateOAuthUrl({
      scopes,
      state,
    });
  }

  public async exchangeCode(code: string): Promise<{ success: boolean; data?: { accessToken: string; userId: string; permissions: string[] } }> {
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
}

export default new Instagram();
