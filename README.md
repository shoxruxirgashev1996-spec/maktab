# School Management System

A production-ready fullstack application separating frontend (React/Vite) and backend (Express API) for school administration and public-facing website.

## Project Overview

This project has been refactored from a monolithic architecture to a clean, scalable separation of concerns:

- **Frontend**: React with Vite (modern SPA)
- **Backend**: Express.js REST API with Firebase integration
- **Database**: Firebase Firestore
- **Authentication**: JWT-based admin authentication

### Key Features

✅ Clean separation of frontend and backend  
✅ REST API with proper error handling  
✅ JWT authentication for admin routes  
✅ Request validation and security middleware  
✅ Rate limiting and CORS protection  
✅ TypeScript throughout  
✅ Environment-based configuration  
✅ Ready for Vercel (frontend) and Render (backend) deployment  

---

## Project Structure

```
.
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API service layer
│   │   ├── context/         # React context (auth)
│   │   ├── lib/             # Utilities
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── .env
│   ├── .env.example
│   └── index.html
│
├── backend/                  # Express API
│   ├── src/
│   │   ├── server.ts        # Main server file
│   │   ├── middleware/      # Express middleware
│   │   │   ├── errorHandler.ts
│   │   │   ├── auth.ts
│   │   │   ├── validators.ts
│   │   │   ├── logger.ts
│   │   │   └── rateLimiter.ts
│   │   ├── controllers/     # Route controllers
│   │   │   ├── public.controller.ts
│   │   │   └── admin.controller.ts
│   │   ├── routes/          # API routes
│   │   │   ├── health.ts
│   │   │   ├── public.ts
│   │   │   └── admin.ts
│   │   ├── services/        # Business logic
│   │   │   └── firebase.service.ts
│   │   └── utils/           # Helper functions
│   │       └── helpers.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   ├── .env.example
│   └── firebase-applet-config.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Firebase project (with Firestore)

### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

#### Backend (.env)

```bash
cp backend/.env.example backend/.env
```

Fill in your Firebase credentials:

```
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-random-secret-key
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
FIREBASE_DATABASE_ID=...
```

#### Frontend (.env)

```bash
cp frontend/.env.example frontend/.env
```

```
VITE_API_URL=http://localhost:3000/api
```

### 3. Run Locally

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:3000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. First Admin User

Create your first admin user in Firestore:

1. Go to Firebase Console → Firestore Database
2. Create a new document in `admins` collection:

```json
{
  "email": "admin@example.com",
  "password": "$2a$10$...", // bcrypt hashed password
  "name": "Admin User",
  "role": "super_admin"
}
```

For testing, you can use a hashing tool or Node.js:

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('password123', 10))"
```

---

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

Admin endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Public Endpoints

#### News

```
GET  /public/news                    # Get all news
GET  /public/news/:id                # Get news detail
```

#### Applications

```
GET  /public/admission               # Get admission info
POST /public/apply                   # Submit application

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+998 99 123 45 67",
  "message": "Application message"
}
```

#### Messages

```
POST /public/contact                 # Send message

Body:
{
  "name": "John",
  "email": "john@example.com",
  "phone": "+998 99 123 45 67",
  "message": "Contact message"
}
```

#### Other

```
GET  /public/banners                 # Get all banners
GET  /public/gallery                 # Get gallery images
GET  /public/budget                  # Get budget info
GET  /public/settings                # Get settings
```

### Admin Endpoints (Protected)

#### Authentication

```
POST /admin/login                    # Login

Body:
{
  "email": "admin@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "admin": {
      "id": "...",
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "super_admin"
    }
  }
}
```

#### Dashboard

```
GET  /admin/dashboard                # Get dashboard stats
```

#### News Management

```
GET    /admin/news                   # Get all news
POST   /admin/news                   # Create news
PUT    /admin/news/:id               # Update news
DELETE /admin/news/:id               # Delete news
```

#### Similar endpoints exist for:
- Banners: `/admin/banners`
- Applications: `/admin/applications`
- Budget: `/admin/budget`
- Messages: `/admin/messages`
- Settings: `/admin/settings`
- Admins (Super Admin only): `/admin/admins`

---

## Frontend Features

### Pages

- **Home**: Landing page with banners and latest news
- **About**: Institution information
- **Admission**: Application form
- **News**: News listing and detail pages
- **Gallery**: Image gallery
- **Budget**: Budget information
- **Contact**: Contact form
- **Admin**: Admin login and dashboard

### State Management

Uses React Context API (`AuthContext`) for authentication state management.

### API Integration

All API calls go through the centralized `apiService` in `frontend/src/services/api.ts`.

---

## Deployment

### Frontend - Vercel

1. **Build:**

```bash
cd frontend
npm run build
```

2. **Deploy:**

```bash
npm install -g vercel
vercel
```

3. **Environment Variables** (in Vercel dashboard):

```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend - Render

1. **Create a `render.yaml`** at root:

```yaml
services:
  - type: web
    name: school-backend
    env: node
    buildCommand: cd backend && npm install && npm run build
    startCommand: cd backend && npm run start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: FRONTEND_URL
        value: https://your-frontend-url.com
      - key: JWT_SECRET
        generateValue: true
      # Add other env vars...
```

2. **Deploy:**

Connect your GitHub repo to Render and it will auto-deploy on push.

3. **Environment Variables** (in Render dashboard):

- Add all variables from `.env.example`

---

## Security Checklist

- ✅ JWT tokens with expiration (7 days)
- ✅ Password hashing with bcrypt
- ✅ CORS configured for frontend URL only
- ✅ Helmet security headers
- ✅ Rate limiting per IP
- ✅ Request validation on all endpoints
- ✅ Error messages don't leak sensitive info
- ✅ Admin routes protected with auth middleware
- ✅ Firebase rules should be configured in Firestore

### Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admins can read all collections
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Scripts

### Backend

```bash
npm run dev              # Run development server with hot reload
npm run build            # Build TypeScript to JavaScript
npm run start            # Run production build
npm run type-check       # Type check only
```

### Frontend

```bash
npm run dev              # Run development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run type-check       # Type check only
```

---

## Troubleshooting

### Backend won't start

1. Check `.env` file exists and has required variables
2. Check Firebase credentials are correct
3. Ensure port 3000 is not in use: `lsof -i :3000`

### Frontend won't connect to backend

1. Check `VITE_API_URL` in frontend `.env`
2. Ensure backend is running on the correct port
3. Check CORS is enabled in backend

### Firebase connection issues

1. Verify Firebase config in `firebase-applet-config.json`
2. Check Firebase rules allow reads/writes
3. Ensure Firestore database is created

### Login not working

1. Verify admin user exists in Firestore `admins` collection
2. Check password is bcrypt hashed
3. Verify JWT_SECRET is set and consistent

---

## Next Steps

1. **Add more features:**
   - File uploads (banners, gallery images)
   - Email notifications
   - Advanced filtering and search
   - Export to PDF/Excel

2. **Improve admin panel:**
   - Dashboard with charts
   - User management
   - Activity logs

3. **Performance:**
   - Add caching headers
   - Pagination for large datasets
   - Database indexing

4. **Testing:**
   - Add unit tests (Jest)
   - Add integration tests
   - Add API tests

---

## Contributing

Follow these guidelines:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push branch: `git push origin feature/your-feature`
4. Open a pull request

---

## License

This project is private and proprietary.

---

## Support

For issues or questions, please contact your administrator.

---

**Last Updated**: 2026-05-12  
**Version**: 1.0.0
