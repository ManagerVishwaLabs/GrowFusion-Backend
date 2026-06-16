import env from "../../../../config/env";
import DBModule from "../../../../database/db.module";
import { UserType } from "../../../../database/models/user.model";
import axios from "../../../axios";
import {
  DEFAULT_SCOPES,
  INSTAGRAM_CODE_EXCHANGE_URL,
  INSTAGRAM_GRAPH_API_URL,
  INSTAGRAM_OAUTH_URL,
} from "../instagram.constants";
import {
  GenerateOAuthUrlParams,
  InstagramLongLivedToken,
  InstagramOAuthUrl,
  InstagramResponse,
  InstagramShortLivedToken,
} from "./instagram.auth.types";

class InstagramAuthLib {
  private socialAccountModel;
  private user: UserType | undefined;

  constructor(user: UserType | undefined) {
    this.user = user;
    this.socialAccountModel = DBModule.createModel("SocialMediaAccount");
  }

  public async generateOAuthUrl({
    scopes,
    state,
  }: GenerateOAuthUrlParams = {}): Promise<
    InstagramResponse<InstagramOAuthUrl>
  > {
    try {
      const selectedScopes = scopes?.length ? scopes : DEFAULT_SCOPES;

      const params = new URLSearchParams({
        client_id: env.INSTAGRAM_CLIENT_ID,
        force_reauth: env.INSTAGRAM_FORCE_RE_AUTH || "true",
        redirect_uri: env.INSTAGRAM_REDIRECT_URI,
        response_type: "code",
        scope: selectedScopes.join(","),
      });

      if (state) {
        params.append("state", state);
      }

      return {
        data: {
          scopes: selectedScopes,
          url: `${INSTAGRAM_OAUTH_URL}?${params.toString()}`,
        },
        success: true,
      };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate OAuth URL",
        code: "IG00020006",
        success: false,
      };
    }
  }

  public async exchangeCode(
    code: string,
  ): Promise<InstagramResponse<InstagramShortLivedToken>> {
    try {
      const form = new URLSearchParams({
        client_id: env.INSTAGRAM_CLIENT_ID,
        client_secret: env.INSTAGRAM_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: env.INSTAGRAM_REDIRECT_URI,
      });

      const response = await axios.post<InstagramShortLivedToken>(
        INSTAGRAM_CODE_EXCHANGE_URL,
        form,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      if (!response.success || !response.data) {
        return {
          code: "IG00020001",
          error: response.message || "Failed to exchange code for token",
          success: false,
        };
      }

      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return {
        code: "IG00020006",
        error:
          error instanceof Error
            ? error.message
            : "Failed to exchange code for token",
        success: false,
      };
    }
  }

  public async exchangeShortLivedToken(
    tokenApiUserId: string,
    shortLivedToken: string,
    scopes?: string[],
  ): Promise<InstagramResponse<InstagramLongLivedToken>> {
    try {
      const response = await axios.get<InstagramLongLivedToken>(
        INSTAGRAM_GRAPH_API_URL + "/access_token",
        {
          params: {
            access_token: shortLivedToken,
            client_secret: env.INSTAGRAM_CLIENT_SECRET,
            grant_type: "ig_exchange_token",
          },
        },
      );

      if (!response.success || !response.data) {
        return {
          code: "IG00020002",
          error: response.message || "Failed to exchange token for token",
          success: false,
        };
      }

      try {
        await this.socialAccountModel.updateOne(
          {
            tokenApiUserId,
          },
          {
            accessToken: response.data.access_token,
            company: this.user?.company,
            mediaName: "instagram",
            scopes: scopes,
            tokenExpiresAt: new Date(
              Date.now() + response.data.expires_in * 1000,
            ),
            username: this.user?.username,
          },
          {
            upsert: true,
          },
        );
      } catch (error) {
        return {
          code: "IG00020003",
          error:
            error instanceof Error
              ? error.message
              : "Failed to save social account",
          success: false,
        };
      }

      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return {
        code: "IG00020006",
        error:
          error instanceof Error
            ? error.message
            : "Failed to exchange short-lived token for long-lived token",
        success: false,
      };
    }
  }
  public async refreshLongLivedToken(
    tokenApiUserId: string,
    longLivedToken: string,
  ): Promise<InstagramResponse<InstagramLongLivedToken>> {
    try {
      const response = await axios.get<InstagramLongLivedToken>(
        INSTAGRAM_GRAPH_API_URL + "/refresh_access_token",
        {
          params: {
            access_token: longLivedToken,
            grant_type: "ig_refresh_token",
          },
        },
      );

      if (!response.success || !response.data) {
        return {
          code: "IG00020004",
          error: response.message || "Failed to refresh token",
          success: false,
        };
      }

      try {
        this.socialAccountModel.updateOne(
          {
            username: this.user?.username,
            company: this.user?.company,
            tokenApiUserId,
          },
          {
            accessToken: response.data.access_token,
            tokenExpiresAt: new Date(
              Date.now() + response.data.expires_in * 1000,
            ),
          },
        );
      } catch (error) {
        return {
          code: "IG00020005",
          error:
            error instanceof Error
              ? error.message
              : "Failed to save social account",
          success: false,
        };
      }

      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return {
        code: "IG00020006",
        error:
          error instanceof Error ? error.message : "Failed to refresh token",
        success: false,
      };
    }
  }
}

export default InstagramAuthLib;
