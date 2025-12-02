import express from "express";
import multer from "multer";
import photoRoutes from "./routes/routes.js";

const app = express();

const port = 8000 || process.env.port;

app.listen(port, () => {
  console.log(`Server is now listening on ${port}`);
});

// get endpoint
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the photo uploader. Wow!</h1>");
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
