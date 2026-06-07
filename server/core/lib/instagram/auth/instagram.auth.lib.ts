import axios from "../../../axios";
import { env } from "../../../../config/env";
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
import DBModule from "../../../../database/db.module";

class InstagramLib {
  private socialAccountModel;

  constructor() {
    this.socialAccountModel = DBModule.createModel("SocialMediaAccount");
  }

  public async generateOAuthUrl({
    scopes,
    state,
  }: GenerateOAuthUrlParams = {}): Promise<
    InstagramResponse<InstagramOAuthUrl>
  > {
    const selectedScopes = scopes?.length ? scopes : DEFAULT_SCOPES;

    const params = new URLSearchParams({
      client_id: env.INSTAGRAM_CLIENT_ID,
      redirect_uri: env.INSTAGRAM_REDIRECT_URI,
      response_type: "code",
      scope: selectedScopes.join(","),
      force_reauth: env.INSTAGRAM_FORCE_RE_AUTH || "true",
    });

    if (state) {
      params.append("state", state);
    }

    return {
      success: true,
      data: {
        url: `${INSTAGRAM_OAUTH_URL}?${params.toString()}`,
        scopes: selectedScopes,
      },
    };
  }

  public async exchangeCode(
    code: string,
  ): Promise<InstagramResponse<InstagramShortLivedToken>> {
    const form = new URLSearchParams({
      client_id: env.INSTAGRAM_CLIENT_ID,
      client_secret: env.INSTAGRAM_CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: env.INSTAGRAM_REDIRECT_URI,
      code,
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
        success: false,
        message: response.message || "Failed to exchange code for token",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  }

  public async exchangeShortLivedToken(
    tokenApiUserId: string,
    shortLivedToken: string,
    scopes?: string[],
  ): Promise<InstagramResponse<InstagramLongLivedToken>> {
    const response = await axios.get<InstagramLongLivedToken>(
      INSTAGRAM_GRAPH_API_URL + "/access_token",
      {
        params: {
          grant_type: "ig_exchange_token",
          client_secret: env.INSTAGRAM_CLIENT_SECRET,
          access_token: shortLivedToken,
        },
      },
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        message: response.message || "Failed to exchange token for token",
      };
    }

    try {
      await this.socialAccountModel.updateOne(
        {
          tokenApiUserId,
        },
        {
          mediaName: "instagram",
          accessToken: response.data.access_token,
          tokenExpiresAt: new Date(
            Date.now() + response.data.expires_in * 1000,
          ),
          scopes: scopes,
        },
        {
          upsert: true,
        },
      );
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to save social account",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  }

  public async refreshLongLivedToken(
    tokenApiUserId: string,
    longLivedToken: string,
  ): Promise<InstagramResponse<InstagramLongLivedToken>> {
    const response = await axios.get<InstagramLongLivedToken>(
      INSTAGRAM_GRAPH_API_URL + "/refresh_access_token",
      {
        params: {
          grant_type: "ig_refresh_token",
          access_token: longLivedToken,
        },
      },
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        message: response.message || "Failed to refresh token",
      };
    }

    try {
      this.socialAccountModel.updateOne(
        {
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
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to save social account",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  }
}

export default new InstagramLib();
