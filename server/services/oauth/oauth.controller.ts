import { Request } from "express";
import InstagramAuth from "../../library/instagram/auth";
import { ControllerResponse, ControllerType } from "../../utils/types";
import { InstagramOauthRedirect } from "./oauth.types";

class OAuthController {
  private getInstagramAuth(req: Request | undefined) {
    return new InstagramAuth(req?.user);
  }

  public async instagramOauthRedirect({
    data,
    req,
  }: ControllerType<InstagramOauthRedirect>): Promise<ControllerResponse> {
    const instagramAuth = this.getInstagramAuth(req);
    const response = await instagramAuth.generateOAuthUrl({
      scopes: data.scopes,
      state: data.state,
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
    data,
    req,
  }: ControllerType<{
    code: string;
    state?: string;
    error?: string;
    error_description?: string;
  }>): Promise<ControllerResponse> {
    const { code, error, error_description } = data;

    if (error) {
      return {
        code: "GF0030009",
        error: error,
        message: error_description,
        success: false,
      };
    }

    const instagramAuth = this.getInstagramAuth(req);

    const response = await instagramAuth.exchangeCodeToLongLivedToken(code);

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
