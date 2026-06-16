import { isEmailAddress } from "../../utils/helperFunctions";
import { ValidatorResponse } from "../../utils/types";
import { RegisterType } from "./auth.types";

class AuthValidator {
  public validateRegister({
    body,
  }: {
    body: Partial<RegisterType>;
  }): ValidatorResponse {
    const { companyEmail, companyName, fullName, password, userEmail } = body;

    if (!companyName) {
      return "GF0020001";
    }

    if (typeof companyName !== "string") {
      return "GF0020002";
    }

    if (companyName.trim().length < 2) {
      return "GF0020003";
    }

    if (!companyEmail) {
      return "GF0020004";
    }

    if (typeof companyEmail !== "string") {
      return "GF0020005";
    }

    if (!isEmailAddress(companyEmail)) {
      return "GF0020006";
    }

    if (!fullName) {
      return "GF0020007";
    }

    if (typeof fullName !== "string") {
      return "GF0020008";
    }

    if (fullName.trim().length < 2) {
      return "GF0020009";
    }

    if (!userEmail) {
      return "GF0020010";
    }

    if (typeof userEmail !== "string") {
      return "GF0020011";
    }

    if (!isEmailAddress(userEmail.trim())) {
      return "GF0020012";
    }

    if (!password) {
      return "GF0020013";
    }

    if (typeof password !== "string") {
      return "GF0020014";
    }

    if (password.trim().length < 8) {
      return "GF0020015";
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
    const { password, username } = body;

    if (!username) {
      return "GF0020016";
    }

    if (typeof username !== "string") {
      return "GF0020017";
    }

    if (username.trim().length < 3) {
      return "GF0020018";
    }

    if (!password) {
      return "GF0020013";
    }

    if (typeof password !== "string") {
      return "GF0020014";
    }

    if (password.trim().length < 8) {
      return "GF0020015";
    }
  }
}

export default new AuthValidator();
