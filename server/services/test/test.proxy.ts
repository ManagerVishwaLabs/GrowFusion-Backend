import { Request, Response } from "express";

import Instagram from "../../library/instagram";
import { ResponseHandler } from "../../core/middlewares/response.middleware";

class TestProxy {
  private getInstagram(req: Request) {
    return new Instagram(req.user);
  }
  public async getProfile(req: Request, res: Response): Promise<void> {
    const instagram = this.getInstagram(req);

    const controllerResponse = await instagram.getProfile();
    ResponseHandler.send({ res, response: controllerResponse });
  }

  public async createImagePost(req: Request, res: Response): Promise<void> {
    const instagram = this.getInstagram(req);
    const controllerResponse = await instagram.createImagePost(
      req.body.imageUrl,
      req.body.caption,
    );

    ResponseHandler.send({ res, response: controllerResponse });
  }

  public async createReel(req: Request, res: Response): Promise<void> {
    const instagram = this.getInstagram(req);
    const controllerResponse = await instagram.createReel(
      req.body.videoUrl,
      req.body.caption,
    );

    ResponseHandler.send({ res, response: controllerResponse });
  }

  public async createCarousel(req: Request, res: Response): Promise<void> {
    const instagram = this.getInstagram(req);
    const controllerResponse = await instagram.createCarousel(
      req.body.mediaUrls,
      req.body.caption,
    );

    ResponseHandler.send({ res, response: controllerResponse });
  }

  public async createImageStory(req: Request, res: Response): Promise<void> {
    const instagram = this.getInstagram(req);
    const controllerResponse = await instagram.createImageStory(
      req.body.imageUrl,
    );

    ResponseHandler.send({ res, response: controllerResponse });
  }

  public async createVideoStory(req: Request, res: Response): Promise<void> {
    const instagram = this.getInstagram(req);
    const controllerResponse = await instagram.createVideoStory(
      req.body.videoUrl,
    );

    ResponseHandler.send({ res, response: controllerResponse });
  }

  public async getMediaList(req: Request, res: Response): Promise<void> {
    const instagram = this.getInstagram(req);
    const controllerResponse = await instagram.getMediaList(
      req.query.cursor as string,
    );

    ResponseHandler.send({ res, response: controllerResponse });
  }

  public async getMedia(req: Request, res: Response): Promise<void> {
    const instagram = this.getInstagram(req);
    const controllerResponse = await instagram.getMedia(
      req.query.mediaId as string,
    );

    ResponseHandler.send({ res, response: controllerResponse });
  }

  public async syncAllMedia(req: Request, res: Response): Promise<void> {
    const instagram = this.getInstagram(req);
    const controllerResponse = await instagram.syncAllMedia();

    ResponseHandler.send({ res, response: controllerResponse });
  }

  public async publishContent(req: Request, res: Response): Promise<void> {
    const instagram = this.getInstagram(req);
    const controllerResponse = await instagram.publishContent(
      req.body.creationId,
    );
    ResponseHandler.send({ res, response: controllerResponse });
  }
}

export default new TestProxy();
