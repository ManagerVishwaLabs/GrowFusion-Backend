import { Request, Response } from "express";

import { ResponseHandler } from "../../core/response.middleware";
import AuthController from "./auth.controller";
import AuthValidator from "./auth.validator";

class AuthProxy {
  public async register(req: Request, res: Response): Promise<void> {
    const validationResponse = AuthValidator.validateRegister({
      body: req.body,
    });

    if (validationResponse) {
      ResponseHandler.send({
        res,
        response: validationResponse,
      });

      return;
    }

    const controllerResponse = await AuthController.register({
      body: req.body,
    });

    ResponseHandler.send({
      res,
      response: controllerResponse,
    });
  }
  public async login(req: Request, res: Response): Promise<void> {
    const validationResponse = AuthValidator.validateLogin({
      body: req.body,
    });

    if (validationResponse) {
      ResponseHandler.send({
        res,
        response: validationResponse,
      });

      return;
    }

    const controllerResponse = await AuthController.login({
      body: req.body,
    });

    ResponseHandler.send({
      res,
      response: controllerResponse,
    });
  }
}

export default new AuthProxy();
