# 🎨 AI Photobooth Backend

A modern, production-ready backend service for an AI-powered photobooth application. Upload photos, store them securely in AWS S3, track metadata in a database, and transform images using Google's Gemini AI - all with a clean REST API.

## ✨ Features

### Core Functionality
- **Direct S3 Upload**: Photos stream directly to AWS S3 (no local storage needed)
- **AI-Powered Transformations**: Transform photos using Google Gemini 2.5 Flash Image Preview
- **Presigned URLs**: Secure, time-limited access to photos
- **Metadata Tracking**: Store photo information in database via Prisma ORM
- **RESTful API**: Clean, well-structured Express.js endpoints

### Technical Highlights
- **Cloud-First Architecture**: Leverages AWS S3 for scalable storage
- **Modern Stack**: Express.js 5, Prisma 6, AWS SDK v3, Google GenAI
- **Type Safety**: Prisma schema ensures database consistency
- **Error Handling**: Comprehensive error handling with meaningful messages
- **File Validation**: Automatic image type validation and size limits (5MB max)

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **AWS Account** with S3 bucket + IAM credentials
- **Database** (SQLite, PostgreSQL, or MySQL)
- **Google Gemini API Key**

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd photobooth-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Set up database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the server**
   ```bash
   npm run dev
   ```

   Server will start at: `http://localhost:8000`

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```env
# AWS S3
BUCKET_NAME=your_bucket_name
BUCKET_REGION=us-east-1
ACCESS_KEY=your_access_key
SECRET_ACCESS_KEY=your_secret_key

# Database
DATABASE_URL="file:./prisma/dev.db"

# Google Gemini
GEMINI_API_KEY=your_gemini_key

# Server (optional)
PORT=8000
```

### AWS S3 Setup

1. Create an S3 bucket in your AWS account
2. Create an IAM user with the following policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject"
         ],
         "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
       }
     ]
   }
   ```
3. Generate access keys for the IAM user
4. Update your `.env` file with the credentials

### Database Setup

The project uses Prisma ORM and supports multiple databases:

- **SQLite** (default, good for development): `DATABASE_URL="file:./prisma/dev.db"`
- **PostgreSQL**: `DATABASE_URL="postgresql://user:password@localhost:5432/photobooth"`
- **MySQL**: `DATABASE_URL="mysql://user:password@localhost:3306/photobooth"`

Run migrations after setting up:
```bash
npx prisma migrate dev
```

## 📡 API Endpoints

### Base URL
```
http://localhost:8000
```

### 1. Upload Photo

Upload an image file to the system.

**Endpoint:** `POST /photo/upload_photo`

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with field `image` containing the file

**Example (cURL):**
```bash
curl -X POST http://localhost:8000/photo/upload_photo \
  -F "image=@path/to/your/image.jpg"
```

**Response:**
```json
{
  "id": 1
}
```

---

### 2. Transform Photo

Transform an uploaded photo using AI.

**Endpoint:** `POST /photo/transform_photo`

**Request:**
- Method: `POST`
- Headers:
  - `id`: Photo ID (number)
  - `instructions`: Transformation instructions (string)

**Example (cURL):**
```bash
curl -X POST http://localhost:8000/photo/transform_photo \
  -H "id: 1" \
  -H "instructions: make the person wear a wizard hat and add sparkles around them"
```

**Response:**
```json
{
  "status": "success",
  "message": "photo successfully transformed",
  "id": 1
}
```

**Example Instructions:**
- "make the background a beach sunset"
- "turn the person into a cartoon character"
- "add vintage film grain effect"
- "make them look like they're in space"

---

### 3. Get Photo

Retrieve a presigned URL for a specific photo.

**Endpoint:** `GET /photo/get_photo`

**Request:**
- Method: `GET`
- Headers:
  - `id`: Photo ID (number)

**Example (cURL):**
```bash
curl -X GET http://localhost:8000/photo/get_photo \
  -H "id: 1"
```

**Response:**
```json
{
  "url": "https://s3.amazonaws.com/bucket/abc123...?X-Amz-Algorithm=..."
}
```
*URL expires in 1 hour*

---

### 4. Get All Photos

Retrieve all photos with presigned URLs.

**Endpoint:** `GET /photo/get_all_photos`

**Request:**
- Method: `GET`

**Example (cURL):**
```bash
curl -X GET http://localhost:8000/photo/get_all_photos
```

**Response:**
```json
[
  {
    "id": 1,
    "originalName": "wedding-photo.jpg",
    "url": "https://s3.amazonaws.com/bucket/abc123..."
  },
  {
    "id": 2,
    "originalName": "party-photo.png",
    "url": "https://s3.amazonaws.com/bucket/def456..."
  }
]
```

---

### Health Check

Check if the server is running.

**Endpoint:** `GET /`

**Response:**
```json
{
  "status": "ok",
  "message": "AI Photobooth backend is running",
  "version": "1.0.0",
  "endpoints": {
    "POST /photo/upload_photo": "Upload a photo",
    "POST /photo/transform_photo": "Transform a photo using AI",
    "GET /photo/get_photo": "Get a presigned URL for a photo",
    "GET /photo/get_all_photos": "Get all photos with presigned URLs"
  }
}
```

## 🏗️ Architecture

### Flow Diagram

```
1. Client Upload
   └─> Multer (file validation)
       └─> S3 Upload
           └─> Prisma (save metadata)
               └─> Return Photo ID

2. Transform Request
   └─> Fetch from S3
       └─> Google Gemini API
           └─> Upload transformed image to S3
               └─> Update database (transformed flag)
                   └─> Return success

3. Retrieve Photo
   └─> Query Database
       └─> Generate Presigned URL
           └─> Return URL to client
```

### Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.1
- **Storage**: AWS S3 (via AWS SDK v3)
- **Database**: Prisma ORM (supports SQLite, PostgreSQL, MySQL)
- **AI**: Google Gemini 2.5 Flash Image Preview
- **File Handling**: Multer 2.0

### Database Schema

```prisma
model Photos {
  id            Int       @id @default(autoincrement())
  bucketname    String    @unique
  originalname  String
  transformed   Boolean   @default(false)
}
```

## 🎯 Use Cases

Perfect for:
- **Wedding Photobooths**: Fun AI transformations at events
- **Event Photography**: Instant creative photo editing
- **Social Media Apps**: AI-powered image enhancement
- **Portrait Apps**: Stylized photo transformations

## 🔒 Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created (photo uploaded)
- `400` - Bad Request (invalid input)
- `404` - Not Found (photo doesn't exist)
- `413` - Payload Too Large (file > 5MB)
- `500` - Internal Server Error

Example error response:
```json
{
  "error": "File too large. Max size is 5MB"
}
```

## 📦 Project Structure

```
photobooth-backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic
│   │   ├── ai/         # Gemini AI integration
│   │   ├── storage/    # Database operations
│   │   └── transform/  # Image transformation
│   └── server.js        # Entry point
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Migration files
├── .env.example        # Environment template
└── README.md           # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Powered by [Google Gemini AI](https://ai.google.dev/)
- Storage by [AWS S3](https://aws.amazon.com/s3/)
- Database management by [Prisma](https://www.prisma.io/)

---

**Made with ❤️ for creating amazing photo experiences**
