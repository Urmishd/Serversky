// middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create main uploads folder
const mainUploadDir = path.join(__dirname, "../uploads");

// Create image subfolder: uploads/img
const imgUploadDir = path.join(mainUploadDir, "img");

// Ensure both folders exist
if (!fs.existsSync(mainUploadDir)) {
  fs.mkdirSync(mainUploadDir, { recursive: true });
}
if (!fs.existsSync(imgUploadDir)) {
  fs.mkdirSync(imgUploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imgUploadDir); 
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Multer middleware
const upload = multer({ storage });

module.exports = upload;
