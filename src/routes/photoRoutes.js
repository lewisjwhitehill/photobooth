// Photo API Endpoints
import express from 'express'

// router for /photo endpoints
const router = express.Router()

// post endpoint for uploading photos, 10 photos max
router.post('/upload_images', upload.array('images', 10), (req, res, next) => {
    console.log(req.files);
    res.send("succesfully uploaded images.");
});

// post endpoint for a single photo
router.post('/upload_image', upload.single('image'), (req, res, next) => {
    console.log(req.file);
    res.send("successfully uploaded image");
});

// get endpoint returning all photos stored on the server
router.get('/photos', (req, res, next) => {
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

export default router