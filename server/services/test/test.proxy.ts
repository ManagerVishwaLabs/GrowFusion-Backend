import { Request, Response } from "express";

import instagramLib from "../../core/lib/instagram/instagram.lib";

class TestProxy {
  public async getProfile(req: Request, res: Response): Promise<void> {
    const controllerResponse = await instagramLib.getProfile();

    res.send(controllerResponse);
  }
}

export default new TestProxy();
