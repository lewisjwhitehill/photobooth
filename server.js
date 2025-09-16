const express = require("express");
const multer = require("multer");
const fs = require('fs');

const app = express();
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

// // Expose uploads folder so client can fetch them (Not sure if I should do this yet)
// app.use('/uploads', express.static('uploads'))

const port = 8000;
app.listen(port, () => {
    console.log(`Server is now listening on ${port}`);
});

// get endpoint
app.get('/', (req, res) => {
    res.send("Welcome to the photo uploader. Wow!");
});

// post endpoint for uploading photos, 10 photos max
app.post('/upload_images', upload.array('images', 10), (req, res, next) => {
    console.log(req.files);
    res.send("succesfully uploaded images.");
});

// post endpoint for a single photo
app.post('/upload_image', upload.single('image'), (req, res, next) => {
    console.log(req.file);
    res.send("successfully uploaded image");
});

// get endpoint returning all photos stored on the server
app.get('/photos', (req, res, next) => {
    fs.readdir('./images', (err, files) => {
        if(err){
            console.log(err.stack)
            next(err)
        }else{
            let photo_arr = []
            files.forEach(file => {
                console.log(file)
                photo_arr.push(file)
            });
            res.status(200).json(photo_arr)
        }
    });
});

// Global error handler
app.use((err, req, res, next) => {
    // if it's a multer error
    if(err instanceof multer.MulterError){
        if(err.code == "LIMIT_FILE_SIZE"){
            return res.status(413).json({error : "File too large. Max size is 5MB"})
        }
        else{
            return res.status(401).json({error: "multer error"})
        }
    }
    // if fileFilterer threw a bad file type
    if(err.message == "BAD_FILE_TYPE"){
        return res.status(400).json({error: "Unsupported file type. Image files only."})
    }
    // default server error
    res.status(500).send("Something went wrong!");
});