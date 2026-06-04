import axios from "../../axios";
import { INSTAGRAM_GRAPH_API_URL, PROFILE_FIELDS } from "./instagram.constants";
import {
  InstagramProfile,
  InstagramResponse,
  ProfileFields,
} from "./instagram.types";

class InstagramLib {
  private access_token: string;

  constructor() {
    this.access_token = "access_token";
  }

  public async getProfile(
    selectedFields?: ProfileFields,
  ): Promise<InstagramResponse<InstagramProfile>> {
    const response = await axios.get<InstagramProfile>(
      INSTAGRAM_GRAPH_API_URL + "/me",
      {
        params: {
          fields: selectedFields
            ? selectedFields.join(",")
            : PROFILE_FIELDS.join(","),
          access_token: this.access_token,
        },
      },
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        message: response.message || "Failed to get profile",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  }

  // public async getMe<T>(accessToken: string, fields: string[]): Promise<InstagramResponse<T>> {
  //   const response = await axios.get<T>(
  //     "https://graph.instagram.com/me",
  //     {
  //       params: {
  //         fields: fields.join(","),
  //         access_token: accessToken,
  //       },
  //     },
  //   );
  //   return response.data;
  // }
  // public async validateToken(accessToken: string): Promise<boolean> {
  //   try {
  //     await this.getProfile(accessToken);
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // }
  // public async publishImage() {
  //   throw new Error(
  //     "Not implemented. Requires Instagram Graph API publishing endpoints.",
  //   );
  // }
  // public async publishReel() {
  //   throw new Error(
  //     "Not implemented. Requires Instagram Graph API publishing endpoints.",
  //   );
  // }
}

export default new InstagramLib();
