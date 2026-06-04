import { InstagramResponse } from "./instagram.auth.types";

class InstagramAuthValidator {
  public generateOAuthUrl(scopes?: string[]): InstagramResponse<void> {
    if (scopes && (!Array.isArray(scopes) || !scopes.length)) {
      return {
        success: false,
        message: "Invalid scopes",
      };
    }

    return {
      success: true,
      data: undefined,
    };
  }

  public exchangeCode(code: string): InstagramResponse<void> {
    if (!code?.trim()) {
      return {
        success: false,
        message: "Authorization code required",
      };
    }

    return {
      success: true,
      data: undefined,
    };
  }

  public exchangeShortLivedToken(
    shortLivedToken: string,
  ): InstagramResponse<void> {
    if (!shortLivedToken?.trim()) {
      return {
        success: false,
        message: "Short lived token required",
      };
    }

    return {
      success: true,
      data: undefined,
    };
  }

  public refreshLongLivedToken(
    longLivedToken: string,
  ): InstagramResponse<void> {
    if (!longLivedToken?.trim()) {
      return {
        success: false,
        message: "Long lived token required",
      };
    }

    return {
      success: true,
      data: undefined,
    };
  }

  public getProfile(accessToken: string): InstagramResponse<void> {
    if (!accessToken?.trim()) {
      return {
        success: false,
        message: "Access token required",
      };
    }

    return {
      success: true,
      data: undefined,
    };
  }
}

export default new InstagramAuthValidator();
