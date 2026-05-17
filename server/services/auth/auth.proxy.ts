import { Request, Response } from "express";

import AuthValidator from "./auth.validator";
import AuthController from "./auth.controller";

import { ResponseHandler } from "../../core/response.middleware";

class AuthProxy {
  public async register(req: Request, res: Response): Promise<void> {
    const validationResponse = AuthValidator.validateRegister({
      body: req.body,
    });

    if (validationResponse) {
      ResponseHandler.send({
        response: validationResponse,
        res,
      });

      return;
    }

    const controllerResponse = await AuthController.register({
      body: req.body,
    });

    ResponseHandler.send({
      response: controllerResponse,
      res,
    });
  }
}

export default new AuthProxy();
