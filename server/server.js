// Import required modules and configurations
const express = require("express");
const { allowedHosts } = require("./constants"); // Import allowed hosts from constants
const errorHandler = require("./middleware/errorHandler"); // Import error handler middleware
require("dotenv").config(); // Load environment variables from a .env file
const PORT = process.env.PORT; // Set the port from environment variables

const app = express(); // Create an Express application

const cors = require("cors"); // Import the CORS middleware

// Configure middleware
app.use(express.json()); // Enable JSON request and response handling
app.use('/uploads', express.static(__dirname + '/uploads')) // Serve uploaded files from the /uploads directory
app.use(cors(allowedHosts)); // Enable CORS with allowed hosts
app.use("/api/data", require("./routes/dataRoutes")); // Mount data routes under the /api/data path
app.use(errorHandler); // Use the error handler middleware

app.listen(PORT, () => {
  console.log(`Server launched on http://localhost:${PORT}`); // Log the server start-up message
});
