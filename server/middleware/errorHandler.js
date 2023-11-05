const { constants } = require("../constants"); // Importing custom constants for error status codes

// Error handling middleware function with parameters (err, req, res, next)
const errorHandler = (err, req, res, next) => {
  // Determine the HTTP status code based on the response status code or default to 500
  const statusCode = res.statusCode ? res.statusCode : 500;

  // Handling different error cases based on the status code
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      // Respond with a JSON object for a validation error
      res.json({
        title: "Validation Error",
        message: err.message,
        stackTree: err.stack,
      });
      break;

    case constants.WENT_WRONG:
      // Respond with a JSON object for a generic error
      res.json({
        title: "Something Went Wrong",
        message: err.message,
        stackTree: err.stack,
      });
      break;

    case constants.NOT_FOUND:
      // Respond with a JSON object for a "Not Found" error
      res.json({
        title: "Not Found",
        message: err.message,
        stackTree: err.stack,
      });
      break;

    case constants.UNAUTHORIZED:
      // Respond with a JSON object for an "Unauthorized" error
      res.json({
        title: "Unauthorized",
        message: err.message,
        stackTree: err.stack,
      });
      break;

    case constants.FORBIDDEN:
      // Respond with a JSON object for a "Forbidden" error
      res.json({
        title: "Forbidden",
        message: err.message,
        stackTree: err.stack,
      });
      break;

    case constants.SERVER_ERROR:
      // Respond with a JSON object for a server error
      res.json({
        title: "Server Error",
        message: err.message,
        stackTree: err.stack,
      });
      break;

    default:
      // If no specific status code matches, respond with a generic error message
      res.status(500).json({
        title: "Red ALERT",
        message: err.message,
        stackTree: err.stack,
      });
  }
};

module.exports = errorHandler; // Export the error handling middleware for use in the application
