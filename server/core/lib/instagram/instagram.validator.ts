import { PROFILE_FIELDS } from "./instagram.constants";
import { InstagramResponse, ProfileFields } from "./instagram.types";

class InstagramAuthValidator {
  public getProfile(selectedFields?: ProfileFields): InstagramResponse<void> {
    if (!selectedFields) {
      return {
        success: true,
        data: undefined,
      };
    }

    const hasInvalidFields = selectedFields.some(
      (field) => !PROFILE_FIELDS.includes(field),
    );

    if (hasInvalidFields) {
      return {
        success: false,
        message: "Invalid fields",
      };
    }

    return {
      success: true,
      data: undefined,
    };
  }

  public createImagePost(imageUrl: string): InstagramResponse<void> {
    if (!imageUrl?.trim()) {
      return {
        success: false,
        message: "Image URL cannot be empty",
      };
    }

    return {
      success: true,
      data: undefined,
    };
  }

  public createReel(videoUrl: string): InstagramResponse<void> {
    if (!videoUrl?.trim()) {
      return {
        success: false,
        message: "Video URL cannot be empty",
      };
    }

    return {
      success: true,
      data: undefined,
    };
  }

  public publishContent(creationId: string): InstagramResponse<void> {
    if (!creationId?.trim()) {
      return {
        success: false,
        message: "Creation ID cannot be empty",
      };
    }

    if (Number.isNaN(Number(creationId))) {
      return {
        success: false,
        message: "Invalid creation ID",
      };
    }

    return {
      success: true,
      data: undefined,
    };
  }
}

export default new InstagramAuthValidator();
