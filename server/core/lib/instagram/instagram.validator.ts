import { isValidMediaUrl } from "../../../utils/helperFunctions";
import { PROFILE_FIELDS } from "./instagram.constants";
import {
  CarouselItem,
  InstagramResponse,
  ProfileFields,
} from "./instagram.types";

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

    if (!isValidMediaUrl(imageUrl)) {
      return {
        success: false,
        message: "Invalid image URL",
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

    if (!isValidMediaUrl(videoUrl)) {
      return {
        success: false,
        message: "Invalid video URL",
      };
    }

    return {
      success: true,
      data: undefined,
    };
  }

  public createCarousel(mediaUrls: CarouselItem[]): InstagramResponse<void> {
    if (!mediaUrls?.length) {
      return {
        success: false,
        message: "Media URLs cannot be empty",
      };
    }

    if (mediaUrls.length < 2) {
      return {
        success: false,
        message: "Carousel must contain at least 2 media items",
      };
    }

    if (mediaUrls.length > 10) {
      return {
        success: false,
        message: "Cannot have more than 10 media items in a carousel",
      };
    }

    if (mediaUrls.some((item) => !item.url?.trim())) {
      return {
        success: false,
        message: "All media URLs must be non-empty",
      };
    }

    if (mediaUrls.some((item) => !isValidMediaUrl(item.url))) {
      return {
        success: false,
        message: "All media URLs must be valid",
      };
    }

    if (mediaUrls.some((item) => !item.type)) {
      return {
        success: false,
        message: "All media items must have a type",
      };
    }

    if (
      mediaUrls.some((item) => item.type !== "IMAGE" && item.type !== "VIDEO")
    ) {
      return {
        success: false,
        message: "Media type must be IMAGE or VIDEO",
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

  public createImageStory(imageUrl: string): InstagramResponse<void> {
    if (!imageUrl?.trim()) {
      return {
        success: false,
        message: "Image URL cannot be empty",
      };
    }

    if (!isValidMediaUrl(imageUrl)) {
      return {
        success: false,
        message: "Invalid image URL",
      };
    }

    return {
      success: true,
      data: undefined,
    };
  }

  public createVideoStory(videoUrl: string): InstagramResponse<void> {
    if (!videoUrl?.trim()) {
      return {
        success: false,
        message: "Video URL cannot be empty",
      };
    }

    if (!isValidMediaUrl(videoUrl)) {
      return {
        success: false,
        message: "Invalid video URL",
      };
    }

    return {
      success: true,
      data: undefined,
    };
  }
}

export default new InstagramAuthValidator();
