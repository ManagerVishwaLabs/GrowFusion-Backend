import User, { UserType } from "../models/user.model";

import Company, { CompanyType } from "./company.model";

const models = {
  User,
  Company,
};

interface ModelRegistry {
  User: UserType;
  Company: CompanyType;
}

export { models, ModelRegistry };
