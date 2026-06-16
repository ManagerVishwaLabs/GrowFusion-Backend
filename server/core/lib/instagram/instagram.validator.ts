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
        code: "IG00030001",
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
        code: "IG00030002",
        success: false,
      };
    }

    if (!isValidMediaUrl(imageUrl)) {
      return {
        code: "IG00030003",
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
        code: "IG00030004",
        success: false,
      };
    }

    if (!isValidMediaUrl(videoUrl)) {
      return {
        code: "IG00030005",
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
        code: "IG00030006",
        success: false,
      };
    }

    if (mediaUrls.length < 2) {
      return {
        code: "IG00030007",
        success: false,
      };
    }

    if (mediaUrls.length > 10) {
      return {
        code: "IG00030008",
        success: false,
      };
    }

    if (mediaUrls.some((item) => !item.url?.trim())) {
      return {
        code: "IG00030009",
        success: false,
      };
    }

    if (mediaUrls.some((item) => !isValidMediaUrl(item.url))) {
      return {
        code: "IG00030010",
        success: false,
      };
    }

    if (mediaUrls.some((item) => !item.type)) {
      return {
        code: "IG00030011",
        success: false,
      };
    }

    if (
      mediaUrls.some((item) => item.type !== "IMAGE" && item.type !== "VIDEO")
    ) {
      return {
        code: "IG00030011",
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
        code: "IG00030002",
        success: false,
      };
    }

    if (!isValidMediaUrl(imageUrl)) {
      return {
        code: "IG00030003",
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
        code: "IG00030004",
        success: false,
      };
    }

    if (!isValidMediaUrl(videoUrl)) {
      return {
        code: "IG00030005",
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
        code: "IG00030012",
        success: false,
      };
    }

    if (Number.isNaN(Number(mediaId))) {
      return {
        code: "IG00030013",
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
        code: "IG00030014",
        success: false,
      };
    }

    if (Number.isNaN(Number(creationId))) {
      return {
        code: "IG00030015",
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
