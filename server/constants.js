// Configuration object for CORS (Cross-Origin Resource Sharing) settings
exports.allowedHosts = {
  credentials: true, // Allow sending credentials like cookies or HTTP authentication
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"], // Whitelist of allowed origins for cross-origin requests
};

// Constants object for common HTTP status codes
exports.constants = {
  VALIDATION_ERROR: 400, // HTTP 400 Bad Request status code
  UNAUTHORIZED: 401, // HTTP 401 Unauthorized status code
  FORBIDDEN: 403, // HTTP 403 Forbidden status code
  NOT_FOUND: 404, // HTTP 404 Not Found status code
  WENT_WRONG: 405, // Custom status code indicating something went wrong
  SERVER_ERROR: 500, // HTTP 500 Internal Server Error status code
};