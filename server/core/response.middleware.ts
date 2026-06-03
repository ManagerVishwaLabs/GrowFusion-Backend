import { Response } from "express";

import errors, { ErrorCode } from "../utils/errors";

type ResponseHandlerType = {
  response:
    | ErrorCode
    | {
        code?: ErrorCode;
        data?: unknown;
        redirectUrl?: string;
      }
    | void;

  res: Response;
};

class ResponseHandler {
  public static send({ response, res }: ResponseHandlerType): void {
    if (!response) {
      res.status(500).json({
        success: false,
      });

      return;
    }

    if (typeof response === "string") {
      res.status(400).json({
        success: false,
        error: {
          code: response,
          message: errors[response],
        },
      });

      return;
    }
    if ("redirectUrl" in response && response.redirectUrl) {
      res.redirect(response.redirectUrl);
      return;
    }

    res.status(200).json({
      success: true,
      code: response?.code,
      message: response?.code ? errors[response.code] : undefined,
      data: response?.data ?? null,
    });
  }
}

export { ResponseHandler };
