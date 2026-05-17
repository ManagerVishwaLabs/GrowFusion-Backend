import User, { UserType, CreateUserType } from "../models/user.model";

import Company, { CompanyType, CreateCompanyType } from "./company.model";

const models = {
  User,
  Company,
};

interface ModelRegistry {
  User: {
    schema: UserType;
    create: CreateUserType;
  };

  Company: {
    schema: CompanyType;
    create: CreateCompanyType;
  };
}

export { models, ModelRegistry };
