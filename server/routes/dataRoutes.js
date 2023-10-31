const asyncHandler = require('express-async-handler')
const { testApi } = require('../controller/dataController')
const router = require('express').Router()

router.get("/test-api", asyncHandler(testApi) )

module.exports = router