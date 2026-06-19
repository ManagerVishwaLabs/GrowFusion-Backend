import { Request, Response } from "express";

import { ResponseHandler } from "../../core/middlewares/response.middleware";
import InvitationController from "./invitation.controller";
import InvitationValidator from "./invitation.validator";

class InvitationProxy {
  public async create(req: Request, res: Response): Promise<void> {
    const validationResponse = InvitationValidator.validateCreate({
      body: req.body,
    });

    if (validationResponse) {
      ResponseHandler.send({
        res,
        response: validationResponse,
      });

      return;
    }

    const controllerResponse = await InvitationController.create({
      data: req.body,
      req,
    });

    ResponseHandler.send({
      res,
      response: controllerResponse,
    });
  }

  public async getByCode(req: Request, res: Response): Promise<void> {
    const invitationCode = req.params.code;

    if (typeof invitationCode !== "string") {
      ResponseHandler.send({
        res,
        response: "GF0080007",
      });

      return;
    }

    const validationResponse = InvitationValidator.validateCode({
      inviteCode: invitationCode,
    });

    if (validationResponse) {
      ResponseHandler.send({
        res,
        response: validationResponse,
      });

      return;
    }

    const controllerResponse = await InvitationController.getByCode({
      data: {
        inviteCode: invitationCode,
      },
    });

    ResponseHandler.send({
      res,
      response: controllerResponse,
    });
  }

  public async accept(req: Request, res: Response): Promise<void> {
    const invitationCode = req.params.code;

    if (typeof invitationCode !== "string") {
      ResponseHandler.send({
        res,
        response: "GF0080007",
      });

      return;
    }

    const validationResponse = InvitationValidator.validateCode({
      inviteCode: invitationCode,
    });

    if (validationResponse) {
      ResponseHandler.send({
        res,
        response: validationResponse,
      });

      return;
    }

    const controllerResponse = await InvitationController.accept({
      data: {
        inviteCode: invitationCode,
      },
    });

    ResponseHandler.send({
      res,
      response: controllerResponse,
    });
  }

  public async reject(req: Request, res: Response): Promise<void> {
    const invitationCode = req.params.code;

    if (typeof invitationCode !== "string") {
      ResponseHandler.send({
        res,
        response: "GF0080007",
      });

      return;
    }

    const validationResponse = InvitationValidator.validateCode({
      inviteCode: invitationCode,
    });

    if (validationResponse) {
      ResponseHandler.send({
        res,
        response: validationResponse,
      });

      return;
    }

    const controllerResponse = await InvitationController.reject({
      data: {
        inviteCode: invitationCode,
      },
    });

    ResponseHandler.send({
      res,
      response: controllerResponse,
    });
  }

  public async revoke(req: Request, res: Response): Promise<void> {
    const invitationCode = req.params.code;

    if (typeof invitationCode !== "string") {
      ResponseHandler.send({
        res,
        response: "GF0080007",
      });

      return;
    }

    const validationResponse = InvitationValidator.validateCode({
      inviteCode: invitationCode,
    });

    if (validationResponse) {
      ResponseHandler.send({
        res,
        response: validationResponse,
      });

      return;
    }

    const controllerResponse = await InvitationController.revoke({
      data: {
        inviteCode: invitationCode,
      },
    });

    ResponseHandler.send({
      res,
      response: controllerResponse,
    });
  }
}

export default new InvitationProxy();
