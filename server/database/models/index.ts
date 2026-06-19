import User, { UserType } from "../models/user.model";
import Company, { CompanyType } from "./company.model";
import InstagramContent, {
  InstagramContentType,
} from "./instagramContent.model";
import Invitation, { InvitationType } from "./invitation.model";
import SocialMediaAccount, {
  SocialMediaAccountType,
} from "./socialAccount.model";
import UserSession, { UserSessionType } from "./userSession.mode";

const models = {
  Company,
  InstagramContent,
  SocialMediaAccount,
  User,
  UserSession,
  Invitation,
};

interface ModelRegistry {
  User: UserType;
  Company: CompanyType;
  SocialMediaAccount: SocialMediaAccountType;
  InstagramContent: InstagramContentType;
  UserSession: UserSessionType;
  Invitation: InvitationType;
}

export { ModelRegistry, models };
