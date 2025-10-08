// Photo API Endpoints
import express from 'express'
import upload from '../middleware/multer.js'
import transformMiddleware from '../middleware/transform_middleware.js'
import { savePhoto } from '../controllers/controller.js'
import { transformPhoto } from '../controllers/controller.js'

// router for /photo endpoints
const router = express.Router()

// photo upload endpoint
router.post('/upload_photo', upload.array('image', 1), savePhoto);

// photo transformation endpoint
router.post('/transform_photo', transformMiddleware, transformPhoto);

// get endpoint returning all photos stored on the server
router.get('/photo', (req, res, next) => {
    res.json(req.files || [])
});

export default router