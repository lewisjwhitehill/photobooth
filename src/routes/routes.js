// Photo API Endpoints
import express from 'express'
import {transformMiddleware, photoUploadMiddleware, photoReturnMiddleware} from '../middleware/middleware.js'
import { returnPhoto, savePhoto } from '../controllers/controller.js'
import { transformPhoto } from '../controllers/controller.js'

// router for /photo endpoints
const router = express.Router()

// photo upload endpoint
router.post('/upload_photo', photoUploadMiddleware, savePhoto);

// photo transformation endpoint
router.post('/transform_photo', transformMiddleware, transformPhoto);

// photo retrieval endpoint
router.get('/get_photo', photoReturnMiddleware, returnPhoto);

// // get endpoint returning all photos stored on the server
// router.get('/raw_photo', (req, res, next) => {
//     res.json(req.files || [])
// });

export default router