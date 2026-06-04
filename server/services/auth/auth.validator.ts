import { ValidatorResponse } from "../../utils/types";

import { isEmailAddress } from "../../utils/helperFunctions";
import { RegisterType } from "./auth.types";

class AuthValidator {
  public validateRegister({
    body,
  }: {
    body: Partial<RegisterType>;
  }): ValidatorResponse {
    const {
      company,
      companyName,
      companyEmail,
      companySize,
      userEmail,
      firstName,
      password,
      username,
    } = body;
    if (!company) {
      return "GF0040010";
    }

    if (typeof company !== "string") {
      return "GF0040011";
    }

    if (company.trim().length < 2) {
      return "GF0040012";
    }

    if (!companyName) {
      return "GF0040013";
    }

    if (typeof companyName !== "string") {
      return "GF0040014";
    }

    if (companyName.trim().length < 2) {
      return "GF0040015";
    }

    if (!companyEmail) {
      return "GF0040019";
    }

    if (typeof companyEmail !== "string") {
      return "GF0040020";
    }

    if (!isEmailAddress(companyEmail)) {
      return "GF0040021";
    }

    if (companySize !== undefined) {
      if (typeof companySize !== "number") {
        return "GF0040024";
      }

      if (companySize < 1) {
        return "GF0040025";
      }
    }

    if (!firstName) {
      return "GF0030001";
    }

    if (typeof firstName !== "string") {
      return "GF0030002";
    }

    if (firstName.trim().length < 2) {
      return "GF0030003";
    }

    if (!userEmail) {
      return "GF0030004";
    }

    if (typeof userEmail !== "string") {
      return "GF0030005";
    }

    if (!isEmailAddress(userEmail.trim())) {
      return "GF0030006";
    }

    if (!username) {
      return "GF0030007";
    }

    if (typeof username !== "string") {
      return "GF0030008";
    }

    if (username.trim().length < 3) {
      return "GF0030009";
    }

    if (!company) {
      return "GF0030010";
    }

    if (typeof company !== "string") {
      return "GF0030011";
    }

    if (!password) {
      return "GF0030012";
    }

    if (typeof password !== "string") {
      return "GF0030013";
    }

    if (password.trim().length < 6) {
      return "GF0030014";
    }
  }
  public validateLogin({
    body,
  }: {
    body: {
      username: string;
      password: string;
    };
  }): ValidatorResponse {
    const { username, password } = body;

    if (!username) {
      return "GF0030029";
    }

    if (typeof username !== "string") {
      return "GF0030030";
    }

    if (username.trim().length < 3) {
      return "GF0030031";
    }

    if (!password) {
      return "GF0030012";
    }

    if (typeof password !== "string") {
      return "GF0030013";
    }

    if (password.trim().length < 6) {
      return "GF0030014";
    }
  }

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
    const { code, state, error, error_description } = query;

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

export default new AuthValidator();
