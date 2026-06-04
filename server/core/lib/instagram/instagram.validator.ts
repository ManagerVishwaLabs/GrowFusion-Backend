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
}

export default new InstagramAuthValidator();
