import { ValidatorResponse } from "../../core/types";
import { LoginRequestBody } from "./types";

class AuthValidator {
  public validateLogin({
    body,
  }: {
    body: Partial<LoginRequestBody>;
  }): ValidatorResponse {
    const { username, password } = body;

    if (!username) {
      return "GF0010001";
    }

    if (typeof username !== "string") {
      return "GF0010002";
    }

    if (username.trim().length < 3) {
      return "GF0010003";
    }
    if (!password) {
      return "GF0010004";
    }

    if (typeof password !== "string") {
      return "GF0010005";
    }

    if (password.trim().length < 4) {
      return "GF0010006";
    }
  }
}

export default new AuthValidator();
