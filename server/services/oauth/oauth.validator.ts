import { ValidatorResponse } from "../../utils/types";

class OAuthValidator {
  public validateInstagramOauthRedirect({
    params,
  }: {
    params: {
      scopes?: string[];
      state?: string;
    };
  }): ValidatorResponse {
    const { scopes, state } = params;

    if (scopes) {
      if (!Array.isArray(scopes)) {
        return "IG00010001";
      }

      if (scopes.length === 0) {
        return "IG00010002";
      }

      if (!scopes.every((scope) => typeof scope === "string")) {
        return "IG00010003";
      }
    }

    if (state) {
      if (typeof state !== "string") {
        return "IG00010004";
      }

      if (state.trim().length === 0) {
        return "IG00010005";
      }
    }

    return;
  }

  public validateInstagramOauthCallback({
    query,
  }: {
    query: {
      code?: string;
      state?: string;
      error?: string;
      error_description?: string;
    };
  }): ValidatorResponse {
    const { code, error, error_description, state } = query;

    if (error) {
      if (typeof error !== "string") {
        return "IG00020001";
      }

      if (error.trim().length === 0) {
        return "IG00020002";
      }

      if (error_description) {
        if (typeof error_description !== "string") {
          return "IG00020003";
        }

        if (error_description.trim().length === 0) {
          return "IG00020004";
        }
      }

      return "IG00020005";
    }

    if (!code) {
      return "IG00020006";
    }

    if (typeof code !== "string") {
      return "IG00020007";
    }

    if (code.trim().length === 0) {
      return "IG00020008";
    }

    if (state) {
      if (typeof state !== "string") {
        return "IG00020009";
      }

      if (state.trim().length === 0) {
        return "IG00020010";
      }
    }

    return;
  }
}

export default new OAuthValidator();
