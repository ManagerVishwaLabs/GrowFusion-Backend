import { QueryFilter } from "mongoose";

import DBModule from "../database/db.module";
import { Doc } from "../database/db.types";
import { DocumentId, LibraryResponse } from "../utils/types";
import { UserSessionType } from "../database/models/userSession.mode";

class UserSessionLibrary {
  private sessionModel;

  constructor() {
    this.sessionModel = DBModule.createModel("UserSession");
  }

  public async createSession(
    sessionData: UserSessionType,
  ): Promise<LibraryResponse> {
    const session = await this.sessionModel.insertOne(sessionData);

    if (!session.success) {
      return {
        code: "GF0060001",
        error: session.error,
        message: session.message,
        success: false,
      };
    }

    return {
      data: session.data,
      success: true,
    };
  }

  public async getSessionById(sessionId: DocumentId): Promise<LibraryResponse> {
    const session = await this.sessionModel.findById(sessionId);

    if (!session.success) {
      return {
        code: "GF0060002",
        error: session.error,
        message: session.message,
        success: false,
      };
    }

    return {
      data: session.data,
      success: true,
    };
  }

  public async getSessionByTokenId(
    tokenId: string,
  ): Promise<LibraryResponse<Doc<UserSessionType> | null>> {
    const session = await this.sessionModel.findOne({
      tokenId,
      isRevoked: false,
    });

    if (!session.success) {
      return {
        code: "GF0060003",
        error: session.error,
        message: session.message,
        success: false,
      };
    }

    return {
      data: session.data,
      success: true,
    };
  }

  public async getUserSessions(userId: DocumentId): Promise<LibraryResponse> {
    const sessions = await this.sessionModel.find({
      userId,

      isRevoked: false,
    });

    if (!sessions.success) {
      return {
        code: "GF0060004",
        error: sessions.error,
        message: sessions.message,
        success: false,
      };
    }

    return {
      data: sessions.data,
      success: true,
    };
  }

  public async revokeSession(tokenId: string): Promise<LibraryResponse> {
    const session = await this.sessionModel.updateOne(
      {
        tokenId,
      },
      {
        isRevoked: true,
        revokedAt: new Date(),
      },
    );

    if (!session.success) {
      return {
        code: "GF0060005",
        error: session.error,
        message: session.message,
        success: false,
      };
    }

    return {
      data: session.data,

      success: true,
    };
  }

  public async revokeAllUserSessions(
    userId: DocumentId,
  ): Promise<LibraryResponse> {
    const sessions = await this.sessionModel.updateMany(
      {
        userId,

        isRevoked: false,
      },
      {
        isRevoked: true,
        revokedAt: new Date(),
      },
    );

    if (!sessions.success) {
      return {
        code: "GF0060006",
        error: sessions.error,
        message: sessions.message,
        success: false,
      };
    }

    return {
      data: sessions.data,
      success: true,
    };
  }

  public async deleteExpiredSessions(): Promise<LibraryResponse> {
    const session = await this.sessionModel.deleteMany({
      expiresAt: {
        $lt: new Date(),
      },
    });

    if (!session.success) {
      return {
        code: "GF0060007",
        error: session.error,
        message: session.message,
        success: false,
      };
    }

    return {
      data: session.data,
      success: true,
    };
  }

  public async updateSession(
    filterConditions: QueryFilter<UserSessionType>,
    updateData: Partial<UserSessionType>,
  ): Promise<LibraryResponse> {
    const session = await this.sessionModel.updateOne(
      filterConditions,
      updateData,
    );

    if (!session.success) {
      return {
        code: "GF0060008",
        error: session.error,
        message: session.message,
        success: false,
      };
    }

    return {
      data: session.data,
      success: true,
    };
  }
}

export default new UserSessionLibrary();
