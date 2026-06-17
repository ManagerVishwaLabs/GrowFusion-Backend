import { Request, Response } from "express";

import { ResponseHandler } from "../../core/middlewares/response.middleware";
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
      data: req.body,
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
      data: req.body,
      req,
      res,
    });

    ResponseHandler.send({
      res,
      response: controllerResponse,
    });
  }

  public async refresh(req: Request, res: Response): Promise<void> {
    const validationResponse = AuthValidator.validateRefresh({
      cookies: { refreshToken: req.cookies.refreshToken },
    });

    if (validationResponse) {
      ResponseHandler.send({
        res,
        response: validationResponse,
      });

      return;
    }

    const controllerResponse = await AuthController.refresh({
      data: undefined,
      req,
      res,
    });

    ResponseHandler.send({
      res,
      response: controllerResponse,
    });
  }

  public async logout(req: Request, res: Response): Promise<void> {
    const controllerResponse = await AuthController.logout({
      data: undefined,
      req,
      res,
    });

    ResponseHandler.send({
      res,
      response: controllerResponse,
    });
  }
}

export default new AuthProxy();
