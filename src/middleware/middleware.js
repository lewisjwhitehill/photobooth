// photo transforming middleware
import fs from "fs";
import upload from "./multer.js";
import db from "../services/storage/db.js";

export async function photoUploadMiddleware(req, res, next) {
  // upload folders to disk with multer

  await new Promise((resolve, reject) => {
    upload.single("image")(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  req.filename = req.file.originalname;
  console.log("passed middleware");
  next();
}

export function transformMiddleware(req, res, next) {
  const fileID = req.headers["id"];

  // get instructions from request headers
  const instructions = req.headers["instructions"];
  if (!instructions) {
    res.status(400).json({ error: "instructions not provided" });
  }

  // set fields
  req.fileID = fileID;
  req.instructions = instructions;

  next();
}

export function photoReturnMiddleware(req, res, next) {
  req.headers;
  req.fileID = req.get("id");
  console.log("fileID: ", req.fileID);
  next();
}
