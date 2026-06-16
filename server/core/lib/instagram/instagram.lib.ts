import DBModule from "../../../database/db.module";
import { Doc } from "../../../database/db.types";
import { SocialMediaAccountType } from "../../../database/models/socialAccount.model";
import { UserType } from "../../../database/models/user.model";
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
  private user: UserType | undefined;

  constructor(user: UserType | undefined) {
    this.user = user;
    this.socialAccountModel = DBModule.createModel("SocialMediaAccount");
    this.instagramContentModel = DBModule.createModel("InstagramContent");
    this.instagramGraphClient = axios.create(INSTAGRAM_GRAPH_API_URL);
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    const account = await this.socialAccountModel.findOne(
      {
        company: this.user?.company || "",
        username: this.user?.username || "",
      },
      { accessToken: 1 },
    );

    if (!account.success || !account.data) {
      throw new Error("Instagram access token not found");
    }

    this.accessToken = account.data.accessToken;
    return this.accessToken;
  }

  private async getAccountDetails(): Promise<Doc<SocialMediaAccountType>> {
    const account = await this.socialAccountModel.findOne({
      username: this.user?.username || "",
      company: this.user?.company || "",
    });

    if (!account.success || !account.data) {
      throw new Error("Instagram account not found");
    }

    this.instagramBusinessAccountId = account.data.instagramBusinessAccountId;
    return account.data;
  }

  public async getProfile(
    selectedFields?: ProfileFields,
  ): Promise<InstagramResponse<UserProfile>> {
    let access_token: string | undefined;

    try {
      access_token = await this.getAccessToken();
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to get access token",
        code: "IG00040015",
        success: false,
      };
    }

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
        error: response.message || "Failed to get profile",
        code: "IG00040001",
        success: false,
      };
    }

    try {
      await this.socialAccountModel.updateOne(
        {
          accessToken: access_token,
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
        error:
          error instanceof Error
            ? error.message
            : "Failed to save social account",
        code: "IG00040002",
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
    let access_token: string | undefined;
    let account: Doc<SocialMediaAccountType> | undefined;

    try {
      access_token = await this.getAccessToken();
      account = await this.getAccountDetails();
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to get access token",
        code: "IG00040015",
        success: false,
      };
    }

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
        code: "IG00040003",
        error: response.message || "Failed to get profile",
        success: false,
      };
    }

    const socialAccountId = account._id;

    try {
      await this.instagramContentModel.insertOne({
        caption,
        company: this.user?.company || "",
        instagramBusinessAccountId: this.instagramBusinessAccountId!,
        instagramCreationId: response.data.id,
        mediaType: "IMAGE",
        mediaUrl: imageUrl,
        socialAccountId,
        username: this.user?.username || "",
      });
    } catch (error) {
      return {
        code: "IG00040014",
        error:
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
    let access_token: string | undefined;
    let account: Doc<SocialMediaAccountType> | undefined;

    try {
      access_token = await this.getAccessToken();
      account = await this.getAccountDetails();
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to get access token",
        code: "IG00040015",
        success: false,
      };
    }

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
        code: "IG00040004",
        error: response.message || "Failed to publish media",
        success: false,
      };
    }

    try {
      await this.instagramContentModel.insertOne({
        caption,
        company: this.user?.company || "",
        instagramBusinessAccountId: this.instagramBusinessAccountId!,
        instagramCreationId: response.data.id,
        mediaType: "REELS",
        mediaUrl: videoUrl,
        socialAccountId: account._id,
        username: this.user?.username || "",
      });
    } catch (error) {
      return {
        code: "IG00040014",
        error:
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
    let access_token: string | undefined;
    let account: Doc<SocialMediaAccountType> | undefined;

    try {
      access_token = await this.getAccessToken();
      account = await this.getAccountDetails();
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to get access token",
        code: "IG00040015",
        success: false,
      };
    }

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
          code: "IG00040005",
          error:
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
        code: "IG00040005",
        error: carousel.message || "Failed to create carousel container",
        success: false,
      };
    }

    try {
      await this.instagramContentModel.insertOne({
        caption,
        childCreationIds: children,
        childMediaUrls: mediaUrls.slice(1).map((item) => item.url),
        company: this.user?.company || "",
        instagramBusinessAccountId: this.instagramBusinessAccountId!,
        instagramCreationId: carousel.data.id,
        mediaType: "CAROUSEL_ALBUM",
        socialAccountId: account._id,
        username: this.user?.username || "",
      });
    } catch (error) {
      return {
        code: "IG00040014",
        error:
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
    let access_token: string | undefined;
    let account: Doc<SocialMediaAccountType> | undefined;

    try {
      access_token = await this.getAccessToken();
      account = await this.getAccountDetails();
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to get access token",
        code: "IG00040015",
        success: false,
      };
    }

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
        code: "IG00040006",
        error: response.message || "Failed to publish media",
        success: false,
      };
    }

    try {
      await this.instagramContentModel.insertOne({
        company: this.user?.company || "",
        instagramBusinessAccountId: this.instagramBusinessAccountId!,
        instagramCreationId: response.data.id,
        mediaType: "STORY",
        mediaUrl: imageUrl,
        socialAccountId: account._id,
        username: this.user?.username || "",
      });
    } catch (error) {
      return {
        code: "IG00040014",
        error:
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
    let access_token: string | undefined;
    let account: Doc<SocialMediaAccountType> | undefined;

    try {
      access_token = await this.getAccessToken();
      account = await this.getAccountDetails();
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to get access token",
        code: "IG00040015",
        success: false,
      };
    }

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
        code: "IG00040007",
        error: response.message || "Failed to publish media",
        success: false,
      };
    }

    try {
      await this.instagramContentModel.insertOne({
        company: this.user?.company || "",
        instagramBusinessAccountId: this.instagramBusinessAccountId!,
        instagramCreationId: response.data?.id,
        mediaType: "STORY",
        mediaUrl: videoUrl,
        socialAccountId: account._id,
        username: this.user?.username || "",
      });
    } catch (error) {
      return {
        code: "IG00040014",
        error:
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
    let access_token: string | undefined;

    try {
      access_token = await this.getAccessToken();
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to get access token",
        code: "IG00040015",
        success: false,
      };
    }

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
        code: "IG00040011",
        error: response.message || "Failed to get container status",
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
    let access_token: string | undefined;
    let account: Doc<SocialMediaAccountType> | undefined;

    try {
      access_token = await this.getAccessToken();
      account = await this.getAccountDetails();
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to get access token",
        code: "IG00040015",
        success: false,
      };
    }

    if (!this.instagramBusinessAccountId) {
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
        code: "IG00040008",
        error: response.message || "Failed to get media list",
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
    let access_token: string | undefined;

    try {
      access_token = await this.getAccessToken();
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to get access token",
        code: "IG00040015",
        success: false,
      };
    }

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
        code: "IG00040009",
        error: response.message || "Failed to get media",
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
        code: "IG00040012",
        error:
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
    let access_token: string | undefined;

    try {
      access_token = await this.getAccessToken();
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to get access token",
        code: "IG00040015",
        success: false,
      };
    }

    if (!this.instagramBusinessAccountId) {
      const account = await this.getAccountDetails();
      this.instagramBusinessAccountId = account.instagramBusinessAccountId;
    }

    const waitResult = await this.waitForContainerReady(creationId);

    if (!waitResult.success) {
      return waitResult;
    }

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
        code: "IG00040010",
        error: response.message || "Failed to publish media",
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
        code: "IG00040014",
        error:
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
          code: "IG00040011",
          error: status.error || "Failed to get container status",
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
          code: "IG00040011",
          error: `Container status: ${statusCode}`,
          success: false,
        };
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return {
      code: "IG00040011",
      error: "Container processing timeout",
      success: false,
    };
  }
}

export default InstagramLib;
