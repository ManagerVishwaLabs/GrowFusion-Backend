import { InstagramResponse } from "./instagram.auth.types";

class InstagramAuthValidator {
  public generateOAuthUrl(scopes?: string[]): InstagramResponse<void> {
    if (scopes && (!Array.isArray(scopes) || !scopes.length)) {
      return {
        message: "Invalid scopes",
        success: false,
      };
    }

    return {
      data: undefined,
      success: true,
    };
  }

  public exchangeCode(code: string): InstagramResponse<void> {
    if (!code?.trim()) {
      return {
        message: "Authorization code required",
        success: false,
      };
    }

    return {
      data: undefined,
      success: true,
    };
  }

  public exchangeShortLivedToken(
    shortLivedToken: string,
  ): InstagramResponse<void> {
    if (!shortLivedToken?.trim()) {
      return {
        message: "Short lived token required",
        success: false,
      };
    }

    return {
      data: undefined,
      success: true,
    };
  }

  public refreshLongLivedToken(
    longLivedToken: string,
  ): InstagramResponse<void> {
    if (!longLivedToken?.trim()) {
      return {
        message: "Long lived token required",
        success: false,
      };
    }

    return {
      data: undefined,
      success: true,
    };
  }

  public getProfile(accessToken: string): InstagramResponse<void> {
    if (!accessToken?.trim()) {
      return {
        message: "Access token required",
        success: false,
      };
    }

    return {
      data: undefined,
      success: true,
    };
  }
}

export default new InstagramAuthValidator();
