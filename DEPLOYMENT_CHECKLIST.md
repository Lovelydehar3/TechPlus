# Deployment Checklist

## Environment Variables - Backend (.env)

### Critical for Production
- ✅ `EMAIL` - Gmail account (configured)
- ✅ `EMAIL_PASS` - Gmail App Password (configured)
- ✅ `EMAIL_FORCE_RELAY=false` - Use direct SMTP instead of relay
- ✅ `JWT_SECRET` - Change to a strong random string
- ✅ `JWT_REFRESH_SECRET` - Change to a strong random string
- ✅ `MONGO_URI` - Update with production database
- ✅ `NODE_ENV=production` - Set when deploying
- ✅ `CLIENT_URL` - Update to your production frontend domain
- ✅ `ALLOWED_ORIGINS` - Update to your production frontend domain

### Optional
- `NEWSAPI_KEY` - For news features (already configured)
- `GNEWS_API_KEY` - For news features (already configured)
- `HACKATHON_SYNC_ON_BOOT=true` - Syncs hackathons on server start

## Environment Variables - Frontend (.env in client/)

```
VITE_API_URL=https://your-backend-domain.com
```

## Pre-Deployment Steps

### 1. Backend Email Configuration ✅ DONE
- Gmail SMTP is configured with app password
- EMAIL_FORCE_RELAY is set to false
- Email sending will use direct Gmail SMTP connection

### 2. Database
- Ensure MongoDB connection string is correct for production
- Current: Atlas cluster with replication enabled ✅

### 3. Security
- [ ] Change JWT_SECRET to a strong random string
- [ ] Change JWT_REFRESH_SECRET to a strong random string
- [ ] Remove any console.log statements before production
- [ ] Enable HTTPS for all domains

### 4. API Keys
- [ ] Verify NEWSAPI_KEY is valid
- [ ] Verify GNEWS_API_KEY is valid

### 5. CORS Configuration
Update for production domain:
```javascript
ALLOWED_ORIGINS=https://your-domain.com
CLIENT_URL=https://your-domain.com
```

### 6. Frontend Build
```bash
cd client
npm run build
```

### 7. Server Startup
```bash
cd server
npm install
npm start  # or npm run dev for development
```

## Deployment Platforms - Recommended Settings

### Render.com
1. Set all environment variables in Settings > Environment
2. Set `NODE_ENV=production`
3. Set correct `CLIENT_URL` and `ALLOWED_ORIGINS`
4. Email will use direct Gmail SMTP (no relay needed)

### Vercel (Frontend)
1. Set `VITE_API_URL` to your backend domain
2. Build command: `npm run build`
3. Output directory: `dist`

## Testing Production Setup Locally

```bash
# Terminal 1 - Backend
cd server
NODE_ENV=production npm start

# Terminal 2 - Frontend (build and preview)
cd client
npm run build
npm run preview
```

## Email Troubleshooting

### Issue: "Email relay authentication failed"
**Solution**: Already fixed by setting `EMAIL_FORCE_RELAY=false`

### Issue: Gmail SMTP connection fails
**Check**:
1. Email and email password are correct
2. Gmail account has "Less secure app access" enabled OR
3. Using App Password (2FA required): https://myaccount.google.com/apppasswords
4. Network firewall allows outbound port 465 (SMTP)

### Issue: Email timeout
**Solution**: Increase `EMAIL_TIMEOUT_MS` in .env (default: 15000ms)

## Monitoring Post-Deployment

1. Check server logs for email errors
2. Test user registration with valid email
3. Verify OTP email is received
4. Monitor authentication routes in production

## Additional Notes

- All sensitive credentials should be stored in deployment platform's environment variables
- Never commit `.env` file to version control
- Use `.env.example` to document required variables
- Consider adding error tracking (Sentry) for production
