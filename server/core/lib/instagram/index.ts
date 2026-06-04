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
}

export default new Instagram();
