import { isEmailAddress } from "../../utils/helperFunctions";
import { ValidatorResponse } from "../../utils/types";
import { CreateInvitationType } from "./invitation.types";

class InvitationValidator {
  public validateCreate({
    body,
  }: {
    body: Partial<CreateInvitationType>;
  }): ValidatorResponse {
    const { inviteeName, inviteeEmail } = body;

    if (!inviteeName?.trim()) {
      return "GF0080001";
    }

    if (!inviteeEmail) {
      return "GF0080002";
    }

    if (typeof inviteeEmail !== "string" || !isEmailAddress(inviteeEmail)) {
      return "GF0080003";
    }
  }

  public validateCode({
    inviteCode,
  }: {
    inviteCode: string;
  }): ValidatorResponse {
    if (!inviteCode) {
      return "GF0080006";
    }

    if (typeof inviteCode !== "string" || inviteCode.trim().length < 6) {
      return "GF0080007";
    }
  }
}

export default new InvitationValidator();
