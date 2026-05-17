import bcrypt from "bcryptjs";

import { ControllerResponse } from "../../core/types";
import { RegisterType } from "./auth.types";

import CompanyLibrary from "../../library/company.lib";
import UserLibrary from "../../library/user.lib";

import { env } from "../../config/env";
import { UserRole } from "../../utils/commonConstants";

class AuthController {
  public async register({
    body,
  }: {
    body: RegisterType;
  }): Promise<ControllerResponse> {
    try {
      const {
        company,
        companyName,
        address,
        contactPhone,
        companyLogoUrl,
        companyEmail,
        companySize,
        firstName,
        userEmail,
        username,
        password,
        lastName,
      } = body;

      const createdCompany = await CompanyLibrary.createCompany({
        company,
        companyName,
        address,
        contactPhone,
        companyLogoUrl,
        contactEmail: companyEmail,
        companySize,
      });

      if (!createdCompany.success) {
        return {
          success: false,
          code: createdCompany.code,
        };
      }

      if (!createdCompany.data) {
        return {
          success: false,
          code: "GF0020004",
        };
      }

      const pepper = env.PASSWORD_PEPPER;

      const hashedPassword = await bcrypt.hash(password + pepper, 10);

      const createdUser = await UserLibrary.createUser({
        firstName,
        lastName,
        email: userEmail,
        username,
        passwordHash: hashedPassword,
        company: company,
        userRole: UserRole.ADMIN,
      });

      if (!createdUser.success) {
        return {
          success: false,
          code: createdUser.code,
        };
      }

      if (!createdUser.data) {
        return {
          success: false,
          code: "GF0020004",
        };
      }

      return {
        success: true,
        data: {
          company: createdCompany,
          user: createdUser,
        },
      };
    } catch (error) {
      console.log(`[AUTH CONTROLLER] error: ${error}`);

      return {
        success: false,
        code: "GF0020004",
      };
    }
  }
}

export default new AuthController();
