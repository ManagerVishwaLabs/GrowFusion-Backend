import { Router } from "express";

import { AuthMiddleware } from "../../core/middlewares/auth.middleware";
import InvitationProxy from "./invitation.proxy";

const invitationRouter = Router();

invitationRouter.post("/create", AuthMiddleware, InvitationProxy.create);
invitationRouter.get("/:code", AuthMiddleware, InvitationProxy.getByCode);
invitationRouter.post("/:code/accept", InvitationProxy.accept);
invitationRouter.post("/:code/reject", InvitationProxy.reject);
invitationRouter.post("/:code/revoke", AuthMiddleware, InvitationProxy.revoke);

export default invitationRouter;
