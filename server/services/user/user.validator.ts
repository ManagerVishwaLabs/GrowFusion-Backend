import { ValidatorResponse } from "../../core/types";

import { CreateUserType } from "../../database/models/user.model";

class UserValidator {
  public validateCreateUser({
    body,
  }: {
    body: Partial<CreateUserType>;
  }): ValidatorResponse {
    const { firstName, email, username, company, passwordHash } = body;

    if (!firstName) {
      return "GF0030001";
    }

    if (typeof firstName !== "string") {
      return "GF0030002";
    }

    if (firstName.trim().length < 2) {
      return "GF0030003";
    }

    if (!email) {
      return "GF0030004";
    }

    if (typeof email !== "string") {
      return "GF0030005";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
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

    if (!passwordHash) {
      return "GF0030012";
    }

    if (typeof passwordHash !== "string") {
      return "GF0030013";
    }

    if (passwordHash.trim().length < 6) {
      return "GF0030014";
    }
  }

  public validateUpdateUser({
    body,
  }: {
    body: Partial<CreateUserType>;
  }): ValidatorResponse {
    const { firstName, email, username, company } = body;

    if (firstName !== undefined) {
      if (typeof firstName !== "string") {
        return "GF0030015";
      }

      if (firstName.trim().length < 2) {
        return "GF0030016";
      }
    }

    if (email !== undefined) {
      if (typeof email !== "string") {
        return "GF0030017";
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email.trim())) {
        return "GF0030018";
      }
    }

    if (username !== undefined) {
      if (typeof username !== "string") {
        return "GF0030019";
      }

      if (username.trim().length < 3) {
        return "GF0030020";
      }
    }

    if (company !== undefined) {
      if (typeof company !== "string") {
        return "GF0030021";
      }
    }
  }
}

export default new UserValidator();
