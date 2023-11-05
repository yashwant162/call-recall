const asyncHandler = require('express-async-handler')
const { uploadAudio, convertSpeechToText, summarizeText, convertSpeechToTextUsingAssemblyAI } = require('../controller/dataController')
const { upload } = require('../middleware/fileUploads')
const router = require('express').Router()

router.post("/upload-audio", upload.single('audioFile'), asyncHandler(uploadAudio))
router.post("/convert-to-text", asyncHandler(convertSpeechToText))
router.post("/convert-to-text-using-assemblyai", asyncHandler(convertSpeechToTextUsingAssemblyAI))
router.post("/summarize-text", asyncHandler(summarizeText))

module.exports = router