import validator from "./instagram.validator";
import instagramLib from "./instagram.lib";

import {
  InstagramProfile,
  InstagramResponse,
  ProfileFields,
} from "./instagram.types";

class Instagram {
  public async getProfile(
    selectedFields?: ProfileFields,
  ): Promise<InstagramResponse<InstagramProfile>> {
    const validation = validator.getProfile(selectedFields);

    if (!validation.success) {
      return validation;
    }

    return instagramLib.getProfile(selectedFields);
  }

  public async createImagePost(imageUrl: string, caption?: string) {
    const validation = validator.createImagePost(imageUrl);

    if (!validation.success) {
      return validation;
    }

    return instagramLib.createImagePost(imageUrl, caption);
  }

  public async createReel(videoUrl: string, caption?: string) {
    const validation = validator.createReel(videoUrl);

    if (!validation.success) {
      return validation;
    }

    return instagramLib.createReel(videoUrl, caption);
  }

  public async publishContent(creationId: string) {
    const validation = validator.publishContent(creationId);

    if (!validation.success) {
      return validation;
    }

    return instagramLib.publishContent(creationId);
  }
}

export default new Instagram();
