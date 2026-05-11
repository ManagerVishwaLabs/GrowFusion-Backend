import { ControllerResponse } from "../../core/types";

import { LoginRequestBody } from "./types";

class AuthController {
  public async login({
    body,
  }: {
    body?: LoginRequestBody;
  }): Promise<ControllerResponse<{ username: string }>> {
    const { username, password } = body!;

    if (username !== "admin" || password !== "admin") {
      return "GF0010007";
    }

    return {
      data: {
        username,
      },
    };
  }
}

export default new AuthController();
