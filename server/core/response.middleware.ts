import { Response } from "express";

import errors, { ErrorCode } from "./errors";

export class ResponseHandler {
  public static send({
    response,
    res,
  }: {
    response:
      | ErrorCode
      | {
          code?: ErrorCode;
          data?: unknown;
        }
      | void;

    res: Response;
  }): void {
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
    res.status(200).json({
      success: true,
      code: response?.code,
      message: response?.code ? errors[response.code] : undefined,
      data: response?.data ?? null,
    });
  }
}
