const errors = {
  GF0010001: "Username is required",
  GF0010002: "Username must be a string",
  GF0010003: "Username must be at least 3 characters",
  GF0010004: "Password is required",
  GF0010005: "Password must be a string",
  GF0010006: "Password must be at least 4 characters",
  GF0010007: "Invalid credentials",
  GF0010008: "Internal server error",
  GF0010009: "Login successful",
};

export default errors;

export type ErrorCode = keyof typeof errors;
