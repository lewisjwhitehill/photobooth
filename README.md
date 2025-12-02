Photobooth Backend

Backend service for an AI photobooth.  
Photos are uploaded → stored in **AWS S3** → tracked in a **database (Prisma)** → and can be transformed using **Google Gemini**.

## Features

- Upload photos directly to S3 (no local storage)  
- Store metadata (S3 key + original name) in a database via Prisma  
- Generate presigned URLs to retrieve photos  
- Transform photos using Google Gemini  
- Multer for file parsing  
- Express routing  

---

## Requirements

- Node.js 18+  
- An S3 bucket + IAM user with object upload permissions  
- A database supported by Prisma (Postgres, MySQL, SQLite, etc.)  
- A Google Gemini API key  

---

## Environment Variables

Create a `.env` file in the project root:

# AWS S3  
BUCKET_NAME=your_bucket  
BUCKET_REGION=your_region  
ACCESS_KEY=your_access_key  
SECRET_ACCESS_KEY=your_secret_key  

# Database (Prisma)  
DATABASE_URL=your_database_url  

# Gemini  
GEMINI_API_KEY=your_gemini_key  

---

## Install & Run

npm install  
npx prisma migrate dev  
npx prisma generate  
npm run dev  

Server runs at: http://localhost:8000

---

## API Overview

### POST /photo  
Upload an image.  
Form-data field: **image**  
Returns: `{ "id": <photo_id> }`

### POST /photo/:id/transform  
Transform an uploaded image using Gemini.  
JSON body: `{ "instructions": "your prompt here" }`  
Returns: Gemini output.

### GET /photo/:id  
Returns a presigned URL for the requested photo.  
Returns: `{ "url": "signed-url" }`

### GET /photos  
Returns all photos with presigned URLs.

---

## How It Works

1. Multer accepts the file.  
2. Controller streams it to S3 and saves metadata through Prisma.  
3. Transformation endpoint downloads the image bytes from S3 and sends to Gemini.  
4. Presigned URL endpoints make images accessible to clients.

---

## Prisma Model (Reference)

model Photos {  
id Int @id @default(autoincrement())  
bucketname String  
originalname String  
createdAt DateTime @default(now())  
}

---
