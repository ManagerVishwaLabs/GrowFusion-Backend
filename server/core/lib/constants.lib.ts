const INSTAGRAM_AUTH_URL = "https://www.instagram.com/oauth/authorize/";

const INSTAGRAM_SCOPES = {
  BASIC: "instagram_business_basic",
  MANAGE_MESSAGES: "instagram_business_manage_messages",
  MANAGE_COMMENTS: "instagram_business_manage_comments",
  CONTENT_PUBLISH: "instagram_business_content_publish",
  MANAGE_INSIGHTS: "instagram_business_manage_insights",
};

const DEFAULT_SCOPES = [
  INSTAGRAM_SCOPES.BASIC,
  INSTAGRAM_SCOPES.CONTENT_PUBLISH,
];

export { INSTAGRAM_AUTH_URL, INSTAGRAM_SCOPES, DEFAULT_SCOPES };
