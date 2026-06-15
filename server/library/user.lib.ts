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
        code: "GF0020003",
        success: false,
      };
    }
    const user = await this.userModel.insertOne(userData);

    return {
      data: user,
      success: true,
    };
  }

  public async getUserById(userId: DocumentId): Promise<LibraryResponse> {
    const user = await this.userModel.findById(userId);

    return {
      data: user,
      success: true,
    };
  }
  public async getUsersByIds(userIds: DocumentId[]): Promise<LibraryResponse> {
    const users = await this.userModel.findByIds(userIds);

    return {
      data: users,
      success: true,
    };
  }

  public async getUserByUsername(
    username: string,
  ): Promise<LibraryResponse<Doc<UserType> | null>> {
    const user = await this.userModel.findOne({
      username,
    });

    if (user.success) {
      return {
        data: user.data,
        success: true,
      };
    }
    return {
      code: user.code,
      success: false,
    };
  }

  public async getPasswordByUsername(
    username: string,
  ): Promise<LibraryResponse<Doc<UserType> | null>> {
    const user = await this.userModel.findOne({ username });
    if (user.success) {
      return {
        data: user.data,
        success: true,
      };
    }

    return {
      code: user.code,
      success: false,
    };
  }

  public async getUsersByCompany(company: string): Promise<LibraryResponse> {
    const users = await this.userModel.find({
      company,
    });

    return {
      data: users,
      success: true,
    };
  }

  public async updateUserById(
    userId: DocumentId,
    updateData: Partial<UserType>,
  ): Promise<LibraryResponse> {
    const user = await this.userModel.updateById(userId, updateData);

    return {
      data: user,
      success: true,
    };
  }

  public async updateUsersByIds(
    userIds: DocumentId[],
    updateData: Partial<UserType>,
  ): Promise<LibraryResponse> {
    const users = await this.userModel.updateByIds(userIds, updateData);

    return {
      data: users,
      success: true,
    };
  }

  public async updateUser(
    filterConditions: QueryFilter<UserType>,
    updateData: Partial<UserType>,
  ): Promise<LibraryResponse> {
    const user = await this.userModel.updateOne(filterConditions, updateData);

    return {
      data: user,
      success: true,
    };
  }

  public async updateUsers(
    filterConditions: QueryFilter<UserType>,
    updateData: Partial<UserType>,
  ): Promise<LibraryResponse> {
    const user = await this.userModel.updateMany(filterConditions, updateData);

    return {
      data: user,
      success: true,
    };
  }

  public async deleteUserById(userId: DocumentId): Promise<LibraryResponse> {
    const user = await this.userModel.deleteById(userId);

    return {
      data: user,
      success: true,
    };
  }

  public async deleteUsersByIds(
    userIds: DocumentId[],
  ): Promise<LibraryResponse> {
    const user = await this.userModel.deleteByIds(userIds);

    return {
      data: user,
      success: true,
    };
  }

  public async deleteUser(
    filterConditions: QueryFilter<UserType>,
  ): Promise<LibraryResponse> {
    const user = await this.userModel.deleteOne(filterConditions);

    return {
      data: user,
      success: true,
    };
  }

  public async deleteUsers(
    filterConditions: QueryFilter<UserType>,
  ): Promise<LibraryResponse> {
    const user = await this.userModel.deleteMany(filterConditions);

    return {
      data: user,
      success: true,
    };
  }

  public async deleteUserByUsername(
    username: string,
  ): Promise<LibraryResponse> {
    const user = await this.userModel.deleteOne({
      username: username,
    });

    return {
      data: user,
      success: true,
    };
  }
}

export default new UserLibrary();
