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
        data: undefined,
        success: true,
      };
    }

    const hasInvalidFields = selectedFields.some(
      (field) => !PROFILE_FIELDS.includes(field),
    );

    if (hasInvalidFields) {
      return {
        message: "Invalid fields",
        success: false,
      };
    }

    return {
      data: undefined,
      success: true,
    };
  }

  public createImagePost(imageUrl: string): InstagramResponse<void> {
    if (!imageUrl?.trim()) {
      return {
        message: "Image URL cannot be empty",
        success: false,
      };
    }

    if (!isValidMediaUrl(imageUrl)) {
      return {
        message: "Invalid image URL",
        success: false,
      };
    }

    return {
      data: undefined,
      success: true,
    };
  }

  public createReel(videoUrl: string): InstagramResponse<void> {
    if (!videoUrl?.trim()) {
      return {
        message: "Video URL cannot be empty",
        success: false,
      };
    }

    if (!isValidMediaUrl(videoUrl)) {
      return {
        message: "Invalid video URL",
        success: false,
      };
    }

    return {
      data: undefined,
      success: true,
    };
  }

  public createCarousel(mediaUrls: CarouselItem[]): InstagramResponse<void> {
    if (!mediaUrls?.length) {
      return {
        message: "Media URLs cannot be empty",
        success: false,
      };
    }

    if (mediaUrls.length < 2) {
      return {
        message: "Carousel must contain at least 2 media items",
        success: false,
      };
    }

    if (mediaUrls.length > 10) {
      return {
        message: "Cannot have more than 10 media items in a carousel",
        success: false,
      };
    }

    if (mediaUrls.some((item) => !item.url?.trim())) {
      return {
        message: "All media URLs must be non-empty",
        success: false,
      };
    }

    if (mediaUrls.some((item) => !isValidMediaUrl(item.url))) {
      return {
        message: "All media URLs must be valid",
        success: false,
      };
    }

    if (mediaUrls.some((item) => !item.type)) {
      return {
        message: "All media items must have a type",
        success: false,
      };
    }

    if (
      mediaUrls.some((item) => item.type !== "IMAGE" && item.type !== "VIDEO")
    ) {
      return {
        message: "Media type must be IMAGE or VIDEO",
        success: false,
      };
    }

    return {
      data: undefined,
      success: true,
    };
  }

  public createImageStory(imageUrl: string): InstagramResponse<void> {
    if (!imageUrl?.trim()) {
      return {
        message: "Image URL cannot be empty",
        success: false,
      };
    }

    if (!isValidMediaUrl(imageUrl)) {
      return {
        message: "Invalid image URL",
        success: false,
      };
    }

    return {
      data: undefined,
      success: true,
    };
  }

  public createVideoStory(videoUrl: string): InstagramResponse<void> {
    if (!videoUrl?.trim()) {
      return {
        message: "Video URL cannot be empty",
        success: false,
      };
    }

    if (!isValidMediaUrl(videoUrl)) {
      return {
        message: "Invalid video URL",
        success: false,
      };
    }

    return {
      data: undefined,
      success: true,
    };
  }

  public getMedia(mediaId: string): InstagramResponse<void> {
    if (!mediaId?.trim()) {
      return {
        message: "Media ID cannot be empty",
        success: false,
      };
    }

    if (Number.isNaN(Number(mediaId))) {
      return {
        message: "Invalid media ID",
        success: false,
      };
    }

    return {
      data: undefined,
      success: true,
    };
  }

  public publishContent(creationId: string): InstagramResponse<void> {
    if (!creationId?.trim()) {
      return {
        message: "Creation ID cannot be empty",
        success: false,
      };
    }

    if (Number.isNaN(Number(creationId))) {
      return {
        message: "Invalid creation ID",
        success: false,
      };
    }

    return {
      data: undefined,
      success: true,
    };
  }
}

export default new InstagramAuthValidator();
