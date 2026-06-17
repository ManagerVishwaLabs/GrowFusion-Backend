import { Response } from "express";

import errors, { ErrorCode } from "../../utils/errors";

type ResponseHandlerType = {
  response:
    | ErrorCode
    | {
        code?: ErrorCode;
        data?: unknown;
        error?: unknown;
        message?: string;
        redirectUrl?: string;
        success?: boolean;
        statusCode?: number;
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
        code: response,
        message: errors[response],
        success: false,
      });

      return;
    }

    if (response.redirectUrl) {
      res.redirect(response.redirectUrl);
      return;
    }

    const statusCode =
      response.statusCode ?? (response.success === false ? 400 : 200);

    res.status(statusCode).json({
      code: response.code,
      data: response.data,
      error: response.error,
      message:
        response.message ?? (response.code ? errors[response.code] : undefined),
      success: response.success ?? true,
    });
  }
}

export { ResponseHandler };
