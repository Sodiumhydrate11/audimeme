# AudiMeme Deployment Guide

## Local Development

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- Git

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env file with your settings
npm run dev
```

Backend API: `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend: `http://localhost:3000`

### Run Both (From Root)
```bash
npm install
npm run dev
```

## Production Deployment

### Backend Deployment (Heroku Example)

1. Create Heroku app:
```bash
heroku create audimeme-backend
```

2. Set environment variables:
```bash
heroku config:set MONGODB_URI=your_mongo_atlas_url
heroku config:set JWT_SECRET=your_secure_secret
heroku config:set FRONTEND_URL=your_frontend_url
```

3. Deploy:
```bash
git push heroku main
```

### Frontend Deployment (Vercel)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd frontend
vercel
```

3. Set environment variables in Vercel dashboard:
```
REACT_APP_API_URL=your_backend_url
```

### Alternative: AWS Deployment

**Backend (EC2 + RDS):**
- Launch EC2 instance
- Install Node.js
- Clone repository
- Configure environment variables
- Use PM2 for process management

**Frontend (CloudFront + S3):**
- Build React app: `npm run build`
- Upload to S3
- Configure CloudFront distribution

## Database Setup

### MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Create database user
4. Get connection string
5. Add to `.env`: `MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/audimeme`

### Local MongoDB

```bash
# Install MongoDB
# macOS
brew install mongodb-community

# Start MongoDB
mongod
```

## Environment Variables

### Backend (.env)
```
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/audimeme

# JWT
JWT_SECRET=use_a_strong_random_string

# Frontend
FRONTEND_URL=https://yourdomain.com

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name
```

### Frontend (.env)
```
REACT_APP_API_URL=https://api.yourdomain.com
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Certbot)
```bash
sudo apt-get install certbot
sudo certbot certonly --standalone -d yourdomain.com
```

### Configure Express for HTTPS
```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/domain/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/domain/fullchain.pem')
};

https.createServer(options, app).listen(443);
```

## Performance Optimization

### Backend
- Enable GZIP compression
- Use connection pooling for MongoDB
- Implement caching
- Use CDN for audio files

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Lazy load audio players
- Cache assets

## Monitoring & Logging

### Backend Logging
```bash
npm install winston
```

### Error Tracking
- Use Sentry for error monitoring
- Set up application performance monitoring

## Scaling

### Horizontal Scaling
- Use load balancer (AWS ALB, Nginx)
- Scale backend instances
- Use managed database (MongoDB Atlas)

### Caching
- Implement Redis for session storage
- Cache popular audio feeds

## Security Best Practices

1. **Input Validation** - Validate all user inputs
2. **Rate Limiting** - Prevent abuse
3. **CORS** - Properly configure CORS
4. **HTTPS** - Use SSL/TLS
5. **Secrets** - Never commit secrets to git
6. **SQL Injection** - Use parameterized queries (N/A for Mongoose)
7. **XSS Protection** - Sanitize HTML
8. **CSRF Tokens** - Implement CSRF protection

## Backup Strategy

- Daily MongoDB backups
- Store backups in S3
- Test restore procedure
- Document recovery process

## Maintenance

### Regular Updates
```bash
npm audit
npm audit fix
npm outdated
```

### Performance Monitoring
- Monitor database query times
- Track API response times
- Monitor server resources

## Troubleshooting

### Common Issues

**502 Bad Gateway**
- Check backend server status
- Verify environment variables
- Check logs

**CORS Errors**
- Verify CORS configuration
- Check frontend and backend URLs

**Database Connection**
- Verify connection string
- Check IP whitelist
- Ensure MongoDB is running

## Support Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
