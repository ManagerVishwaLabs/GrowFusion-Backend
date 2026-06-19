type CreateInvitationType = {
  inviter: string;
  inviteeName: string;
  inviteeEmail: string;
  expiryDate?: Date;
};

type InvitationCodeType = {
  inviteCode: string;
};

export { CreateInvitationType, InvitationCodeType };
