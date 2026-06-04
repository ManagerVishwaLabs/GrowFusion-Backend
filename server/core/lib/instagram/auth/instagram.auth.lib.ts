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
  InstagramProfile,
  InstagramResponse,
  InstagramShortLivedToken,
} from "./instagram.auth.types";

class InstagramLib {
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
    shortLivedToken: string,
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

    return {
      success: true,
      data: response.data,
    };
  }

  public async refreshLongLivedToken(
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

    return {
      success: true,
      data: response.data,
    };
  }

  // public async getMe<T>(accessToken: string, fields: string[]): Promise<InstagramResponse<T>> {
  //   const response = await axios.get<T>(
  //     "https://graph.instagram.com/me",
  //     {
  //       params: {
  //         fields: fields.join(","),
  //         access_token: accessToken,
  //       },
  //     },
  //   );

  //   return response.data;
  // }

  // public async validateToken(accessToken: string): Promise<boolean> {
  //   try {
  //     await this.getProfile(accessToken);
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // }

  // public async publishImage() {
  //   throw new Error(
  //     "Not implemented. Requires Instagram Graph API publishing endpoints.",
  //   );
  // }

  // public async publishReel() {
  //   throw new Error(
  //     "Not implemented. Requires Instagram Graph API publishing endpoints.",
  //   );
  // }
}

export default new InstagramLib();
