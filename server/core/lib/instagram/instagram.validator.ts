import { InstagramValidatorType } from "./instagram.types";

class InstagramValidator {
  public generateOAuthUrl(scopes?: string[]): InstagramValidatorType {
    if (scopes && (!Array.isArray(scopes) || !scopes.length)) {
      return {
        success: false,
        message: "Invalid scopes",
      };
    }

    return {
      success: true,
    };
  }

  public exchangeCode(code: string) {
    if (!code?.trim()) {
      return {
        success: false,
        message: "Authorization code required",
      };
    }


    return {
      success: true,
    };
  }

  public getProfile(accessToken: string) {
    if (!accessToken?.trim()) {
      return {
        success: false,
        message: "Access token required",
      };
    }

    return {
      success: true,
    };
  }
}

export default new InstagramValidator();
