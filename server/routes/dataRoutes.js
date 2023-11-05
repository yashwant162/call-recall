const asyncHandler = require('express-async-handler') // Middleware for handling async route handlers
// Importing controller functions
const { uploadAudio, convertSpeechToText, summarizeText, convertSpeechToTextUsingAssemblyAI } = require('../controller/dataController')
const { upload } = require('../middleware/fileUploads') // Middleware for file uploads
const router = require('express').Router() // Creating an Express router instance

// Define routes and associate them with their respective controller functions
router.post("/upload-audio", upload.single('audioFile'), asyncHandler(uploadAudio)) // Route for uploading audio files
router.post("/convert-to-text", asyncHandler(convertSpeechToText)) // Route for converting speech to text using Google Speech-to-text API
router.post("/convert-to-text-using-assemblyai", asyncHandler(convertSpeechToTextUsingAssemblyAI))  // Route for converting speech to text using AssemblyAI API for backup if google's api does not work.
router.post("/summarize-text", asyncHandler(summarizeText)) // Route for summarizing text using OPENAI API

module.exports = router // Export the configured router for use in the application