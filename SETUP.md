# Development Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/audimeme
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Database Schema

### User
- username (unique)
- email (unique)
- password (hashed)
- profilePicture
- bio
- createdAt

### Audio
- userId (reference to User)
- title
- description
- audioUrl
- duration
- fileSize
- isPublic
- plays
- downloads
- createdAt
- updatedAt

## Testing the App

1. Sign up with a test account
2. Record audio using browser microphone
3. Upload and view your recording
4. Generate WhatsApp share link
5. Explore public audios
6. View other users' recordings

## Troubleshooting

### Microphone not working
- Check browser permissions
- Ensure HTTPS or localhost (required by browsers)

### MongoDB connection fails
- Verify MongoDB is running
- Check connection string in .env
- Use MongoDB Atlas if local isn't available

### CORS errors
- Ensure backend CORS middleware is configured
- Check frontend API base URL

## Production Deployment

For production:
1. Set `NODE_ENV=production`
2. Use environment variables for secrets
3. Deploy backend (Heroku, AWS, etc.)
4. Deploy frontend (Vercel, Netlify, etc.)
5. Update API URLs for production
6. Use MongoDB Atlas or cloud database
7. Configure S3 or similar for file storage
