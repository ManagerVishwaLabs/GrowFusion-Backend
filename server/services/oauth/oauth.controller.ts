import jwt from "jsonwebtoken";

import env from "../../config/env";
import { UserType } from "../../database/models/user.model";
import Instagram from "../../library/instagram";
import InstagramAuth from "../../library/instagram/auth";
import { ErrorCode } from "../../utils/errors";
import { ControllerResponse, ControllerType } from "../../utils/types";
import { InstagramOauthRedirect } from "./oauth.types";

class OAuthController {
  public async instagramOauthRedirect({
    data,
    req,
  }: ControllerType<InstagramOauthRedirect>): Promise<ControllerResponse> {
    if (!req?.user) {
      return {
        code: "GF0090006",
        error: "User not found",
        success: false,
      };
    }

    const state = jwt.sign(
      {
        username: req.user.username,
        company: req.user.company,
        nonce: crypto.randomUUID(),
      },
      env.INSTAGRAM_STATE_JWT_SECRET,
      { expiresIn: "10m" },
    );

    const response = await InstagramAuth.generateOAuthUrl({
      scopes: data.scopes,
      state,
    });

    if (!response.success) {
      return {
        code: response.code,
        error: response.error,
        success: false,
      };
    }

    return {
      data: null,
      redirectUrl: response.data.url,
      success: true,
    };
  }

  public async instagramOauthCallback({
    data,
  }: ControllerType<{
    code: string;
    state: string;
    error?: string;
    error_description?: string;
  }>): Promise<ControllerResponse> {
    const { code, state, error, error_description } = data;

    if (error) {
      return {
        code: "GF0030009",
        error: error,
        message: error_description,
        success: false,
      };
    }

    const shortTokenRes = await InstagramAuth.exchangeCode(code);

    if (!shortTokenRes.success) {
      return shortTokenRes;
    }

    const shortLived = shortTokenRes.data;
    const user = jwt.verify(state, env.INSTAGRAM_STATE_JWT_SECRET) as UserType;

    const longTokenRes = await InstagramAuth.exchangeShortLivedToken(
      user,
      shortLived.user_id,
      shortLived.access_token,
      shortLived.permissions,
    );

    try {
      const instagram = await Instagram.init(user);
      const profileRes = await instagram.getProfile();

      if (!profileRes.success) {
        return profileRes;
      }
    } catch (error) {
      return {
        code:
          error instanceof Error ? (error.message as ErrorCode) : "IG00020006",
        success: false,
      };
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

export default new OAuthController();
