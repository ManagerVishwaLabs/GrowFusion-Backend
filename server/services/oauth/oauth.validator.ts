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
        return "GF0030001";
      }

      if (scopes.length === 0) {
        return "GF0030002";
      }

      if (!scopes.every((scope) => typeof scope === "string")) {
        return "GF0030003";
      }
    }

    if (state) {
      if (typeof state !== "string") {
        return "GF0030004";
      }

      if (state.trim().length === 0) {
        return "GF0030005";
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
    const { code, state } = query;

    if (!code) {
      return "GF0030006";
    }

    if (typeof code !== "string") {
      return "GF0030007";
    }

    if (code.trim().length === 0) {
      return "GF0030008";
    }

    if (state) {
      if (typeof state !== "string") {
        return "GF0030004";
      }

      if (state.trim().length === 0) {
        return "GF0030005";
      }
    }

    return;
  }
}

export default new OAuthValidator();
