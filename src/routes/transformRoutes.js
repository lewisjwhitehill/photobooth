import express from 'express'
import transformController from '../controllers/transformController.js'

const router = express.Router()

router.put('/transformPhoto', transformController.transformPhoto)

export default router