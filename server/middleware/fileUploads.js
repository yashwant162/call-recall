const multer = require('multer'); // Importing the Multer library for handling file uploads
const path = require('path'); // Importing the 'path' module for working with file paths
const fs = require('fs'); // Importing the 'fs' module for file system operations

// Define the destination for uploaded files and create the 'uploads' directory if it doesn't exist
const defineDestination = (req, file, cb) => {
  const uploadDir = 'uploads'; // The directory where files will be stored
  fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
  cb(null, uploadDir); // Pass the directory path to Multer
}

// Generate a unique file name for the uploaded file
const generateFileName = (req, file, cb) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Create a unique identifier for the file
  let ext = path.extname(file.originalname); // Get the file's original extension
  if (ext === '.wav') {
    ext = '.mp4'; // Change the extension to '.mp4' if it's '.wav'
  }
  cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Pass the generated file name to Multer
}

// Configure Multer with the defined storage options
const storage = multer.diskStorage({
  destination: defineDestination, // Set the destination directory
  filename: generateFileName, // Set the file name
});

const upload = multer({ storage }); // Create a Multer instance with the configured storage

module.exports = { upload }; // Export the Multer middleware for use in the application
