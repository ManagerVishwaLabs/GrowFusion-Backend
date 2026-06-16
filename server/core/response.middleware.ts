import { Response } from "express";

import errors, { ErrorCode } from "../utils/errors";

type ResponseHandlerType = {
  response:
    | ErrorCode
    | {
        code?: ErrorCode;
        data?: unknown;
        error?: string | unknown;
        message?: string;
        redirectUrl?: string;
        success?: boolean;
      }
    | void;

  res: Response;
};

class ResponseHandler {
  public static send({ res, response }: ResponseHandlerType): void {
    if (!response) {
      res.status(500).json({
        success: false,
      });

      return;
    }

    if (typeof response === "string") {
      res.status(400).json({
        error: {
          code: response,
          message: errors[response],
        },
        success: false,
      });

      return;
    }
    if ("redirectUrl" in response && response.redirectUrl) {
      res.redirect(response.redirectUrl);
      return;
    }

    res.status(200).json({
      code: response?.code,
      data: response?.data ?? undefined,
      error: response?.error ?? undefined,
      message: response?.message
        ? response?.message
        : response?.code
          ? errors[response.code]
          : undefined,
      success: response?.success ?? true,
    });
  }
}

export { ResponseHandler };
