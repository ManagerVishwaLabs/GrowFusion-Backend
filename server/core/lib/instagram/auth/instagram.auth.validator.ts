import { InstagramResponse } from "./instagram.auth.types";

class InstagramAuthValidator {
  public generateOAuthUrl(scopes?: string[]): InstagramResponse<void> {
    if (scopes) {
      if (!Array.isArray(scopes)) {
        return {
          code: "IG00010001",
          success: false,
        };
      }

      if (!scopes.length) {
        return {
          code: "IG00010002",
          success: false,
        };
      }

      if (scopes.some((scope) => !scope)) {
        return {
          code: "IG00010003",
          success: false,
        };
      }
    }

    return {
      data: undefined,
      success: true,
    };
  }

  public exchangeCode(code: string): InstagramResponse<void> {
    if (typeof code !== "string") {
      return {
        code: "IG00010004",
        success: false,
      };
    }

    if (!code?.trim()) {
      return {
        code: "IG00010005",
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
        code: "IG00010006",
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
        code: "IG00010007",
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
