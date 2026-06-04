import { Request, Response } from "express";

import OAuthValidator from "./oauth.validator";
import OAuthController from "./oauth.controller";

import { ResponseHandler } from "../../core/response.middleware";

class OAuthProxy {
  public async instagramOauthRedirect(
    req: Request,
    res: Response,
  ): Promise<void> {
    const validationResponse = OAuthValidator.validateInstagramOauthRedirect({
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

    const controllerResponse = await OAuthController.instagramOauthRedirect({
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
    const validationResponse = OAuthValidator.validateInstagramOauthCallback({
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

    const controllerResponse = await OAuthController.instagramOauthCallback({
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

export default new OAuthProxy();
