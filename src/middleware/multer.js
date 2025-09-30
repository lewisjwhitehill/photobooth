import multer from 'multer'

// set up multer storage configuration
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images");
    },
    filename: (req, file, cb) => {
        // taken from npm multer docs
        const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // preserve the orgininal file name but add a unique suffix
        cb(null, uniquePreffix + '-' + file.originalname);
    },
});

// set up multer file filtering configureation
const fileFilterMiddleware = (req, file, cb) => {
    // make sure the file type is an image file that they're uploading
    // could change to file.mimetype.startsWith("image/")
    if ((file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "application/octet-stream")) {
        cb(null, true)
    }  else {
        cb(new Error('BAD_FILE_TYPE'), false)
    }
}

// Give multer the storage configuration, individual file size limit and file type filtering function
const upload = multer({ storage : fileStorageEngine, 
                        limits: { fileSize: 5 * 1024 * 1024 },
                        fileFilter: fileFilterMiddleware});

export default upload
