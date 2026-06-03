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
  public async login(req: Request, res: Response): Promise<void> {
    const validationResponse = AuthValidator.validateLogin({
      body: req.body,
    });

    if (validationResponse) {
      ResponseHandler.send({
        response: validationResponse,
        res,
      });

      return;
    }

    const controllerResponse = await AuthController.login({
      body: req.body,
    });

    ResponseHandler.send({
      response: controllerResponse,
      res,
    });
  }

  public async instagramOauthRedirect(
    req: Request,
    res: Response,
  ): Promise<void> {
    const validationResponse = AuthValidator.validateInstagramOauthRedirect({
      params: req.query as unknown as {
        scopes?: string[];
        state?: string;
      },
    });

    if (validationResponse) {
      ResponseHandler.send({
        response: validationResponse,
        res,
      });

      return;
    }

    const controllerResponse = await AuthController.instagramOauthRedirect({
      params: req.query as unknown as {
        scopes?: string[];
        state?: string;
      },
    });

    ResponseHandler.send({
      response: controllerResponse,
      res,
    });
  }

  public async instagramOauthCallback(
    req: Request,
    res: Response,
  ): Promise<void> {
    const validationResponse = AuthValidator.validateInstagramOauthCallback({
      query: req.query as unknown as {
        code?: string;
        state?: string;
        error?: string;
        error_description?: string;
      },
    });

    if (validationResponse) {
      ResponseHandler.send({
        response: validationResponse,
        res,
      });

      return;
    }

    const controllerResponse = await AuthController.instagramOauthCallback({
      query: req.query as unknown as {
        code?: string;
        state?: string;
        error?: string;
        error_description?: string;
      },
    });

    ResponseHandler.send({
      response: controllerResponse,
      res,
    });
  }
}

export default new AuthProxy();
