import User, { UserType, CreateUserType } from "../models/user.model";

import Company, { CompanyType, CreateCompanyType } from "./company.model";

export const models = {
  User,
  Company,
};

export interface ModelRegistry {
  User: {
    schema: UserType;
    create: CreateUserType;
  };

  Company: {
    schema: CompanyType;
    create: CreateCompanyType;
  };
}
