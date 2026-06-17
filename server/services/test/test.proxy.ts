import { Request, Response } from "express";

import { ResponseHandler } from "../../core/middlewares/response.middleware";
import Instagram from "../../library/instagram";
import { ErrorCode } from "../../utils/errors";

class TestProxy {
  public async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const instagram = await Instagram.init(req.user);

      const controllerResponse = await instagram.getProfile();

      ResponseHandler.send({
        res,
        response: controllerResponse,
      });
    } catch (error) {
      ResponseHandler.send({
        res,
        response: {
          code:
            error instanceof Error
              ? (error.message as ErrorCode)
              : "IG00020009",
          success: false,
        },
      });
    }
  }

  public async createImagePost(req: Request, res: Response): Promise<void> {
    try {
      const instagram = await Instagram.init(req.user);

      const controllerResponse = await instagram.createImagePost(
        req.body.imageUrl,
        req.body.caption,
      );

      ResponseHandler.send({ res, response: controllerResponse });
    } catch (error) {
      ResponseHandler.send({
        res,
        response: {
          code:
            error instanceof Error
              ? (error.message as ErrorCode)
              : "IG00020009",
          success: false,
        },
      });
    }
  }

  public async createReel(req: Request, res: Response): Promise<void> {
    try {
      const instagram = await Instagram.init(req.user);
      if (instagram instanceof Error) {
        ResponseHandler.send({
          res,
          response: {
            code: instagram.message as ErrorCode,
            success: false,
          },
        });
        return;
      }
      const controllerResponse = await instagram.createReel(
        req.body.videoUrl,
        req.body.caption,
      );

      ResponseHandler.send({ res, response: controllerResponse });
    } catch (error) {
      ResponseHandler.send({
        res,
        response: {
          code:
            error instanceof Error
              ? (error.message as ErrorCode)
              : "IG00020009",
          success: false,
        },
      });
    }
  }

  public async createCarousel(req: Request, res: Response): Promise<void> {
    try {
      const instagram = await Instagram.init(req.user);
      if (instagram instanceof Error) {
        ResponseHandler.send({
          res,
          response: {
            code: instagram.message as ErrorCode,
            success: false,
          },
        });
        return;
      }
      const controllerResponse = await instagram.createCarousel(
        req.body.mediaUrls,
        req.body.caption,
      );

      ResponseHandler.send({ res, response: controllerResponse });
    } catch (error) {
      ResponseHandler.send({
        res,
        response: {
          code:
            error instanceof Error
              ? (error.message as ErrorCode)
              : "IG00020009",
          success: false,
        },
      });
    }
  }

  public async createImageStory(req: Request, res: Response): Promise<void> {
    try {
      const instagram = await Instagram.init(req.user);
      if (instagram instanceof Error) {
        ResponseHandler.send({
          res,
          response: {
            code: instagram.message as ErrorCode,
            success: false,
          },
        });
        return;
      }
      const controllerResponse = await instagram.createImageStory(
        req.body.imageUrl,
      );

      ResponseHandler.send({ res, response: controllerResponse });
    } catch (error) {
      ResponseHandler.send({
        res,
        response: {
          code:
            error instanceof Error
              ? (error.message as ErrorCode)
              : "IG00020009",
          success: false,
        },
      });
    }
  }

  public async createVideoStory(req: Request, res: Response): Promise<void> {
    try {
      const instagram = await Instagram.init(req.user);
      if (instagram instanceof Error) {
        ResponseHandler.send({
          res,
          response: {
            code: instagram.message as ErrorCode,
            success: false,
          },
        });
        return;
      }
      const controllerResponse = await instagram.createVideoStory(
        req.body.videoUrl,
      );

      ResponseHandler.send({ res, response: controllerResponse });
    } catch (error) {
      ResponseHandler.send({
        res,
        response: {
          code:
            error instanceof Error
              ? (error.message as ErrorCode)
              : "IG00020009",
          success: false,
        },
      });
    }
  }

  public async getMediaList(req: Request, res: Response): Promise<void> {
    try {
      const instagram = await Instagram.init(req.user);
      if (instagram instanceof Error) {
        ResponseHandler.send({
          res,
          response: {
            code: instagram.message as ErrorCode,
            success: false,
          },
        });
        return;
      }
      const controllerResponse = await instagram.getMediaList(
        req.query.cursor as string,
      );

      ResponseHandler.send({ res, response: controllerResponse });
    } catch (error) {
      ResponseHandler.send({
        res,
        response: {
          code:
            error instanceof Error
              ? (error.message as ErrorCode)
              : "IG00020009",
          success: false,
        },
      });
    }
  }

  public async getMedia(req: Request, res: Response): Promise<void> {
    try {
      const instagram = await Instagram.init(req.user);
      if (instagram instanceof Error) {
        ResponseHandler.send({
          res,
          response: {
            code: instagram.message as ErrorCode,
            success: false,
          },
        });
        return;
      }
      const controllerResponse = await instagram.getMedia(
        req.query.mediaId as string,
      );

      ResponseHandler.send({ res, response: controllerResponse });
    } catch (error) {
      ResponseHandler.send({
        res,
        response: {
          code:
            error instanceof Error
              ? (error.message as ErrorCode)
              : "IG00020009",
          success: false,
        },
      });
    }
  }

  public async syncAllMedia(req: Request, res: Response): Promise<void> {
    try {
      const instagram = await Instagram.init(req.user);
      if (instagram instanceof Error) {
        ResponseHandler.send({
          res,
          response: {
            code: instagram.message as ErrorCode,
            success: false,
          },
        });
        return;
      }
      const controllerResponse = await instagram.syncAllMedia();

      ResponseHandler.send({ res, response: controllerResponse });
    } catch (error) {
      ResponseHandler.send({
        res,
        response: {
          code:
            error instanceof Error
              ? (error.message as ErrorCode)
              : "IG00020009",
          success: false,
        },
      });
    }
  }

  public async publishContent(req: Request, res: Response): Promise<void> {
    try {
      const instagram = await Instagram.init(req.user);
      if (instagram instanceof Error) {
        ResponseHandler.send({
          res,
          response: {
            code: instagram.message as ErrorCode,
            success: false,
          },
        });
        return;
      }
      const controllerResponse = await instagram.publishContent(
        req.body.creationId,
      );
      ResponseHandler.send({ res, response: controllerResponse });
    } catch (error) {
      ResponseHandler.send({
        res,
        response: {
          code:
            error instanceof Error
              ? (error.message as ErrorCode)
              : "IG00020009",
          success: false,
        },
      });
    }
  }
}

export default new TestProxy();
