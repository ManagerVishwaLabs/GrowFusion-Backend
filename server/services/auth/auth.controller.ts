import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import env from "../../config/env";
import { createAccessToken, createRefreshToken } from "../../config/jwt";
import CompanyLibrary from "../../library/company.lib";
import UserLibrary from "../../library/user.lib";
import userSessionLib from "../../library/userSession.lib";
import { UserRole } from "../../utils/constants";
import {
  ControllerResponse,
  ControllerType,
  RefreshTokenPayload,
} from "../../utils/types";
import { LoginType, RegisterType } from "./auth.types";

class AuthController {
  public async register({
    data,
  }: ControllerType<RegisterType>): Promise<ControllerResponse> {
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
      } = data;

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
    data,
    req,
    res,
  }: ControllerType<LoginType>): Promise<ControllerResponse> {
    try {
      const { password, username } = data;

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

      const accessToken = createAccessToken({
        userId: user.id,
        username: user.username,
        role: user.userRole,
        company: user.company,
      });

      const refreshToken = createRefreshToken({
        userId: user.id,
      });

      const decoded = jwt.decode(refreshToken) as {
        jti: string;
        exp: number;
      };

      const sessionResponse = await userSessionLib.createSession({
        userId: user._id,
        tokenId: decoded.jti,
        refreshTokenHash: await bcrypt.hash(refreshToken, 10),
        expiresAt: new Date(decoded.exp * 1000),
        userAgent: req?.headers["user-agent"],
        ipAddress: req?.ip,
      });

      res?.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      if (!sessionResponse.success) {
        return {
          code: sessionResponse.code,
          error: sessionResponse.error,
          statusCode: 401,
          success: false,
        };
      }

      return {
        data: { accessToken },
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

  public async refresh({
    req,
    res,
  }: ControllerType<void>): Promise<ControllerResponse> {
    try {
      const refreshToken = req?.cookies?.refreshToken;

      if (!refreshToken) {
        return {
          success: false,
          code: "GF0020021",
          statusCode: 401,
        };
      }

      const decoded = jwt.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET,
      ) as RefreshTokenPayload;

      const session = await userSessionLib.getSessionByTokenId(decoded.jti);

      if (!session.success || !session.data) {
        return {
          success: false,
          code: "GF0020022",
          statusCode: 401,
        };
      }

      if (session.data.isRevoked) {
        return {
          success: false,
          code: "GF0020023",
          statusCode: 401,
        };
      }

      const valid = await bcrypt.compare(
        refreshToken,
        session.data.refreshTokenHash,
      );

      if (!valid) {
        return {
          success: false,
          code: "GF0020023",
          statusCode: 401,
        };
      }

      await userSessionLib.revokeSession(decoded.jti);
      const user = await UserLibrary.getUserById(decoded?.sub);

      if (!user.success || !user.data) {
        return {
          success: false,
          code: "GF0020023",
          statusCode: 401,
        };
      }

      const accessToken = createAccessToken({
        userId: user.data.id,
        username: user.data.username,
        role: user.data.userRole,
        company: user.data.company,
      });

      const newRefresh = createRefreshToken({
        userId: user.data.id,
      });

      const newDecoded = jwt.decode(newRefresh) as RefreshTokenPayload;

      await userSessionLib.createSession({
        userId: user.data._id,
        tokenId: newDecoded.jti,
        refreshTokenHash: await bcrypt.hash(newRefresh, 10),
        expiresAt: new Date(newDecoded.exp * 1000),
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip,
      });

      res?.cookie("refreshToken", newRefresh, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return {
        success: true,
        data: {
          accessToken,
        },
      };
    } catch {
      return {
        success: false,
        code: "GF0020023",
        statusCode: 401,
      };
    }
  }

  public async logout({
    req,
    res,
  }: ControllerType<void>): Promise<ControllerResponse> {
    try {
      const refreshToken = req?.cookies?.refreshToken;

      if (!refreshToken) {
        return {
          success: true,
        };
      }

      const decoded = jwt.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET,
      ) as RefreshTokenPayload;

      await userSessionLib.revokeSession(decoded.jti);

      res?.clearCookie("refreshToken", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return {
        success: true,
      };
    } catch {
      res?.clearCookie("refreshToken", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return {
        success: true,
      };
    }
  }
}

export default new AuthController();
