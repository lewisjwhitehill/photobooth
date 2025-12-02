import multer from "multer";

// set up multer storage configuration
const storage = multer.memoryStorage();

// set up multer file filtering configuration
const fileFilterMiddleware = (req, file, cb) => {
  // make sure the file type is an image file that they're uploading
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("BAD_FILE_TYPE"), false);
  }
};

// Give multer the storage configuration, individual file size limit and file type filtering function
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilterMiddleware,
});

export default upload;
