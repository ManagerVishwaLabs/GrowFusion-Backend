import { QueryFilter } from "mongoose";
import { ControllerResponse,DocumentId } from "../../core/types";

import DBModule from "../../database/db.module";

import { CreateUserType } from "../../database/models/user.model";

class UserController {
  private userModel;

  constructor() {
    this.userModel = DBModule.createModel("User");
  }

  public async createUser(
    userData: CreateUserType,
  ): Promise<ControllerResponse> {
    const user = await this.userModel.insertOne(userData);

    return {
      data: user,
    };
  }

  public async getUserById(userId: DocumentId): Promise<ControllerResponse> {
    const user = await this.userModel.findById(userId);

    return {
      data: user,
    };
  }
  public async getUsersByIds(userIds: DocumentId[]): Promise<ControllerResponse> {
    const users = await this.userModel.findByIds(userIds);

    return {
      data: users,
    };
  }

  public async getUserByUsername(
    username: string,
  ): Promise<ControllerResponse> {
    const user = await this.userModel.findOne({
      username,
    });

    return {
      data: user,
    };
  }

  public async getUsersByCompany(company: string): Promise<ControllerResponse> {
    const users = await this.userModel.find({
      company,
    });

    return {
      data: users,
    };
  }

  public async updateUserById(
    userId: DocumentId,
    updateData: Partial<CreateUserType>,
  ): Promise<ControllerResponse> {
    const user = await this.userModel.updateById(userId, updateData);

    return {
      data: user,
    };
  }

  public async updateUsersByIds(
    userIds: DocumentId[],
    updateData: Partial<CreateUserType>,
  ): Promise<ControllerResponse> {
    const users = await this.userModel.updateByIds(userIds, updateData);

    return {
      data: users,
    };
  }

  public async updateUser(
    filterConditions: QueryFilter<CreateUserType>,
    updateData: Partial<CreateUserType>,
  ): Promise<ControllerResponse> {
    const user = await this.userModel.updateOne(filterConditions, updateData);

    return {
      data: user,
    };
  }

  public async updateUsers(
    filterConditions: QueryFilter<CreateUserType>,
    updateData: Partial<CreateUserType>,
  ): Promise<ControllerResponse> {
    const user = await this.userModel.updateMany(filterConditions, updateData);

    return {
      data: user,
    };
  }

  public async deleteUserById(userId: DocumentId): Promise<ControllerResponse> {
    const user = await this.userModel.deleteById(userId);

    return {
      data: user,
    };
  }

  public async deleteUsersByIds(userIds: DocumentId[]): Promise<ControllerResponse> {
    const user = await this.userModel.deleteByIds(userIds);

    return {
      data: user,
    };
  }

  public async deleteUser(filterConditions: QueryFilter<CreateUserType>): Promise<ControllerResponse> {
    const user = await this.userModel.deleteOne(filterConditions);

    return {
      data: user,
    };
  }

    public async deleteUsers(filterConditions: QueryFilter<CreateUserType>): Promise<ControllerResponse> {
    const user = await this.userModel.deleteMany(filterConditions);

    return {
      data: user,
    };
  }

  public async deleteUserByUsername(
    username: string,
  ): Promise<ControllerResponse> {
    const user = await this.userModel.deleteOne({
      username: username,
    });

    return {
      data: user,
    };
  }
}

export default new UserController();
