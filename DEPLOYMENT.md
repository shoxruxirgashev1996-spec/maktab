# Deployment Guides

Complete step-by-step deployment instructions for frontend (Vercel) and backend (Render).

---

## Part 1: Frontend Deployment (Vercel)

### Prerequisites

- [ ] GitHub account with your repository
- [ ] Vercel account (free tier available)
- [ ] React app ready in `frontend/` directory

### Step 1: Connect to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Search for your repository
4. Click "Import"

### Step 2: Configure Project

**Project Settings:**

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Set Environment Variables

In Vercel Project Settings → Environment Variables:

```
VITE_API_URL=https://your-api.onrender.com/api
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=https://your-sentry-dsn
```

For different environments:

```
Development:
  VITE_API_URL=http://localhost:3000/api

Preview (PR):
  VITE_API_URL=https://your-api-staging.onrender.com/api

Production:
  VITE_API_URL=https://your-api.onrender.com/api
```

### Step 4: Deploy

```bash
# Automatic deployment on push to main
git push origin main

# Manual deployment
vercel deploy --prod
```

### Step 5: Configure Custom Domain

1. Go to Vercel Project Settings → Domains
2. Add your domain (e.g., school.com)
3. Update DNS records as instructed
4. Wait for SSL certificate (usually 5 minutes)

### Step 6: Set Up CI/CD

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) automatically:
- Runs tests on PR
- Deploys preview to Vercel
- Deploys to production on main branch push

---

## Part 2: Backend Deployment (Render)

### Prerequisites

- [ ] GitHub account
- [ ] Render account (free tier available)
- [ ] Express server ready in `backend/` directory
- [ ] Firebase project set up
- [ ] PostgreSQL database (optional)

### Step 1: Create Render Service

1. Go to https://dashboard.render.com
2. Click "New Web Service"
3. Connect GitHub repository
4. Select repository

### Step 2: Configure Web Service

**Basic Settings:**

- **Name**: school-api
- **Environment**: Node
- **Region**: Closest to users
- **Branch**: main
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `backend`

### Step 3: Set Environment Variables

In Render Dashboard → Environment:

```
NODE_ENV=production
PORT=3000

# Firebase
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase vars

# Security
JWT_SECRET=your-super-secret-key-32-chars-minimum
CORS_ORIGINS=https://school.com,https://www.school.com

# Features
FEATURE_FILE_UPLOADS=true
FEATURE_EMAILS=true
```

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for initial deployment (3-5 minutes)
3. Check logs: "Server running on port 3000"

### Step 5: Connect to PostgreSQL (Optional)

If using PostgreSQL for caching/sessions:

1. Create PostgreSQL database in Render
2. Note connection string
3. Add DATABASE_URL to environment variables:

```
DATABASE_URL=postgresql://user:password@hostname:5432/dbname
```

### Step 6: Set Up Custom Domain

1. Go to Service Settings → Custom Domains
2. Add domain (e.g., api.school.com)
3. Update DNS CNAME record
4. SSL auto-configured within 5 minutes

### Step 7: Health Checks

Render automatically monitors:

```
GET /api/health
Response: {"status": "ok"}
```

If health check fails 3 times, service restarts automatically.

---

## Part 3: Database Deployment (Firebase)

### Step 1: Enable Firestore

1. Go to Firebase Console
2. Select your project
3. Click "Firestore Database"
4. Click "Create Database"
5. Select region (same as users if possible)
6. Choose security rules:
   - Start in **test mode** (development)
   - Switch to **production mode** (secure) after rules configured

### Step 2: Create Initial Collections

```bash
# Use Firebase CLI
firebase init firestore

# Create collections with sample data
firebase firestore:import backup-2024.json
```

Or use Firebase Console → Add Collection:

```
Collection: admins
Documents: Create first admin
Fields: email, password_hash, name, active, created_at

Collection: news
Collection: banners
Collection: applications
# ... other collections from database.schema.ts
```

### Step 3: Create Firestore Indexes

For complex queries in production:

```bash
# Deploy indexes defined in firestore.indexes.json
firebase deploy --only firestore:indexes
```

Or manually in Firebase Console → Indexes → Create Index

### Step 4: Set Security Rules

Replace default rules in `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read-only collections
    match /news/{document=**} {
      allow read;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    // Admin-only collections
    match /admins/{document=**} {
      allow read, write: if request.auth != null && 
                            request.auth.token.admin == true;
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

### Step 5: Backup Strategy

Automated daily backups:

```bash
# Create Cloud Scheduler job
gcloud scheduler jobs create app-engine daily-firestore-backup \
  --schedule="0 2 * * *" \
  --http-method=POST \
  --uri=https://region-projectid.cloudfunctions.net/backup
