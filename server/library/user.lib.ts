import { QueryFilter } from "mongoose";

import DBModule from "../database/db.module";
import { Doc } from "../database/db.types";
import { UserType } from "../database/models/user.model";
import { DocumentId, LibraryResponse } from "../utils/types";

class UserLibrary {
  private userModel;

  constructor() {
    this.userModel = DBModule.createModel("User");
  }

  public async createUser(userData: UserType): Promise<LibraryResponse> {
    const existingUsername = await this.getUserByUsername(userData.username);

    if (existingUsername.success && existingUsername.data) {
      return {
        code: "GF0050001",
        success: false,
      };
    }

    const user = await this.userModel.insertOne(userData);

    if (!user.success) {
      return {
        code: "GF0050002",
        error: user.error,
        message: user.message,
        success: false,
      };
    }

    return {
      data: user.data,
      success: true,
    };
  }

  public async getUserById(
    userId: DocumentId,
  ): Promise<LibraryResponse<Doc<UserType>>> {
    const user = await this.userModel.findById(userId);

    if (!user.success) {
      return {
        code: "GF0050003",
        error: user.error,
        message: user.message,
        success: false,
      };
    }

    if (!user.data) {
      return {
        code: "GF0050003",
        success: false,
      };
    }

    return {
      data: user.data,
      success: true,
    };
  }
  public async getUsersByIds(
    userIds: DocumentId[],
  ): Promise<LibraryResponse<Doc<UserType>[]>> {
    const users = await this.userModel.findByIds(userIds);

    if (!users.success) {
      return {
        code: "GF0050003",
        error: users.error,
        message: users.message,
        success: false,
      };
    }

    if (!users.data) {
      return {
        code: "GF0050003",
        success: false,
      };
    }

    return {
      data: users.data,
      success: true,
    };
  }

  public async getUserByUsername(
    username: string,
  ): Promise<LibraryResponse<Doc<UserType>>> {
    const user = await this.userModel.findOne({
      username,
    });

    if (!user.success) {
      return {
        code: "GF0050003",
        error: user.error,
        message: user.message,
        success: false,
      };
    }

    if (!user.data) {
      return {
        code: "GF0050003",
        success: false,
      };
    }

    return {
      data: user.data,
      success: true,
    };
  }

  public async getPasswordByUsername(
    username: string,
  ): Promise<LibraryResponse<Doc<UserType> | null>> {
    const user = await this.userModel.findOne({ username });

    if (!user.success) {
      return {
        code: "GF0050003",
        error: user.error,
        message: user.message,
        success: false,
      };
    }

    return {
      data: user.data,
      success: true,
    };
  }

  public async getUsersByCompany(company: string): Promise<LibraryResponse> {
    const users = await this.userModel.find({
      company,
    });

    if (!users.success) {
      return {
        code: "GF0050003",
        error: users.error,
        message: users.message,
        success: false,
      };
    }

    return {
      data: users.data,
      success: true,
    };
  }

  public async updateUserById(
    userId: DocumentId,
    updateData: Partial<UserType>,
  ): Promise<LibraryResponse> {
    const user = await this.userModel.updateById(userId, updateData);

    if (!user.success) {
      return {
        code: "GF0050004",
        error: user.error,
        message: user.message,
        success: false,
      };
    }

    return {
      data: user.data,
      success: true,
    };
  }

  public async updateUsersByIds(
    userIds: DocumentId[],
    updateData: Partial<UserType>,
  ): Promise<LibraryResponse> {
    const users = await this.userModel.updateByIds(userIds, updateData);

    if (!users.success) {
      return {
        code: "GF0050004",
        error: users.error,
        message: users.message,
        success: false,
      };
    }

    return {
      data: users.data,
      success: true,
    };
  }

  public async updateUser(
    filterConditions: QueryFilter<UserType>,
    updateData: Partial<UserType>,
  ): Promise<LibraryResponse> {
    const user = await this.userModel.updateOne(filterConditions, updateData);

    if (!user.success) {
      return {
        code: "GF0050004",
        error: user.error,
        message: user.message,
        success: false,
      };
    }

    return {
      data: user.data,
      success: true,
    };
  }

  public async updateUsers(
    filterConditions: QueryFilter<UserType>,
    updateData: Partial<UserType>,
  ): Promise<LibraryResponse> {
    const user = await this.userModel.updateMany(filterConditions, updateData);

    if (!user.success) {
      return {
        code: "GF0050004",
        error: user.error,
        message: user.message,
        success: false,
      };
    }

    return {
      data: user.data,
      success: true,
    };
  }

  public async deleteUserById(userId: DocumentId): Promise<LibraryResponse> {
    const user = await this.userModel.deleteById(userId);

    if (!user.success) {
      return {
        code: "GF0050005",
        error: user.error,
        message: user.message,
        success: false,
      };
    }

    return {
      data: user.data,
      success: true,
    };
  }

  public async deleteUsersByIds(
    userIds: DocumentId[],
  ): Promise<LibraryResponse> {
    const user = await this.userModel.deleteByIds(userIds);

    if (!user.success) {
      return {
        code: "GF0050005",
        error: user.error,
        message: user.message,
        success: false,
      };
    }

    return {
      data: user.data,
      success: true,
    };
  }

  public async deleteUser(
    filterConditions: QueryFilter<UserType>,
  ): Promise<LibraryResponse> {
    const user = await this.userModel.deleteOne(filterConditions);

    if (!user.success) {
      return {
        code: "GF0050005",
        error: user.error,
        message: user.message,
        success: false,
      };
    }

    return {
      data: user.data,
      success: true,
    };
  }

  public async deleteUsers(
    filterConditions: QueryFilter<UserType>,
  ): Promise<LibraryResponse> {
    const user = await this.userModel.deleteMany(filterConditions);

    if (!user.success) {
      return {
        code: "GF0050005",
        error: user.error,
        message: user.message,
        success: false,
      };
    }

    return {
      data: user.data,
      success: true,
    };
  }

  public async deleteUserByUsername(
    username: string,
  ): Promise<LibraryResponse> {
    const user = await this.userModel.deleteOne({
      username: username,
    });

    if (!user.success) {
      return {
        code: "GF0050005",
        error: user.error,
        message: user.message,
        success: false,
      };
    }

    return {
      data: user.data,
      success: true,
    };
  }
}

export default new UserLibrary();
