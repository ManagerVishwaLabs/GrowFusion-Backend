import DBModule from "../../../database/db.module";
import { Doc } from "../../../database/db.types";
import { SocialMediaAccountType } from "../../../database/models/socialAccount.model";
import axios from "../../axios";
import {
  INSTAGRAM_GRAPH_API_URL,
  MEDIA_FIELDS,
  PROFILE_FIELDS,
} from "./instagram.constants";
import {
  CarouselItem,
  ContainerStatusResponse,
  InstagramResponse,
  MediaDetailsResponse,
  MediaIDResponse,
  MediaListResponse,
  ProfileFields,
  UserProfile,
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
      { username: "testUser" },
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
      { username: "testUser" }, //change to username
    );

    if (!account.success || !account.data) {
      throw new Error("Instagram account not found");
    }

    this.instagramBusinessAccountId = account.data.instagramBusinessAccountId;
    return account.data;
  }

  public async getProfile(
    selectedFields?: ProfileFields,
  ): Promise<InstagramResponse<UserProfile>> {
    const access_token = await this.getAccessToken();
    const response = await this.instagramGraphClient.get<UserProfile>("/me", {
      params: {
        access_token: access_token,
        fields: selectedFields
          ? selectedFields.join(",")
          : PROFILE_FIELDS.join(","),
      },
    });

    if (!response.success || !response.data) {
      return {
        message: response.message || "Failed to get profile",
        success: false,
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
          displayName: response.data.name,
          followersCount: response.data.followers_count,
          followsCount: response.data.follows_count,
          instagramBusinessAccountId: response.data.user_id,
          mediaCount: response.data.media_count,
          mediaUsername: response.data.username,
          profilePictureUrl: response.data.profile_picture_url,
        },
        { upsert: true },
      );
    } catch (error) {
      return {
        message:
          error instanceof Error
            ? error.message
            : "Failed to save social account",
        success: false,
      };
    }

    return {
      data: response.data,
      success: true,
    };
  }

  public async createImagePost(
    imageUrl: string,
    caption?: string,
  ): Promise<InstagramResponse<MediaIDResponse>> {
    const access_token = await this.getAccessToken();

    const account = await this.getAccountDetails();

    if (!this.instagramBusinessAccountId) {
      this.instagramBusinessAccountId = account.instagramBusinessAccountId;
    }

    const response = await this.instagramGraphClient.post<MediaIDResponse>(
      `/${this.instagramBusinessAccountId}/media`,
      null,
      {
        params: {
          access_token: access_token,
          caption,
          image_url: imageUrl,
        },
      },
    );

    if (!response.success || !response.data) {
      return {
        message: response.message || "Failed to get profile",
        success: false,
      };
    }
    const socialAccountId = account._id;

    try {
      await this.instagramContentModel.insertOne({
        caption,
        company: "testCompany",
        instagramBusinessAccountId: this.instagramBusinessAccountId!,
        instagramCreationId: response.data.id,
        mediaType: "IMAGE",
        mediaUrl: imageUrl,
        socialAccountId,
        username: "testUser",
      });
    } catch (error) {
      return {
        message:
          error instanceof Error
            ? error.message
            : "Failed to save social account",
        success: false,
      };
    }

    return {
      data: response.data,
      success: true,
    };
  }

  public async createReel(
    videoUrl: string,
    caption?: string,
  ): Promise<InstagramResponse<MediaIDResponse>> {
    const access_token = await this.getAccessToken();

    const account = await this.getAccountDetails();
    if (!this.instagramBusinessAccountId) {
      this.instagramBusinessAccountId = account.instagramBusinessAccountId;
    }
    const response = await this.instagramGraphClient.post<MediaIDResponse>(
      `/${this.instagramBusinessAccountId}/media`,
      null,
      {
        params: {
          access_token,
          caption,
          media_type: "REELS",
          video_url: videoUrl,
        },
      },
    );

    if (!response.success || !response.data) {
      return {
        message: response.message || "Failed to publish media",
        success: false,
      };
    }

    try {
      await this.instagramContentModel.insertOne({
        caption,
        company: "testCompany",
        instagramBusinessAccountId: this.instagramBusinessAccountId!,
        instagramCreationId: response.data.id,
        mediaType: "REELS",
        mediaUrl: videoUrl,
        socialAccountId: account._id,
        username: "testUser",
      });
    } catch (error) {
      return {
        message:
          error instanceof Error
            ? error.message
            : "Failed to save social account",
        success: false,
      };
    }

    return {
      data: response.data,
      success: true,
    };
  }

  public async createCarousel(
    mediaUrls: CarouselItem[],
    caption?: string,
  ): Promise<InstagramResponse<MediaIDResponse>> {
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
              access_token,
              image_url: media.url,
              is_carousel_item: true,
            }
          : {
              access_token,
              is_carousel_item: true,
              media_type: "VIDEO",
              video_url: media.url,
            };

      const child = await this.instagramGraphClient.post<MediaIDResponse>(
        `/${this.instagramBusinessAccountId}/media`,
        null,
        {
          params,
        },
      );

      if (!child.success || !child.data) {
        return {
          message:
            child.message || `Failed to create carousel item: ${media.url}`,
          success: false,
        };
      }

      children.push(child.data.id);

      const waitResult = await this.waitForContainerReady(child.data.id);

      if (!waitResult.success) {
        return waitResult;
      }
    }

    const carousel = await this.instagramGraphClient.post<MediaIDResponse>(
      `/${this.instagramBusinessAccountId}/media`,
      null,
      {
        params: {
          access_token,
          caption,
          children: children.join(","),
          media_type: "CAROUSEL_ALBUM",
        },
      },
    );

    if (!carousel.success || !carousel.data) {
      return {
        message: carousel.message || "Failed to create carousel container",
        success: false,
      };
    }

    try {
      await this.instagramContentModel.insertOne({
        caption,
        childCreationIds: children,
        childMediaUrls: mediaUrls.slice(1).map((item) => item.url),
        company: "testCompany",
        instagramBusinessAccountId: this.instagramBusinessAccountId!,
        instagramCreationId: carousel.data.id,
        mediaType: "CAROUSEL_ALBUM",
        socialAccountId: account._id,
        username: "testUser",
      });
    } catch (error) {
      return {
        message:
          error instanceof Error ? error.message : "Failed to save carousel",
        success: false,
      };
    }

    return {
      data: carousel.data,
      success: true,
    };
  }

  public async createImageStory(
    imageUrl: string,
  ): Promise<InstagramResponse<MediaIDResponse>> {
    const access_token = await this.getAccessToken();

    const account = await this.getAccountDetails();

    if (!this.instagramBusinessAccountId) {
      this.instagramBusinessAccountId = account.instagramBusinessAccountId;
    }

    const response = await this.instagramGraphClient.post<MediaIDResponse>(
      `/${this.instagramBusinessAccountId}/media`,
      null,
      {
        params: {
          access_token,
          image_url: imageUrl,
          media_type: "STORIES",
        },
      },
    );

    if (!response.success || !response.data) {
      return {
        message: response.message || "Failed to publish media",
        success: false,
      };
    }

    try {
      await this.instagramContentModel.insertOne({
        company: "testCompany",
        instagramBusinessAccountId: this.instagramBusinessAccountId!,
        instagramCreationId: response.data.id,
        mediaType: "STORY",
        mediaUrl: imageUrl,
        socialAccountId: account._id,
        username: "testUser",
      });
    } catch (error) {
      return {
        message:
          error instanceof Error
            ? error.message
            : "Failed to save social account",
        success: false,
      };
    }

    return {
      data: response.data,
      success: true,
    };
  }

  public async createVideoStory(
    videoUrl: string,
  ): Promise<InstagramResponse<MediaIDResponse>> {
    const access_token = await this.getAccessToken();

    const account = await this.getAccountDetails();

    if (!this.instagramBusinessAccountId) {
      this.instagramBusinessAccountId = account.instagramBusinessAccountId;
    }

    const response = await this.instagramGraphClient.post<MediaIDResponse>(
      `/${this.instagramBusinessAccountId}/media`,
      null,
      {
        params: {
          access_token,
          media_type: "STORIES",
          video_url: videoUrl,
        },
      },
    );

    if (!response.success || !response.data) {
      return {
        message: response.message || "Failed to publish media",
        success: false,
      };
    }

    try {
      await this.instagramContentModel.insertOne({
        company: "testCompany",
        instagramBusinessAccountId: this.instagramBusinessAccountId!,
        instagramCreationId: response.data?.id,
        mediaType: "STORY",
        mediaUrl: videoUrl,
        socialAccountId: account._id,
        username: "testUser",
      });
    } catch (error) {
      return {
        message:
          error instanceof Error
            ? error.message
            : "Failed to save social account",
        success: false,
      };
    }

    return {
      data: response.data,
      success: true,
    };
  }

  public async getContainerStatus(
    creationId: string,
  ): Promise<InstagramResponse<ContainerStatusResponse>> {
    const access_token = await this.getAccessToken();

    const response =
      await this.instagramGraphClient.get<ContainerStatusResponse>(
        `/${creationId}`,
        {
          params: {
            access_token,
            fields: "status_code",
          },
        },
      );

    if (!response.success || !response.data) {
      return {
        message: response.message || "Failed to get container status",
        success: false,
      };
    }

    return {
      data: response.data,
      success: true,
    };
  }

  public async getMediaList(
    cursor?: string,
  ): Promise<InstagramResponse<MediaListResponse>> {
    const access_token = await this.getAccessToken();

    if (!this.instagramBusinessAccountId) {
      const account = await this.getAccountDetails();
      this.instagramBusinessAccountId = account.instagramBusinessAccountId;
    }

    const response = await this.instagramGraphClient.get<MediaListResponse>(
      `/${this.instagramBusinessAccountId}/media`,
      {
        params: {
          access_token,
          cursor,
        },
      },
    );

    if (!response.success || !response.data) {
      return {
        message: response.message || "Failed to get media list",
        success: false,
      };
    }

    return {
      data: response.data,
      success: true,
    };
  }

  public async getMedia(
    mediaId: string,
  ): Promise<InstagramResponse<MediaDetailsResponse>> {
    const access_token = await this.getAccessToken();

    const response = await this.instagramGraphClient.get<MediaDetailsResponse>(
      `/${mediaId}`,
      {
        params: {
          access_token,
          fields: MEDIA_FIELDS.join(","),
        },
      },
    );

    if (!response.success || !response.data) {
      return {
        message: response.message || "Failed to get media",
        success: false,
      };
    }

    try {
      await this.instagramContentModel.updateOne(
        {
          instagramMediaId: mediaId,
        },
        {
          caption: response.data?.caption ?? undefined,
          commentsCount: response.data.comments_count,
          instagramChildMediaUrls: response.data?.children?.data.map(
            (item) => item.media_url,
          ),
          instagramMediaId: mediaId,
          instagramMediaUrl: response.data.media_url,
          isCommentEnabled: response.data.is_comment_enabled,
          likeCount: response.data.like_count,
          mediaProductType: response.data?.media_product_type,
          mediaType: response.data.media_type ?? undefined,
          permalink: response.data.permalink,
          publishedAt: response.data.timestamp
            ? new Date(response.data.timestamp)
            : undefined,
          shortcode: response.data?.shortcode,
          status: "published",
          thumbnailUrl: response.data?.thumbnail_url,
        },
        { upsert: true },
        {
          source: "SYNCED",
        },
      );
    } catch (error) {
      return {
        message:
          error instanceof Error
            ? error.message
            : "Failed to save social account",
        success: false,
      };
    }

    return {
      data: response.data,
      success: true,
    };
  }

  public async publishContent(
    creationId: string,
  ): Promise<InstagramResponse<MediaIDResponse>> {
    const access_token = await this.getAccessToken();

    if (!this.instagramBusinessAccountId) {
      const account = await this.getAccountDetails();
      this.instagramBusinessAccountId = account.instagramBusinessAccountId;
    }

    await this.waitForContainerReady(creationId);

    const response = await this.instagramGraphClient.post<MediaIDResponse>(
      `/${this.instagramBusinessAccountId}/media_publish`,
      null,
      {
        params: {
          access_token,
          creation_id: creationId,
        },
      },
    );

    if (!response.success || !response.data) {
      return {
        message: response.message || "Failed to publish media",
        success: false,
      };
    }
    try {
      await this.instagramContentModel.updateOne(
        {
          instagramCreationId: creationId,
        },
        {
          instagramMediaId: response.data.id,
          publishedAt: new Date(),
          status: "published",
        },
      );
    } catch (error) {
      return {
        message:
          error instanceof Error
            ? error.message
            : "Failed to save social account",
        success: false,
      };
    }

    return {
      data: response.data,
      success: true,
    };
  }

  private async waitForContainerReady(
    creationId: string,
    maxAttempts = 30,
  ): Promise<InstagramResponse<void>> {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.getContainerStatus(creationId);

      if (!status.success) {
        return {
          message: status.message || "Failed to get container status",
          success: false,
        };
      }

      const statusCode = status.data.status_code;

      if (statusCode === "FINISHED") {
        return {
          data: undefined,
          success: true,
        };
      }

      if (statusCode === "ERROR" || statusCode === "EXPIRED") {
        return {
          message: `Container status: ${statusCode}`,
          success: false,
        };
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return {
      message: "Container processing timeout",
      success: false,
    };
  }
}

export default new InstagramLib();
