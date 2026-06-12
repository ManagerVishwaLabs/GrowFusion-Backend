import User, { UserType } from "../models/user.model";
import Company, { CompanyType } from "./company.model";
import InstagramContent, {
  InstagramContentType,
} from "./instagramContent.model";
import SocialMediaAccount, {
  SocialMediaAccountType,
} from "./socialAccount.model";

const models = {
  Company,
  InstagramContent,
  SocialMediaAccount,
  User,
};

interface ModelRegistry {
  User: UserType;
  Company: CompanyType;
  SocialMediaAccount: SocialMediaAccountType;
  InstagramContent: InstagramContentType;
}

export { ModelRegistry, models };
