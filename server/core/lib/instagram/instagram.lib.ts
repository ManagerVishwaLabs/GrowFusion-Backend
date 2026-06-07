import DBModule from "../../../database/db.module";
import { Doc } from "../../../database/db.types";
import { SocialMediaAccountType } from "../../../database/models/socialAccount.model";
import axios from "../../axios";
import { INSTAGRAM_GRAPH_API_URL, PROFILE_FIELDS } from "./instagram.constants";
import {
  CarouselItem,
  InstagramProfile,
  InstagramResponse,
  ProfileFields,
} from "./instagram.types";

class InstagramLib {
  private socialAccountModel;
  private instagramContentModel;
  private instagramGraphClient: axios;
  private accessToken: string | null = null;
  private instagramBusinessAccountId: string | undefined = undefined;

  constructor() {
    this.socialAccountModel = DBModule.createModel("SocialMediaAccount");
    this.instagramContentModel = DBModule.createModel("InstagramContent");
    this.instagramGraphClient = axios.create(INSTAGRAM_GRAPH_API_URL);
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    const account = await this.socialAccountModel.findOne(
      { mediaName: "instagram" }, //change to username
      { accessToken: 1 },
    );

    if (!account.success || !account.data) {
      throw new Error("Instagram access token not found");
    }

    this.accessToken = account.data.accessToken;
    return this.accessToken;
  }

  private async getAccountDetails(): Promise<Doc<SocialMediaAccountType>> {
    const account = await this.socialAccountModel.findOne(
      { mediaName: "instagram" }, //change to username
    );

    if (!account.success || !account.data) {
      throw new Error("Instagram account not found");
    }

    this.instagramBusinessAccountId = account.data.instagramBusinessAccountId;
    return account.data;
  }

  public async getProfile(
    selectedFields?: ProfileFields,
  ): Promise<InstagramResponse<InstagramProfile>> {
    const access_token = await this.getAccessToken();
    const response = await this.instagramGraphClient.get<InstagramProfile>(
      "/me",
      {
        params: {
          fields: selectedFields
            ? selectedFields.join(",")
            : PROFILE_FIELDS.join(","),
          access_token: access_token,
        },
      },
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        message: response.message || "Failed to get profile",
      };
    }

