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

    if (!fullName) {
      return "GF0030001";
    }

    if (typeof fullName !== "string") {
      return "GF0030002";
    }

    if (fullName.trim().length < 2) {
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
    const { password, username } = body;

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
}

export default new AuthValidator();
