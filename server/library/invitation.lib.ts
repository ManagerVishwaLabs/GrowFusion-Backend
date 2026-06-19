import { QueryFilter } from "mongoose";

import DBModule, { ModelWrapper } from "../database/db.module";
import { Doc } from "../database/db.types";
import { InvitationType } from "../database/models/invitation.model";
import { DocumentId, LibraryResponse } from "../utils/types";

class InvitationLibrary {
  private invitationModel: ModelWrapper<InvitationType>;

  constructor() {
    this.invitationModel = DBModule.createModel("Invitation");
  }

  public async createInvitation(
    invitationData: InvitationType,
  ): Promise<LibraryResponse<Doc<InvitationType>>> {
    const invitation = await this.invitationModel.insertOne(invitationData);

    if (!invitation.success) {
      return {
        code: "GF0070001",
        error: invitation.error,
        message: invitation.message,
        success: false,
      };
    }

    if (!invitation.data) {
      return {
        code: "GF0070001",
        success: false,
      };
    }

    return {
      data: invitation.data,
      success: true,
    };
  }

  public async getInvitationById(
    invitationId: DocumentId,
  ): Promise<LibraryResponse<Doc<InvitationType>>> {
    const invitation = await this.invitationModel.findById(invitationId);

    if (!invitation.success) {
      return {
        code: "GF0070002",
        error: invitation.error,
        message: invitation.message,
        success: false,
      };
    }

    if (!invitation.data) {
      return {
        code: "GF0070010",
        success: false,
      };
    }

    return {
      data: invitation.data,
      success: true,
    };
  }

  public async getInvitationByCode(
    inviteCode: string,
  ): Promise<LibraryResponse<Doc<InvitationType>>> {
    const invitation = await this.invitationModel.findOne({
      inviteCode,
    });

    if (!invitation.success) {
      return {
        code: "GF0070003",
        error: invitation.error,
        message: invitation.message,
        success: false,
      };
    }

    if (!invitation.data) {
      return {
        code: "GF0070010",
        success: false,
      };
    }

    return {
      data: invitation.data,
      success: true,
    };
  }

  public async getPendingInvitation(
    company: string,
    inviteeEmail: string,
  ): Promise<LibraryResponse<Doc<InvitationType>>> {
    const invitation = await this.invitationModel.findOne({
      company,
      inviteeEmail,
      status: "pending",
    });

    if (!invitation.success) {
      return {
        code: "GF0070003",
        error: invitation.error,
        message: invitation.message,
        success: false,
      };
    }

    if (!invitation.data) {
      return {
        code: "GF0070010",
        success: false,
      };
    }

    return {
      data: invitation.data,
      success: true,
    };
  }

  public async getCompanyInvitations(
    company: string,
  ): Promise<LibraryResponse> {
    const invitations = await this.invitationModel.find({
      company,
    });

    if (!invitations.success) {
      return {
        code: "GF0070004",
        error: invitations.error,
        message: invitations.message,
        success: false,
      };
    }

    if (!invitations.data) {
      return {
        code: "GF0070010",
        success: false,
      };
    }

    return {
      data: invitations.data,
      success: true,
    };
  }

  public async revokeInvitation(inviteCode: string): Promise<LibraryResponse> {
    const invitation = await this.invitationModel.updateOne(
      {
        inviteCode,
      },
      {
        status: "revoked",
        revokedAt: new Date(),
      },
    );

    if (!invitation.success) {
      return {
        code: "GF0070005",
        error: invitation.error,
        message: invitation.message,
        success: false,
      };
    }

    if (!invitation.data) {
      return {
        code: "GF0070011",
        success: false,
      };
    }

    return {
      data: invitation.data,
      success: true,
    };
  }

  public async acceptInvitation(inviteCode: string): Promise<LibraryResponse> {
    const invitation = await this.invitationModel.updateOne(
      {
        inviteCode,
        status: "pending",
      },
      {
        status: "accepted",
        acceptedAt: new Date(),
      },
    );

    if (!invitation.success) {
      return {
        code: "GF0070006",
        error: invitation.error,
        message: invitation.message,
        success: false,
      };
    }

    if (!invitation.data) {
      return {
        code: "GF0070011",
        success: false,
      };
    }

    return {
      data: invitation.data,
      success: true,
    };
  }

  public async rejectInvitation(inviteCode: string): Promise<LibraryResponse> {
    const invitation = await this.invitationModel.updateOne(
      {
        inviteCode,
        status: "pending",
      },
      {
        status: "rejected",
        rejectedAt: new Date(),
      },
    );

    if (!invitation.success) {
      return {
        code: "GF0070007",
        error: invitation.error,
        message: invitation.message,
        success: false,
      };
    }

    if (!invitation.data) {
      return {
        code: "GF0070011",
        success: false,
      };
    }

    return {
      data: invitation.data,
      success: true,
    };
  }

  public async expireInvitations(): Promise<LibraryResponse> {
    const invitation = await this.invitationModel.updateMany(
      {
        expiryDate: {
          $lt: new Date(),
        },
        status: "pending",
      },
      {
        status: "expired",
      },
    );

    if (!invitation.success) {
      return {
        code: "GF0070008",
        error: invitation.error,
        message: invitation.message,
        success: false,
      };
    }

    if (!invitation.data) {
      return {
        code: "GF0070011",
        success: false,
      };
    }

    return {
      data: invitation.data,
      success: true,
    };
  }

  public async updateInvitation(
    filterConditions: QueryFilter<InvitationType>,
    updateData: Partial<InvitationType>,
  ): Promise<LibraryResponse> {
    const invitation = await this.invitationModel.updateOne(
      filterConditions,
      updateData,
    );

    if (!invitation.success) {
      return {
        code: "GF0070009",
        error: invitation.error,
        message: invitation.message,
        success: false,
      };
    }

    return {
      data: invitation.data,
      success: true,
    };
  }
}

export default new InvitationLibrary();
