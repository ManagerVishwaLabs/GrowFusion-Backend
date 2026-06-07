import DBModule from "../../../database/db.module";
import { Doc } from "../../../database/db.types";
import { SocialMediaAccountType } from "../../../database/models/socialAccount.model";
import axios from "../../axios";
import { INSTAGRAM_GRAPH_API_URL, PROFILE_FIELDS } from "./instagram.constants";
import {
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

  public async publishContent(creationId: string) {
    const access_token = await this.getAccessToken();

    if (!this.instagramBusinessAccountId) {
      const account = await this.getAccountDetails();
      this.instagramBusinessAccountId = account.instagramBusinessAccountId;
    }

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
