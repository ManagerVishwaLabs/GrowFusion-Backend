import instagramLib from "./instagram.lib";
import {
  CarouselItem,
  InstagramResponse,
  MediaIDResponse,
  ProfileFields,
  UserProfile,
} from "./instagram.types";
import validator from "./instagram.validator";

class Instagram {
  public async getProfile(
    selectedFields?: ProfileFields,
  ): Promise<InstagramResponse<UserProfile>> {
    const validation = validator.getProfile(selectedFields);

    if (!validation.success) {
      return validation;
    }

    return instagramLib.getProfile(selectedFields);
  }

  public async createImagePost(
    imageUrl: string,
    caption?: string,
  ): Promise<InstagramResponse<MediaIDResponse>> {
    const validation = validator.createImagePost(imageUrl);

    if (!validation.success) {
      return validation;
    }

    return instagramLib.createImagePost(imageUrl, caption);
  }

  public async createReel(
    videoUrl: string,
    caption?: string,
  ): Promise<InstagramResponse<MediaIDResponse>> {
    const validation = validator.createReel(videoUrl);

    if (!validation.success) {
      return validation;
    }

    return instagramLib.createReel(videoUrl, caption);
  }

  public async createCarousel(
    mediaUrls: CarouselItem[],
    caption?: string,
  ): Promise<InstagramResponse<MediaIDResponse>> {
    const validation = validator.createCarousel(mediaUrls);

    if (!validation.success) {
      return validation;
    }

    return instagramLib.createCarousel(mediaUrls, caption);
  }

  public async createImageStory(
    imageUrl: string,
  ): Promise<InstagramResponse<MediaIDResponse>> {
    const validation = validator.createImageStory(imageUrl);

    if (!validation.success) {
      return validation;
    }

    return instagramLib.createImageStory(imageUrl);
  }

  public async createVideoStory(
    videoUrl: string,
  ): Promise<InstagramResponse<MediaIDResponse>> {
    const validation = validator.createVideoStory(videoUrl);

    if (!validation.success) {
      return validation;
    }

    return instagramLib.createVideoStory(videoUrl);
  }

  public async getMediaList(cursor?: string) {
    return instagramLib.getMediaList(cursor);
  }

  public async getMedia(mediaId: string) {
    const validation = validator.getMedia(mediaId);

    if (!validation.success) {
      return validation;
    }

    return instagramLib.getMedia(mediaId);
  }

  public async syncAllMedia() {
    let syncedMediaCount = 0;
    try {
      let after: string | undefined;
      do {
        const mediaList = await this.getMediaList(after);

        if (!mediaList.success || mediaList?.data?.data?.length === 0) {
          break;
        }
        const mediaListData = mediaList?.data;

        for (const media of mediaListData.data) {
          await instagramLib.getMedia(media.id);
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
      console.error(error);

      return {
        message:
          "An error occurred while syncing media" +
          "\nSynced media count before error: " +
          String(syncedMediaCount),
        success: false,
      };
    }

    return {
      message: "Synced media count: " + String(syncedMediaCount),
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

    return instagramLib.publishContent(creationId);
  }
}

export default new Instagram();
