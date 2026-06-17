import { Request, Response } from "express";

import { ResponseHandler } from "../../core/middlewares/response.middleware";
import OAuthController from "./oauth.controller";
import OAuthValidator from "./oauth.validator";

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
        res,
        response: validationResponse,
      });

      return;
    }

    const controllerResponse = await OAuthController.instagramOauthRedirect({
      data: req.query as unknown as {
        scopes?: string[];
        state?: string;
      },
    });

    ResponseHandler.send({
      res,
      response: controllerResponse,
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
        res,
        response: validationResponse,
      });

      return;
    }

    const controllerResponse = await OAuthController.instagramOauthCallback({
      data: req.query as unknown as {
        code: string;
        state?: string;
        error?: string;
        error_description?: string;
      },
    });

    ResponseHandler.send({
      res,
      response: controllerResponse,
    });
  }
}

export default new OAuthProxy();
