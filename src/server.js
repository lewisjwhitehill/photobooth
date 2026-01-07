import express from "express";
import multer from "multer";
import photoRoutes from "./routes/routes.js";

const app = express();

// Middleware
app.use(express.json());

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is now listening on ${port}`);
});

// get endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "AI Photobooth backend is running",
    version: "1.0.0",
    endpoints: {
      "POST /photo/upload_photo": "Upload a photo",
      "POST /photo/transform_photo": "Transform a photo using AI",
      "GET /photo/get_photo": "Get a presigned URL for a photo",
      "GET /photo/get_all_photos": "Get all photos with presigned URLs",
    },
  });
});

// Routes
app.use("/photo", photoRoutes);

// Global error handler
app.use((err, req, res, next) => {
  // if it's a multer error
  if (err instanceof multer.MulterError) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "File too large. Max size is 5MB" });
    } else {
      return res.status(401).json({ error: "multer error" });
    }
  }
  // if fileFilterer threw a bad file type
  if (err.message == "BAD_FILE_TYPE") {
    return res
      .status(400)
      .json({ error: "Unsupported file type. Image files only." });
  }
  // default server error
  res.status(500).json({ error: err.message });
});
