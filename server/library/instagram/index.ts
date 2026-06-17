import { UserType } from "../../database/models/user.model";
import InstagramLib from "./instagram.lib";
import {
  CarouselItem,
  InstagramResponse,
  MediaIDResponse,
  MediaListResponse,
  ProfileFields,
  UserProfile,
} from "./instagram.types";
import validator from "./instagram.validator";

class Instagram {
  private instagramLib: InstagramLib;
  constructor(user: UserType | undefined) {
    this.instagramLib = new InstagramLib(user);
  }
  public async getProfile(
    selectedFields?: ProfileFields,
  ): Promise<InstagramResponse<UserProfile>> {
    const validation = validator.getProfile(selectedFields);

    if (!validation.success) {
      return validation;
    }

    return this.instagramLib.getProfile(selectedFields);
  }

  public async createImagePost(
    imageUrl: string,
    caption?: string,
  ): Promise<InstagramResponse<MediaIDResponse>> {
    const validation = validator.createImagePost(imageUrl);

    if (!validation.success) {
      return validation;
    }

    return this.instagramLib.createImagePost(imageUrl, caption);
  }

  public async createReel(
    videoUrl: string,
    caption?: string,
  ): Promise<InstagramResponse<MediaIDResponse>> {
    const validation = validator.createReel(videoUrl);

    if (!validation.success) {
      return validation;
    }

    return this.instagramLib.createReel(videoUrl, caption);
  }

  public async createCarousel(
    mediaUrls: CarouselItem[],
    caption?: string,
  ): Promise<InstagramResponse<MediaIDResponse>> {
    const validation = validator.createCarousel(mediaUrls);

    if (!validation.success) {
      return validation;
    }

    return this.instagramLib.createCarousel(mediaUrls, caption);
  }

  public async createImageStory(
    imageUrl: string,
  ): Promise<InstagramResponse<MediaIDResponse>> {
    const validation = validator.createImageStory(imageUrl);

    if (!validation.success) {
      return validation;
    }

    return this.instagramLib.createImageStory(imageUrl);
  }

  public async createVideoStory(
    videoUrl: string,
  ): Promise<InstagramResponse<MediaIDResponse>> {
    const validation = validator.createVideoStory(videoUrl);

    if (!validation.success) {
      return validation;
    }

    return this.instagramLib.createVideoStory(videoUrl);
  }

  public async getMediaList(
    cursor?: string,
  ): Promise<InstagramResponse<MediaListResponse>> {
    const mediaList = await this.instagramLib.getMediaList(cursor);

    if (!mediaList.success) {
      return {
        code: "IG00040008",
        error: mediaList.error,
        success: false,
      };
    }

    return {
      data: mediaList.data,
      success: true,
    };
  }

  public async getMedia(
    mediaId: string,
  ): Promise<InstagramResponse<MediaIDResponse>> {
    const validation = validator.getMedia(mediaId);

    if (!validation.success) {
      return validation;
    }

    return this.instagramLib.getMedia(mediaId);
  }

  public async syncAllMedia(): Promise<
    InstagramResponse<{ syncedMediaCount: number }>
  > {
    let syncedMediaCount = 0;
    try {
      let after: string | undefined;
      do {
        const mediaList = await this.getMediaList(after);

        if (!mediaList.success) {
          return {
            code: "IG00020007",
            error: mediaList.error,
            statusCode: 400,
            success: false,
          };
        }

        if (!mediaList.data?.data?.length) {
          break;
        }

        const mediaListData = mediaList?.data;

        for (const media of mediaListData.data) {
          await this.instagramLib.getMedia(media.id);
          syncedMediaCount++;
        }

        if (!after || after === mediaListData.paging?.cursors?.after) {
          break;
        }
        if (mediaListData.paging?.cursors?.after) {
          after = mediaListData.paging?.cursors?.after;
        }
      } while (after);
    } catch (error) {
      console.log(error);

      return {
        code: "IG00040015",
        statusCode: 500,
        error:
          "An error occurred while syncing media" +
          "\nSynced media count before error: " +
          String(syncedMediaCount),
        success: false,
      };
    }

    return {
      data: {
        syncedMediaCount,
      },
      success: true,
    };
  }

  public async publishContent(
    creationId: string,
  ): Promise<InstagramResponse<MediaIDResponse>> {
    const validation = validator.publishContent(creationId);

    if (!validation.success) {
      return validation;
    }

    return this.instagramLib.publishContent(creationId);
  }
}

export default Instagram;
