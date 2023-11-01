const multer = require('multer');
const path = require('path');
const fs = require('fs');

const defineDestination = (req, file, cb) => {

  const uploadDir = 'uploads';
  fs.mkdirSync(uploadDir, { recursive: true });
  cb(null, uploadDir);
}

const generateFileName = (req, file, cb) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname);
  cb(null, file.fieldname + '-' + uniqueSuffix + ext);
}

const storage = multer.diskStorage({
  destination: defineDestination,
  filename: generateFileName,
});

const upload = multer({ storage });

module.exports = { upload }