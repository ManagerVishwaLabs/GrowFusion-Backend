import bcrypt from "bcryptjs";

import { env } from "../../config/env";
import CompanyLibrary from "../../library/company.lib";
import UserLibrary from "../../library/user.lib";
import { UserRole } from "../../utils/constants";
import { ControllerResponse } from "../../utils/types";
import { RegisterType } from "./auth.types";

class AuthController {
  public async register({
    body,
  }: {
    body: RegisterType;
  }): Promise<ControllerResponse> {
    try {
      const {
        aboutCompany,
        address,
        adminPhone,
        companyEmail,
        companyLogoUrl,
        companyName,
        companySize,
        contactPhone,
        country,
        designation,
        facebook,
        foundedYear,
        fullName,
        industry,
        instagram,
        lastName,
        linkedin,
        password,
        pincode,
        registrationNumber,
        twitter,
        userEmail,
        visionMission,
        website,
      } = body;

      const existingCompany =
        await CompanyLibrary.getCompanyByCompany(companyEmail);

      if (existingCompany.success && existingCompany.data) {
        return {
          code: "GF0040001",
          statusCode: 409,
          success: false,
        };
      }

      const existingUsername = await UserLibrary.getUserByUsername(userEmail);

      if (existingUsername.success && existingUsername.data) {
        return {
          code: "GF0050001",
          statusCode: 409,
          success: false,
        };
      }

      const createdCompany = await CompanyLibrary.createCompany({
        aboutCompany,
        address,
        company: companyEmail,
        companyLogoUrl,
        companyName,
        companySize,
        contactEmail: companyEmail,
        contactPhone,
        country,
        foundedYear,
        industry,
        pincode,
        registrationNumber,
        socialMedia: [linkedin, instagram, facebook, twitter],
        visionMission,
        website,
      });

      if (!createdCompany.success) {
        return {
          statusCode: 422,
          code: createdCompany.code,
          message: createdCompany.message,
          error: createdCompany.error,
          success: false,
        };
      }

      const pepper = env.PASSWORD_PEPPER;

      const hashedPassword = await bcrypt.hash(password + pepper, 10);

      const createdUser = await UserLibrary.createUser({
        company: companyEmail,
        designation,
        email: userEmail,
        fullName,
        lastName,
        passwordHash: hashedPassword,
        phoneNumber: adminPhone,
        username: userEmail,
        userRole: UserRole.ADMIN,
      });

      if (!createdUser.success) {
        return {
          statusCode: 422,
          code: createdUser.code,
          message: createdUser.message,
          error: createdUser.error,
          success: false,
        };
      }

      return {
        data: {
          company: createdCompany.data,
          user: createdUser.data,
        },
        statusCode: 201,
        success: true,
      };
    } catch (error) {
      console.log(`[AUTH CONTROLLER] error: ${error}`);

      return {
        statusCode: 500,
        code: "GF0020500",
        success: false,
      };
    }
  }

  public async login({
    body,
  }: {
    body: {
      username: string;
      password: string;
    };
  }): Promise<ControllerResponse> {
    try {
      const { password, username } = body;

      const response = await UserLibrary.getUserByUsername(username);

      if (!response.success || !response.data) {
        return {
          code: "GF0020020",
          statusCode: 401,
          success: false,
        };
      }

      const user = response.data;

      const pepper = env.PASSWORD_PEPPER;

      if (!user.passwordHash) {
        return {
          code: "GF0020020",
          statusCode: 401,
          success: false,
        };
      }
      const isPasswordValid = await bcrypt.compare(
        password + pepper,
        user.passwordHash,
      );

      if (!isPasswordValid) {
        return {
          statusCode: 401,
          code: "GF0020020",
          success: false,
        };
      }

      return {
        data: user,
        success: true,
      };
    } catch (error) {
      console.log(`[AUTH CONTROLLER] error: ${error}`);

      return {
        code: "GF0020501",
        statusCode: 500,
        success: false,
      };
    }
  }
}

export default new AuthController();
