import { env } from "../../../config/env";
import { DEFAULT_SCOPES, INSTAGRAM_AUTH_URL } from "../constants.lib";
import { GenerateOAuthUrlParams, InstagramLibType } from "./instagram.types";

class InstagramLib {
  public async generateOAuthUrl({
    scopes,
    state,
  }: GenerateOAuthUrlParams = {}): Promise<InstagramLibType> {
    const selectedScopes = scopes?.length ? scopes : DEFAULT_SCOPES;

    const params = new URLSearchParams({
      client_id: env.INSTAGRAM_CLIENT_ID,
      redirect_uri: env.INSTAGRAM_REDIRECT_URI,
      response_type: "code",
      scope: selectedScopes.join(","),
      force_reauth: "true",
    });

    if (state) {
      params.append("state", state);
    }

    return {
      success: true,
      data: {
        url: `${INSTAGRAM_AUTH_URL}?${params.toString()}`,
        scopes: selectedScopes,
      },
    };
  }

  public async exchangeCode(code: string) {
    const response = await fetch(
      "https://api.instagram.com/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: env.INSTAGRAM_CLIENT_ID,
          grant_type: "authorization_code",
          redirect_uri: env.INSTAGRAM_REDIRECT_URI,
          code,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data,
      };
    }

    return {
      success: true,
      data: {
        accessToken: data.access_token,
        userId: data.user_id,
        permissions: data.permissions,
      },
    };
  }

  public async getProfile(_accessToken: string) {}

  public async publishImage() {}

  public async publishReel() {}
}

export default new InstagramLib();
