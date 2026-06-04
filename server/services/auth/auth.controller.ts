import bcrypt from "bcryptjs";

import { ControllerResponse } from "../../utils/types";
import { InstagramOauthRedirect, RegisterType } from "./auth.types";

import CompanyLibrary from "../../library/company.lib";
import UserLibrary from "../../library/user.lib";

import { env } from "../../config/env";
import { UserRole } from "../../utils/constants";
import instagramLib from "../../core/lib/instagram/";

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

  public async login({
    body,
  }: {
    body: {
      username: string;
      password: string;
    };
  }): Promise<ControllerResponse> {
    try {
      const { username, password } = body;

      const response = await UserLibrary.getUserByUsername(username);

      if (!response.success || !response.data) {
        return {
          success: false,
          code: "GF0020008",
        };
      }

      const user = response.data;

      const pepper = env.PASSWORD_PEPPER;

      if (!user.passwordHash) {
        return {
          success: false,
          code: "GF0020009",
        };
      }
      const isPasswordValid = await bcrypt.compare(
        password + pepper,
        user.passwordHash,
      );

      if (!isPasswordValid) {
        return {
          success: false,
          code: "GF0020007",
        };
      }

      return {
        success: true,
        data: {
          user: user,
        },
      };
    } catch (error) {
      console.log(`[AUTH CONTROLLER] error: ${error}`);

      return {
        success: false,
        code: "GF0020009",
      };
    }
  }

  public async instagramOauthRedirect({
    params,
  }: InstagramOauthRedirect): Promise<ControllerResponse> {
    const response = await instagramLib.generateOAuthUrl({
      scopes: params.scopes,
      state: params.state,
    });

    if (!response.success || !response.data) {
      return {
        success: false,
        code: "IG00010006",
      };
    }

    return {
      success: true,
      redirectUrl: response.data.url,
    };
  }

  public async instagramOauthCallback({
    query,
  }: {
    query: {
      code?: string;
      state?: string;
      error?: string;
      error_description?: string;
    };
  }): Promise<ControllerResponse> {
    const { code, error, error_description } = query;

    if (error) {
      return {
        success: false,
        code: "IG00020001",
        message: error_description,
      };
    }

    if (!code) {
      return {
        success: false,
        code: "IG00020002",
      };
    }

    const response = await instagramLib.exchangeCodeToLongLivedToken(code);

    if (!response.success) {
      return {
        success: false,
        code: "IG00020012",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  }

  public async getInstagramProfile({
    params,
  }: {
    params: {
      accessToken: string;
    };
  }): Promise<ControllerResponse> {
    const response = await instagramLib.getProfile(params.accessToken);

    if (!response.success || !response.data) {
      return {
        success: false,
        code: "IG00020009",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  }
}

export default new AuthController();
