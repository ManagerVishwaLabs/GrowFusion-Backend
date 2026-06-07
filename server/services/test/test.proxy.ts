import { Request, Response } from "express";

import instagramLib from "../../core/lib/instagram/";

class TestProxy {
  public async getProfile(req: Request, res: Response): Promise<void> {
    const controllerResponse = await instagramLib.getProfile();

    res.send(controllerResponse);
  }

  public async createImagePost(req: Request, res: Response): Promise<void> {
    const controllerResponse = await instagramLib.createImagePost(
      req.body.imageUrl,
      req.body.caption,
    );

    res.send(controllerResponse);
  }

  public async createReel(req: Request, res: Response): Promise<void> {
    const controllerResponse = await instagramLib.createReel(
      req.body.videoUrl,
      req.body.caption,
    );

    res.send(controllerResponse);
  }

  public async createCarousel(req: Request, res: Response): Promise<void> {
    const controllerResponse = await instagramLib.createCarousel(
      req.body.mediaUrls,
      req.body.caption,
    );

    res.send(controllerResponse);
  }

  public async publishContent(req: Request, res: Response): Promise<void> {
    const controllerResponse = await instagramLib.publishContent(
      req.body.creationId,
    );

    res.send(controllerResponse);
  }
}

export default new TestProxy();
