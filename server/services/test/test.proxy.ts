import { Request, Response } from "express";

import instagramLib from "../../core/lib/instagram/";
import { ResponseHandler } from "../../core/response.middleware";

class TestProxy {
  public async getProfile(req: Request, res: Response): Promise<void> {
    const controllerResponse = await instagramLib.getProfile();

    ResponseHandler.send({ res, response: controllerResponse });
  }

  public async createImagePost(req: Request, res: Response): Promise<void> {
    const controllerResponse = await instagramLib.createImagePost(
      req.body.imageUrl,
      req.body.caption,
    );

    ResponseHandler.send({ res, response: controllerResponse });
  }

  public async createReel(req: Request, res: Response): Promise<void> {
    const controllerResponse = await instagramLib.createReel(
      req.body.videoUrl,
      req.body.caption,
    );

    ResponseHandler.send({ res, response: controllerResponse });
  }

  public async createCarousel(req: Request, res: Response): Promise<void> {
    const controllerResponse = await instagramLib.createCarousel(
      req.body.mediaUrls,
      req.body.caption,
    );

    ResponseHandler.send({ res, response: controllerResponse });
  }

  public async createImageStory(req: Request, res: Response): Promise<void> {
    const controllerResponse = await instagramLib.createImageStory(
      req.body.imageUrl,
    );

    ResponseHandler.send({ res, response: controllerResponse });
  }

  public async createVideoStory(req: Request, res: Response): Promise<void> {
    const controllerResponse = await instagramLib.createVideoStory(
      req.body.videoUrl,
    );

    ResponseHandler.send({ res, response: controllerResponse });
  }

  public async getMediaList(req: Request, res: Response): Promise<void> {
    const controllerResponse = await instagramLib.getMediaList(
      req.query.cursor as string,
    );

    ResponseHandler.send({ res, response: controllerResponse });
  }

  public async getMedia(req: Request, res: Response): Promise<void> {
    const controllerResponse = await instagramLib.getMedia(
      req.query.mediaId as string,
    );

    ResponseHandler.send({ res, response: controllerResponse });
  }

  public async syncAllMedia(req: Request, res: Response): Promise<void> {
    const controllerResponse = await instagramLib.syncAllMedia();

    ResponseHandler.send({ res, response: controllerResponse });
  }

  public async publishContent(req: Request, res: Response): Promise<void> {
    const controllerResponse = await instagramLib.publishContent(
      req.body.creationId,
    );
    ResponseHandler.send({ res, response: controllerResponse });
  }
}

export default new TestProxy();
