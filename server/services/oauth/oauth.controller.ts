import instagramAuthLib from "../../core/lib/instagram/auth";

import { ControllerResponse } from "../../utils/types";
import { InstagramOauthRedirect } from "./oauth.types";

class OAuthController {
  public async instagramOauthRedirect({
    params,
  }: InstagramOauthRedirect): Promise<ControllerResponse> {
    const response = await instagramAuthLib.generateOAuthUrl({
      scopes: params.scopes,
      state: params.state,
    });

    if (!response.success || !response.data) {
      return {
        success: false,
        code: "IG00010006",
      };
    }

    return {
      success: true,
      redirectUrl: response.data.url,
    };
  }

  public async instagramOauthCallback({
    query,
  }: {
    query: {
      code?: string;
      state?: string;
      error?: string;
      error_description?: string;
    };
  }): Promise<ControllerResponse> {
    const { code, error, error_description } = query;

    if (error) {
      return {
        success: false,
        code: "IG00020001",
        message: error_description,
      };
    }

    if (!code) {
      return {
        success: false,
        code: "IG00020002",
      };
    }

    const response = await instagramAuthLib.exchangeCodeToLongLivedToken(code);

    if (!response.success) {
      return {
        success: false,
        code: "IG00020012",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  }
}

export default new OAuthController();
