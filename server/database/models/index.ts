import User, { UserType } from "../models/user.model";
import Company, { CompanyType } from "./company.model";
import SocialMediaAccount, {
  SocialMediaAccountType,
} from "./socialAccount.model";

const models = {
  User,
  Company,
  SocialMediaAccount,
};

interface ModelRegistry {
  User: UserType;
  Company: CompanyType;
  SocialMediaAccount: SocialMediaAccountType;
}

export { models, ModelRegistry };
