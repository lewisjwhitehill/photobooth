// controller for /photo endpoints
import { convertPhoto } from '../services/transform/transform.js';
import db from '../services/storage/db.js';
import crypto from 'crypto';
import pkg from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import primsa from '../prismaClient.js'
import prisma from '../prismaClient.js';
const { S3Client, PutObjectCommand, GetObjectCommand } = pkg;

// import dotenv from 'dotenv';

// S3 variables 
const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey
  },
  region: bucketRegion
})

// function to create unique names
const randomFunctionName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

export async function savePhoto (req, res, next) {
  try{
    // add to s3
    const fileName = req.filename;
    // unique file name for s3
    const random_hex_name = randomFunctionName()

    const params = {
      Bucket: bucketName,
      Key: random_hex_name,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    }
    
    const command = new PutObjectCommand(params);

    const s3_result = await s3.send(command)
    console.log("added to s3")
    const photo = await prisma.photos.create({
      data: {
        bucketname: random_hex_name,
        originalname: fileName
      }
    })
    console.log("added to prisma, id: ", photo.id)

    res.status(201).json({"id" : photo.id})

  } catch(err){
      next(err);
  }
}

export async function transformPhoto (req, res, next) {
  try {
    // get the file names
    const filePath = req.filePath ?? [];
    const instructions = req.instructions ?? "";

    if (!filePath || !instructions) return res.status(400).json({ error: 'Instructions or path invalid' });
    // convert the file 
    const result = await convertPhoto(filePath, instructions);
    return res.json({ "successful transformation" : result });
  } catch (err) { 
      next(err); 
  }
}

export async function returnPhoto (req, res, next) {
  try{

    const fileID = req.fileID ?? -1;

    if((fileID == -1)){
      return res.status(404).json({error: "invalid file ID"})
    }
    
    // get file name on bucket from db
    const photo = await primsa.photos.findUnique({
      where: {
        id: parseInt(fileID)
      },
    })
    

    if(!photo){
      return res.status(404).send({ message: "Photo not found in database"})
    }
    const s3fileName = photo.bucketname;
    console.log("s3 file name retrieved from db: ", s3fileName)
    // retrieve file from s3
    const params = {
      Bucket: bucketName,
      Key: s3fileName,
    }
    const command = new GetObjectCommand(params)
    
    const url = await getSignedUrl(s3, command, {expiresIn:3600})
    res.status(200).json({"url": url})

  } catch(err){
    console.log(err)
    next(err)
  }
}

