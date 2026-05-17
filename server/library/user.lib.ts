import { QueryFilter } from "mongoose";
import { DocumentId, LibraryResponse } from "../utils/types";

import DBModule from "../database/db.module";

import { UserType } from "../database/models/user.model";

class UserLibrary {
  private userModel;

  constructor() {
    this.userModel = DBModule.createModel("User");
  }

  public async createUser(userData: UserType): Promise<LibraryResponse> {
    const existingUsername = await this.getUserByUsername(userData.username);

    if (existingUsername.success && existingUsername.data) {
      return {
        success: false,
        code: "GF0020003",
      };
    }
    const user = await this.userModel.insertOne(userData);

    return {
      success: true,
      data: user,
    };
  }

  public async getUserById(userId: DocumentId): Promise<LibraryResponse> {
    const user = await this.userModel.findById(userId);

    return {
      success: true,
      data: user,
    };
  }
  public async getUsersByIds(userIds: DocumentId[]): Promise<LibraryResponse> {
    const users = await this.userModel.findByIds(userIds);

    return {
      success: true,
      data: users,
    };
  }

  public async getUserByUsername(username: string): Promise<LibraryResponse> {
    const user = await this.userModel.findOne({
      username,
    });

    return {
      success: true,
      data: user,
    };
  }

  public async getUsersByCompany(company: string): Promise<LibraryResponse> {
    const users = await this.userModel.find({
      company,
    });

    return {
      success: true,
      data: users,
    };
  }

  public async updateUserById(
    userId: DocumentId,
    updateData: Partial<UserType>,
  ): Promise<LibraryResponse> {
    const user = await this.userModel.updateById(userId, updateData);

    return {
      success: true,
      data: user,
    };
  }

  public async updateUsersByIds(
    userIds: DocumentId[],
    updateData: Partial<UserType>,
  ): Promise<LibraryResponse> {
    const users = await this.userModel.updateByIds(userIds, updateData);

    return {
      success: true,
      data: users,
    };
  }

  public async updateUser(
    filterConditions: QueryFilter<UserType>,
    updateData: Partial<UserType>,
  ): Promise<LibraryResponse> {
    const user = await this.userModel.updateOne(filterConditions, updateData);

    return {
      success: true,
      data: user,
    };
  }

  public async updateUsers(
    filterConditions: QueryFilter<UserType>,
    updateData: Partial<UserType>,
  ): Promise<LibraryResponse> {
    const user = await this.userModel.updateMany(filterConditions, updateData);

    return {
      success: true,
      data: user,
    };
  }

  public async deleteUserById(userId: DocumentId): Promise<LibraryResponse> {
    const user = await this.userModel.deleteById(userId);

    return {
      success: true,
      data: user,
    };
  }

  public async deleteUsersByIds(
    userIds: DocumentId[],
  ): Promise<LibraryResponse> {
    const user = await this.userModel.deleteByIds(userIds);

    return {
      success: true,
      data: user,
    };
  }

  public async deleteUser(
    filterConditions: QueryFilter<UserType>,
  ): Promise<LibraryResponse> {
    const user = await this.userModel.deleteOne(filterConditions);

    return {
      success: true,
      data: user,
    };
  }

  public async deleteUsers(
    filterConditions: QueryFilter<UserType>,
  ): Promise<LibraryResponse> {
    const user = await this.userModel.deleteMany(filterConditions);

    return {
      success: true,
      data: user,
    };
  }

  public async deleteUserByUsername(
    username: string,
  ): Promise<LibraryResponse> {
    const user = await this.userModel.deleteOne({
      username: username,
    });

    return {
      success: true,
      data: user,
    };
  }
}

export default new UserLibrary();
