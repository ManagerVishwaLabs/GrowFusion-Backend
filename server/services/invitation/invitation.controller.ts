import InvitationLibrary from "../../library/invitation.lib";
import { generateRandomString } from "../../utils/helperFunctions";
import { ControllerResponse, ControllerType } from "../../utils/types";
import { CreateInvitationType, InvitationCodeType } from "./invitation.types";

class InvitationController {
  public async create({
    data,
    req,
  }: ControllerType<CreateInvitationType>): Promise<ControllerResponse> {
    if (!req?.user) {
      return {
        code: "GF0080006",
        message: "User not found",
        success: false,
      };
    }

    try {
      const existing = await InvitationLibrary.getPendingInvitation(
        req.user.company,
        data.inviteeEmail,
      );

      if (!existing.success && existing.code !== "GF0070010") {
        return existing;
      }

      if (existing.success && existing.data) {
        return {
          code: "GF0080004",
          success: false,
        };
      }

      const inviteCode = await generateRandomString();

      const invitation = await InvitationLibrary.createInvitation({
        company: req.user.company,
        inviter: req.user.username,
        inviteeName: data.inviteeName,
        inviteeEmail: data.inviteeEmail,
        inviteCode,
        status: "pending",
        expiryDate:
          data.expiryDate ?? new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });

      if (!invitation.success) {
        return invitation;
      }

      return {
        data: invitation.data,
        success: true,
      };
    } catch (error) {
      return {
        code: "GF0080500",
        error:
          error instanceof Error
            ? error.message
            : "Failed to create invitation",
        success: false,
      };
    }
  }

  public async getByCode({
    data,
  }: {
    data: InvitationCodeType;
  }): Promise<ControllerResponse> {
    const invitation = await InvitationLibrary.getInvitationByCode(
      data.inviteCode,
    );

    if (!invitation.success) {
      return invitation;
    }

    if (!invitation.data) {
      return {
        code: "GF0080005",
        message: "Invitation not found",
        success: false,
      };
    }

    return {
      data: invitation.data,
      success: true,
    };
  }

  public async accept({
    data,
  }: {
    data: InvitationCodeType;
  }): Promise<ControllerResponse> {
    const invitation = await InvitationLibrary.acceptInvitation(
      data.inviteCode,
    );

    if (!invitation.success) {
      return invitation;
    }

    return {
      data: null,
      success: true,
    };
  }

  public async reject({
    data,
  }: {
    data: InvitationCodeType;
  }): Promise<ControllerResponse> {
    const invitation = await InvitationLibrary.rejectInvitation(
      data.inviteCode,
    );

    if (!invitation.success) {
      return invitation;
    }

    return {
      data: null,
      success: true,
    };
  }

  public async revoke({
    data,
  }: {
    data: InvitationCodeType;
  }): Promise<ControllerResponse> {
    const invitation = await InvitationLibrary.revokeInvitation(
      data.inviteCode,
    );

    if (!invitation.success) {
      return invitation;
    }

    return {
      data: invitation.data,
      success: true,
    };
  }
}

export default new InvitationController();
