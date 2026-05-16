const errors = {
  /* -------- DATABASE -------- */

  GF0010001: "Database operation failed",
  GF0010002: "Duplicate key error",
  GF0010003: "Document not found",
  GF0010004: "Validation failed",

  /* -------- AUTH -------- */
  GF0020001: "Username is required",
  GF0020002: "Username must be a string",
  GF0020003: "Username must be at least 3 characters",
  GF0020004: "Password is required",
  GF0020005: "Password must be a string",
  GF0020006: "Password must be at least 4 characters",
  GF0020007: "Invalid credentials",
  GF0020008: "Internal server error",
  GF0020009: "Login successful",

  /* -------- USER VALIDATION -------- */
  GF0030001: "First name is required",
  GF0030002: "First name must be a string",
  GF0030003: "First name must be at least 2 characters",
  GF0030004: "Email is required",
  GF0030005: "Email must be a string",
  GF0030006: "Invalid email address",
  GF0030007: "Username is required",
  GF0030008: "Username must be a string",
  GF0030009: "Username must be at least 3 characters",
  GF0030010: "Company is required",
  GF0030011: "Company must be a string",
  GF0030012: "Password hash is required",
  GF0030013: "Password hash must be a string",
  GF0030014: "Password hash must be at least 6 characters",
  GF0030015: "First name must be a string",
  GF0030016: "First name must be at least 2 characters",
  GF0030017: "Email must be a string",
  GF0030018: "Invalid email address",
  GF0030019: "Username must be a string",
  GF0030020: "Username must be at least 3 characters",
  GF0030021: "Company must be a string",

  /* -------- USER -------- */
  GF0040001: "User not found",
  GF0040002: "User already exists",
  GF0040003: "User created successfully",
  GF0040004: "User updated successfully",
  GF0040005: "User deleted successfully",
};
export default errors;
export type ErrorCode = keyof typeof errors;
