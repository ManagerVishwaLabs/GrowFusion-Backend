const INSTAGRAM_OAUTH_URL = "https://www.instagram.com/oauth/authorize/";
const INSTAGRAM_CODE_EXCHANGE_URL =
  "https://api.instagram.com/oauth/access_token";
const INSTAGRAM_GRAPH_API_URL = "https://graph.instagram.com";

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

export {
  INSTAGRAM_OAUTH_URL,
  INSTAGRAM_CODE_EXCHANGE_URL,
  INSTAGRAM_GRAPH_API_URL,
  INSTAGRAM_SCOPES,
  DEFAULT_SCOPES,
};
