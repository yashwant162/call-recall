const asyncHandler = require('express-async-handler')
const { testApi, uploadAudio, convertSpeechToText, summarizeText } = require('../controller/dataController')
const { upload } = require('../middleware/fileUploads')
const router = require('express').Router()

router.get("/test-api", asyncHandler(testApi))
router.post("/upload-audio", upload.single('audioFile'), asyncHandler(uploadAudio))
router.post("/convert-to-text", asyncHandler(convertSpeechToText))
router.post("/summarize-text", summarizeText)

module.exports = router