```

Or use Firebase's built-in backup (in Project Settings):
- Enable automated backups
- Set retention: 30 days
- Location: Multi-region

---

## Part 4: Environment Configuration by Stage

### Development (Local)

```bash
# backend/.env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-key-for-local-testing-only
```

```bash
# frontend/.env
VITE_API_URL=http://localhost:3000/api
```

### Staging (Pre-Production)

```bash
# Render staging service
NODE_ENV=staging
FIREBASE_PROJECT_ID=school-staging
JWT_SECRET=staging-secret-verify-in-vault
CORS_ORIGINS=https://staging.school.com
```

Run tests:
```bash
npm run test
npm run e2e
```

### Production

```bash
# Render production service
NODE_ENV=production
FIREBASE_PROJECT_ID=school-production
JWT_SECRET=production-secret-in-vault
CORS_ORIGINS=https://school.com
MAINTENANCE_MODE=false
```

---

## Part 5: Pre-Deployment Checklist

### Backend

- [ ] All tests pass: `npm run test`
- [ ] Type checking passes: `npm run type-check`
- [ ] Code linting passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Environment variables documented in .env.example
- [ ] Error tracking enabled (Sentry)
- [ ] Health check endpoint working
- [ ] CORS configured for frontend domain
- [ ] Rate limiting configured
- [ ] Security headers enabled (Helmet)

### Frontend

- [ ] All tests pass: `npm run test`
- [ ] Type checking passes: `npm run type-check`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors
- [ ] API URL points to staging/prod
- [ ] API error handling tested
- [ ] Loading states working
- [ ] Auth token refresh working
- [ ] Performance budget met

### Database

- [ ] Firestore collections created
- [ ] Indexes created for complex queries
- [ ] Security rules deployed
- [ ] Sample data loaded
- [ ] Backup enabled
- [ ] Data retention policies set

### Security

- [ ] JWT secret is strong (32+ chars)
- [ ] API keys not in code (in env vars)
- [ ] CORS origins restricted
- [ ] Rate limiting enabled
- [ ] Helmet security headers enabled
- [ ] HTTPS enforced
- [ ] SQL injection prevention (not applicable with Firestore)
- [ ] XSS protection enabled

---

## Part 6: Post-Deployment Monitoring

### First 24 Hours

Monitor these metrics:

1. **Error Rate**: Should be < 0.1%
2. **Response Time**: Should be < 200ms
3. **Uptime**: Should be 100%
4. **CPU Usage**: Should be < 50%
5. **Memory Usage**: Should be < 70%

View in:
- Render Dashboard → Logs
- Firebase Console → Metrics
- Vercel Dashboard → Analytics

### Automated Monitoring

Set up alerts:

```bash
# Render: In Service Settings → Alerts
Alert if:
- Response time > 1000ms
- Memory usage > 500MB
- Restarts > 0 (per hour)
```

### Health Checks

```bash
# Check backend health
curl https://api.school.com/api/health

# Check frontend loads
curl https://school.com | grep "<title>"

# Check API response
curl https://api.school.com/api/public/news | grep -c "title"
```

---

## Part 7: Rollback Procedure

If deployment has critical issues:

### Backend Rollback (Render)

1. Go to Render Dashboard → Deployments
2. Find previous successful deployment
3. Click "Redeploy"
4. Verify health check passes
5. Monitor logs

Estimated time: 3-5 minutes

### Frontend Rollback (Vercel)

1. Go to Vercel Dashboard → Deployments
2. Find previous successful deployment
3. Click "Promote to Production"
4. Verify site loads
5. Check browser console

Estimated time: 1-2 minutes

### Database Rollback

```bash
# Restore from backup
gcloud firestore import gs://backup-bucket/backup-2024-01-14

# Verify data
firebase firestore:describe
```

Estimated time: 5-10 minutes

---

## Part 8: Scaling for Growth

### At 1,000 Users

- [ ] Monitor database reads/writes
- [ ] Enable Firestore composite indexes if needed
- [ ] Consider caching layer (Redis)
- [ ] Review query performance

### At 10,000 Users

- [ ] Implement Redis caching
- [ ] Split large collections (news_2024_q1, etc.)
- [ ] Add PostgreSQL for caching/sessions
- [ ] Consider file uploads to S3

### At 100,000 Users

- [ ] Multi-region deployment
- [ ] CDN for static files
- [ ] Advanced caching strategies
- [ ] Database sharding
- [ ] Message queue for background jobs

See [SCALABILITY.md](SCALABILITY.md) for detailed strategies.

---

## Part 9: Incident Response

### Database Down

1. Check Firebase Console status
2. Try restoring from backup
3. If persistent, contact Firebase support
4. Communicate downtime to users

### API Down

1. Check Render dashboard
2. View logs for errors
3. Redeploy last known good version
4. If redeployment fails, check environment variables

### Frontend Down

1. Check Vercel dashboard
2. Try redeploying
3. Check DNS propagation (nslookup school.com)
4. Clear CDN cache

### All Down (Use Maintenance Page)

Deploy maintenance page:

```bash
# Quick deploy holding page
vercel deploy frontend --prod \
  --meta-static="true"
```

---

## Part 10: Production Runbooks

### Morning Checklist

```bash
#!/bin/bash
# daily-check.sh

# Check backend
curl https://api.school.com/api/health

# Check frontend
curl https://school.com | grep "<!DOCTYPE"

# Check database
firebase firestore:list

# Check error tracking
# Go to Sentry dashboard, check for new errors

echo "✓ All systems operational"
```

### Emergency Contact

Save this info securely:

```
Firebase Support: support@firebase.google.com
Render Support: support@render.com
Vercel Support: support@vercel.com
On-call Engineer: [Your Number]
Status Page: https://status.school.com
```

---

## Quick Reference

```bash
# Simulate production locally
NODE_ENV=production npm start

# Deploy frontend
git push origin main  # Auto-deploys to Vercel

# Deploy backend  
git push origin main  # Auto-deploys to Render

# View backend logs
render logs --service school-api --tail

# View frontend analytics
vercel analytics

# Backup Firestore
firebase firestore:backup gs://bucket-name
```
