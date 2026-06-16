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

    if (!response.success) {
      return {
        code: response.code,
        error: response.error,
        success: false,
      };
    }

    return {
      redirectUrl: response.data.url,
      success: true,
    };
  }

  public async instagramOauthCallback({
    query,
  }: {
    query: {
      code: string;
      state?: string;
      error?: string;
      error_description?: string;
    };
  }): Promise<ControllerResponse> {
    const { code, error, error_description } = query;

    if (error) {
      return {
        code: "GF0030009",
        error: error,
        message: error_description,
        success: false,
      };
    }

    const response = await instagramAuthLib.exchangeCodeToLongLivedToken(code);

    if (!response.success) {
      return {
        code: response.code,
        error: response.error,
        success: false,
      };
    }

    return {
      data: response.data,
      success: true,
    };
  }
}

export default new OAuthController();
