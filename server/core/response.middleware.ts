import { Response } from "express";

import errors, { ErrorCode } from "../utils/errors";

export class ResponseHandler {
  public static send({
    response,
    res,
  }: {
    response:
      | ErrorCode
      | {
          success: boolean;
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
      success: response?.success ?? true,
      code: response?.code,
      message: response?.code ? errors[response.code] : undefined,
      data: response?.data ?? null,
    });
  }
}