    try {
      await this.socialAccountModel.updateOne(
        {
          $or: [
            { appUserId: response.data.id },
            { instagramBusinessAccountId: response.data.user_id },
            { accessToken: access_token },
          ],
        },
        {
          appUserId: response.data.id,
          instagramBusinessAccountId: response.data.user_id,
          mediaUsername: response.data.username,
          displayName: response.data.name,
          profilePictureUrl: response.data.profile_picture_url,
          followersCount: response.data.followers_count,
          followsCount: response.data.follows_count,
          mediaCount: response.data.media_count,
        },
        { upsert: true },
      );
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to save social account",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  }

  public async createImagePost(imageUrl: string, caption?: string) {
    const access_token = await this.getAccessToken();

    const account = await this.getAccountDetails();

    if (!this.instagramBusinessAccountId) {
      this.instagramBusinessAccountId = account.instagramBusinessAccountId;
    }

    const response = await this.instagramGraphClient.post<{ id: string }>(
      `/${this.instagramBusinessAccountId}/media`,
      null,
      {
        params: {
          image_url: imageUrl,
          caption,
          access_token: access_token,
        },
      },
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        message: response.message || "Failed to get profile",
      };
    }
    const socialAccountId = account._id;

    try {
      await this.instagramContentModel.insertOne({
        socialAccountId,
        instagramBusinessAccountId: this.instagramBusinessAccountId!,
        instagramCreationId: response.data.id,
        mediaType: "IMAGE",
        mediaUrls: [imageUrl],
        caption,
      });
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to save social account",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  }

  public async createReel(videoUrl: string, caption?: string) {
    const access_token = await this.getAccessToken();

    const account = await this.getAccountDetails();
    if (!this.instagramBusinessAccountId) {
      this.instagramBusinessAccountId = account.instagramBusinessAccountId;
    }
    const response = await this.instagramGraphClient.post<{ id: string }>(
      `/${this.instagramBusinessAccountId}/media`,
      null,
      {
        params: {
          media_type: "REELS",
          video_url: videoUrl,
          caption,
          access_token,
        },
      },
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        message: response.message || "Failed to publish media",
      };
    }

    try {
      await this.instagramContentModel.insertOne({
        socialAccountId: account._id,
        instagramBusinessAccountId: this.instagramBusinessAccountId!,
        instagramCreationId: response.data.id,
        mediaType: "REELS",
        mediaUrls: [videoUrl],
        caption,
      });
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to save social account",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  }

  public async createCarousel(mediaUrls: CarouselItem[], caption?: string) {
    const access_token = await this.getAccessToken();

    const account = await this.getAccountDetails();

    if (!this.instagramBusinessAccountId) {
      this.instagramBusinessAccountId = account.instagramBusinessAccountId;
    }

    const children: string[] = [];

    for (const media of mediaUrls) {
      const params =
        media.type === "IMAGE"
          ? {
              image_url: media.url,
              is_carousel_item: true,
              access_token,
            }
          : {
              video_url: media.url,
              media_type: "VIDEO",
              is_carousel_item: true,
              access_token,
            };

      const child = await this.instagramGraphClient.post<{ id: string }>(
        `/${this.instagramBusinessAccountId}/media`,
        null,
        {
          params,
        },
      );

      if (!child.success || !child.data) {
        return {
          success: false,
          message:
            child.message || `Failed to create carousel item: ${media.url}`,
        };
      }

      children.push(child.data.id);

      const waitResult = await this.waitForContainerReady(child.data.id);

      if (!waitResult.success) {
        return waitResult;
      }
    }

    const carousel = await this.instagramGraphClient.post<{ id: string }>(
      `/${this.instagramBusinessAccountId}/media`,
      null,
      {
        params: {
          media_type: "CAROUSEL",
          children: children.join(","),
          caption,
          access_token,
        },
      },
    );

    if (!carousel.success || !carousel.data) {
      return {
        success: false,
        message: carousel.message || "Failed to create carousel container",
      };
    }

    try {
      await this.instagramContentModel.insertOne({
        socialAccountId: account._id,
        instagramBusinessAccountId: this.instagramBusinessAccountId!,
        instagramCreationId: carousel.data.id,
        childCreationIds: children,
        mediaType: "CAROUSEL",
        mediaUrls: mediaUrls.map((item) => item.url),
        caption,
      });
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to save carousel",
      };
    }

    return {
      success: true,
      data: carousel.data,
    };
  }

  public async createImageStory(imageUrl: string) {
    const access_token = await this.getAccessToken();

    const account = await this.getAccountDetails();

    if (!this.instagramBusinessAccountId) {
      this.instagramBusinessAccountId = account.instagramBusinessAccountId;
    }

    const response = await this.instagramGraphClient.post<{ id: string }>(
      `/${this.instagramBusinessAccountId}/media`,
      null,
      {
        params: {
          media_type: "STORIES",
          image_url: imageUrl,
          access_token,
        },
      },
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        message: response.message || "Failed to publish media",
      };
    }

    try {
      await this.instagramContentModel.insertOne({
        socialAccountId: account._id,
        instagramBusinessAccountId: this.instagramBusinessAccountId!,
        instagramCreationId: response.data.id,
        mediaType: "STORY",
        mediaUrls: [imageUrl],
      });
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to save social account",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  }

  public async createVideoStory(videoUrl: string) {
    const access_token = await this.getAccessToken();

    const account = await this.getAccountDetails();

    if (!this.instagramBusinessAccountId) {
      this.instagramBusinessAccountId = account.instagramBusinessAccountId;
    }

    const response = await this.instagramGraphClient.post<{ id: string }>(
      `/${this.instagramBusinessAccountId}/media`,
      null,
      {
        params: {
          media_type: "STORIES",
          video_url: videoUrl,
          access_token,
        },
      },
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        message: response.message || "Failed to publish media",
      };
    }

    try {
      await this.instagramContentModel.insertOne({
        socialAccountId: account._id,
        instagramBusinessAccountId: this.instagramBusinessAccountId!,
        instagramCreationId: response.data?.id,
        mediaType: "STORY",
        mediaUrls: [videoUrl],
      });
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to save social account",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  }

  public async getContainerStatus(creationId: string) {
    const access_token = await this.getAccessToken();

    const response = await this.instagramGraphClient.get<{
      status_code: "IN_PROGRESS" | "FINISHED" | "ERROR" | "EXPIRED";
    }>(`/${creationId}`, {
      params: {
        fields: "status_code",
        access_token,
      },
    });

    if (!response.success || !response.data) {
      return {
        success: false,
        message: response.message || "Failed to get container status",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  }

  private async waitForContainerReady(
    creationId: string,
    maxAttempts = 30,
  ): Promise<InstagramResponse<void>> {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.getContainerStatus(creationId);

      if (!status.success || !status.data) {
        return {
          success: false,
          message: status.message || "Failed to get container status",
        };
      }

      const statusCode = status.data.status_code;

      if (statusCode === "FINISHED") {
        return {
          success: true,
          data: undefined,
        };
      }

      if (statusCode === "ERROR" || statusCode === "EXPIRED") {
        return {
          success: false,
          message: `Container status: ${statusCode}`,
        };
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return {
      success: false,
      message: "Container processing timeout",
    };
  }

  public async publishContent(creationId: string) {
    const access_token = await this.getAccessToken();

    if (!this.instagramBusinessAccountId) {
      const account = await this.getAccountDetails();
      this.instagramBusinessAccountId = account.instagramBusinessAccountId;
    }

    await this.waitForContainerReady(creationId);

    const response = await this.instagramGraphClient.post<{ id: string }>(
      `/${this.instagramBusinessAccountId}/media_publish`,
      null,
      {
        params: {
          creation_id: creationId,
          access_token,
        },
      },
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        message: response.message || "Failed to publish media",
      };
    }
    try {
      await this.instagramContentModel.updateOne(
        {
          instagramCreationId: creationId,
        },
        {
          instagramMediaId: response.data.id,
          status: "published",
          publishedAt: new Date(),
        },
      );
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to save social account",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  }
}

export default new InstagramLib();
