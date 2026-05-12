# Team Onboarding Guide

Your complete guide for onboarding new developers to the project.

---

## Welcome to the Team! 👋

This project is a modern, scalable school management system with:
- **Frontend**: React 19 with Vite
- **Backend**: Express.js with TypeScript
- **Database**: Firebase Firestore
- **Deployment**: Vercel (frontend) + Render (backend)

---

## Part 1: Getting Started (Day 1)

### 1.1 Set Up Your Development Environment

**Required Software:**
- Node.js 18 or higher (https://nodejs.org)
- Git (https://git-scm.com)
- VS Code (https://code.visualstudio.com)
- Docker (optional but recommended)

**Verify Installation:**
```bash
node --version    # Should be v18+
npm --version     # Should be 8+
git --version     # Should be 2.20+
```

### 1.2 Clone the Repository

```bash
# HTTPS
git clone https://github.com/your-org/school-system.git

# SSH (if configured)
git clone git@github.com:your-org/school-system.git

cd school-system
```

### 1.3 Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
npm run backend:install

# Install frontend dependencies
npm run frontend:install
```

### 1.4 Set Up Environment Variables

**Backend:**
```bash
# Create backend/.env from template
cp backend/.env.example backend/.env

# Edit backend/.env with actual values
# Get Firebase credentials from team lead
```

**Frontend:**
```bash
# Create frontend/.env from template
cp frontend/.env.example frontend/.env

# Use development API URL
VITE_API_URL=http://localhost:3000/api
```

### 1.5 Start Development Servers

**Option 1: Using npm scripts**
```bash
# Terminal 1: Backend
npm run backend:dev

# Terminal 2: Frontend
npm run frontend:dev
```

**Option 2: Using Docker (easier)**
```bash
docker-compose up
```

**Option 3: Using VS Code Tasks**
- Press `Ctrl+Shift+B` (or `Cmd+Shift+B` on Mac)
- Select "Run Frontend & Backend"

### 1.6 Verify Everything Works

- Open http://localhost:5173 (frontend)
- Check http://localhost:3000/api/health (backend health)
- Try logging in with admin credentials provided by team lead

**Success Checklist:**
- [ ] Frontend loads without errors
- [ ] Backend responds to API calls
- [ ] Can see project files (not "cannot find module")
- [ ] No environment variable warnings

---

## Part 2: Project Structure (Learn the Layout)

```
project-root/
├── frontend/                    # React Vite app
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API calls
│   │   ├── lib/                # Utilities
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # Express API
│   ├── src/
│   │   ├── middleware/         # Express middleware
│   │   ├── routes/             # API routes
│   │   ├── controllers/        # Route handlers
│   │   ├── services/           # Business logic
│   │   ├── lib/                # Database, utils
│   │   ├── config.ts           # Configuration
│   │   └── server.ts           # Main server file
│   ├── __tests__/              # Test files
│   ├── package.json
│   └── tsconfig.json
│
├── .github/
│   └── workflows/              # CI/CD pipelines
│
├── docs/                        # Documentation
│   ├── DEPLOYMENT.md           # Deploy guides
│   ├── DATABASE_MIGRATIONS.md  # Schema changes
│   ├── FEATURE_DEVELOPMENT.md  # Adding features
│   ├── SCALABILITY.md          # Growth strategies
│   └── TESTING.md              # Testing setup
│
├── docker-compose.yml          # Local Docker setup
└── package.json                # Root workspace config
```

### Key Files to Understand

1. **[backend/src/server.ts](backend/src/server.ts)** - Main server entry point
2. **[backend/src/config.ts](backend/src/config.ts)** - Configuration system
3. **[frontend/src/App.tsx](frontend/src/App.tsx)** - Frontend entry point
4. **[package.json](package.json)** - Scripts and workspaces
5. **[README.md](README.md)** - API documentation

---

## Part 3: Common Tasks (First Week)

### Task 1: Running Tests

```bash
# Run all tests
npm run test

# Watch mode (re-run on file changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

### Task 2: Type Checking

```bash
# Check for TypeScript errors (no build needed)
npm run type-check

# Fix simple issues automatically
npm run type-check --fix
```

### Task 3: Code Formatting

```bash
# Check code style
npm run lint

# Fix formatting issues automatically
npm run lint --fix

# Format specific file
prettier --write backend/src/server.ts
```

### Task 4: Making Your First Change

**Example: Adding a new API endpoint**

1. Create route in `backend/src/routes/public.ts`:
```typescript
router.get('/new-endpoint', asyncHandler(async (req, res) => {
  sendSuccess(res, { message: 'Hello!' });
}));
```

2. Add test in `backend/src/__tests__/routes.test.ts`:
```typescript
it('should respond to /new-endpoint', async () => {
  const response = await request(app).get('/api/public/new-endpoint');
  expect(response.status).toBe(200);
  expect(response.body.data.message).toBe('Hello!');
});
```

3. Test locally:
```bash
npm run backend:dev
curl http://localhost:3000/api/public/new-endpoint
```

4. Run tests:
```bash
npm run test
```

### Task 5: Viewing Logs

```bash
# Backend logs (real-time)
npm run backend:dev | grep -i error

# Frontend errors
# Right-click → Inspect → Console tab

# Production logs (if you have access)
render logs --service school-api --tail
```

---

## Part 4: Database Basics

### Understanding Collections

The database has these main collections:

**news** - Articles/announcements
```typescript
interface NewsDoc {
  id: string;
  title: string;
  content: string;
  author_id: string;        // Admin who created it
  created_at: Date;
  updated_at?: Date;
  status: 'draft' | 'published';
}
```

**admins** - Admin accounts
```typescript
interface AdminDoc {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  active: boolean;
}
```

See [backend/src/database.schema.ts](backend/src/database.schema.ts) for complete schema.

### Common Queries

```typescript
// Get published news (sorted newest first)
const news = await db.collection('news')
  .where('status', '==', 'published')
  .orderBy('created_at', 'desc')
  .limit(10)
  .get();

// Get admin by email
const admin = await db.collection('admins')
  .where('email', '==', 'admin@school.com')
  .limit(1)
  .get();
```

### Using the Query Service

For complex queries, use the provided QueryService:

```typescript
import { QueryService } from '../services/query.service';

const result = await QueryService.find(db, 'news', {
  filters: { status: 'published' },
  sort: { created_at: 'desc' },
  pagination: { page: 1, limit: 20 }
});
// result.data: News[]
// result.total: number
// result.hasNextPage: boolean
```

---

## Part 5: Authentication & Testing

### Getting Test Credentials

Ask your team lead for:
- Admin email: admin@school.com
- Admin password: [provided]
- Test user email: test@school.com
- Test user password: [provided]

### Testing Authentication

```bash
# Get JWT token
curl -X POST http://localhost:3000/api/public/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"password"}'

# Response:
# {"success":true,"data":{"token":"eyJ..."}}

# Use token in authenticated requests
curl http://localhost:3000/api/admin/news \
  -H "Authorization: Bearer eyJ..."
```

### In Frontend Code

Use the built-in API service:

```typescript
import { useAuth } from './context/AuthContext';
import { apiService } from './services/api';

export function MyComponent() {
  const { token } = useAuth();
  
  const loadNews = async () => {
    const news = await apiService.getNews(token);
    console.log(news);
  };
  
  return <button onClick={loadNews}>Load News</button>;
}
```

---

## Part 6: Git Workflow

### Branch Naming Convention

```
feature/feature-name          # New feature
fix/bug-name                 # Bug fix
docs/documentation-update    # Documentation
refactor/code-improvement    # Cleanup
```

### Making Changes

```bash
# 1. Create branch
git checkout -b feature/add-user-profile

# 2. Make changes
# ... edit files ...

# 3. Run tests
npm run test

# 4. Commit
git add .
git commit -m "feat: Add user profile page"

# 5. Push
git push origin feature/add-user-profile

# 6. Create Pull Request
# Go to GitHub → Click "Compare & pull request"

# 7. Wait for review and CI to pass
# Merge when approved
```

### Commit Message Format

Follow conventional commits:

```
type(scope): description

feat(admin): Add delete user endpoint
fix(auth): Fix token expiration bug
docs(api): Update API documentation
refactor(services): Simplify query logic
test(backend): Add unit tests for auth
```

### Useful Git Commands

```bash
# See your changes
git diff

# Undo uncommitted changes
git checkout -- filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Update your branch with latest main
git fetch origin
git rebase origin/main

# Stash changes temporarily
git stash
git stash pop
```

---

## Part 7: Code Review Checklist

When reviewing PRs, check:

- [ ] Code follows project patterns (see existing files)
- [ ] Tests added for new functionality
- [ ] No console.logs or debug code
- [ ] TypeScript types are correct (no `any`)
- [ ] Comments explain "why", not "what"
- [ ] Performance: No N+1 queries or unnecessary loops
- [ ] Security: No hardcoded secrets, proper auth checks
- [ ] Documentation updated if needed

---

## Part 8: Common Issues & Solutions

### "Module not found" Error

```
Error: Cannot find module '@/components/Button'

Solution:
1. Check path alias in tsconfig.json
2. Check file exists
3. Import without @: import Button from '../components/Button'
```

### Port Already in Use

```
Error: Port 3000 is already in use

Solution 1: Kill process using port
npx kill-port 3000

Solution 2: Use different port
PORT=3001 npm run backend:dev
```

### Firebase Authentication Failed

```
Error: Firebase credentials not loaded

Solution:
1. Check backend/.env exists
2. Check FIREBASE_API_KEY is correct
3. Ask team lead for fresh credentials
4. restart: npm run backend:dev
```

### Merge Conflicts

```
# When pulling and there are conflicts:

# 1. Open conflicted file (marked with <<<< ==== >>>>)
# 2. Keep what you need, delete markers
# 3. Test thoroughly
git add .
git commit -m "chore: Resolve merge conflicts"
git push
```

---

## Part 9: Resources & Documentation

### Internal Documentation

- **[README.md](README.md)** - Project overview and API docs
- **[QUICK_START.md](QUICK_START.md)** - Quick reference
- **[SCALABILITY.md](SCALABILITY.md)** - How to scale the system
- **[TESTING.md](TESTING.md)** - Testing strategies
- **[FEATURE_DEVELOPMENT.md](FEATURE_DEVELOPMENT.md)** - Adding features
- **[DATABASE_MIGRATIONS.md](DATABASE_MIGRATIONS.md)** - Schema changes
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment processes

### External Resources

- **JavaScript/TypeScript**
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript
  - https://www.typescriptlang.org/docs

- **React**
  - https://react.dev - Official React docs
  - https://react-router.org - Routing docs

- **Express.js**
  - https://expressjs.com - Official documentation
  - https://github.com/expressjs/express/wiki

- **Firebase/Firestore**
  - https://firebase.google.com/docs/firestore
  - https://firebase.google.com/docs/database/security

- **Git**
  - https://git-scm.com/book/en/v2
  - https://github.com/git-tips/tips

### Slack/Communication

- **#general** - General updates
- **#dev** - Development discussion
- **#frontend** - React-specific questions
- **#backend** - Express/API questions
- **#database** - Firebase/queries
- **#deployments** - Deployment updates
- **#incidents** - Critical issues

---

## Part 10: Advanced Topics (After First Sprint)

After comfortable with basics, explore:

### API Versioning

The project supports multiple API versions:
- `/api/v1.0/news` - Version 1
- `/api/v2.0/news` - Version 2
- `/api/news` - Latest (v2.0)

See [backend/src/services/api-versioning.ts](backend/src/services/api-versioning.ts)

### Plugin System

Add features without modifying core server:
- EventsPlugin - Calendar events
- EmailPlugin - Notifications
- FileUploadPlugin - User uploads
- AnalyticsPlugin - Usage tracking

See [backend/src/plugins.ts](backend/src/plugins.ts)

### Performance Optimization

- Query caching in QueryService
- Denormalization strategies
- Index creation for complex queries

See [SCALABILITY.md](SCALABILITY.md) for details.

---

## First Week Checklist

- [ ] Development environment set up
- [ ] Code running locally
- [ ] Can run tests
- [ ] Made first commit
- [ ] Reviewed existing code
- [ ] Understood project structure
- [ ] Know how to deploy (staging)
- [ ] Met team members
- [ ] Have access to documentation
- [ ] Comfortable with git workflow

---

## Questions?

**Before asking, check:**
1. Search documentation
2. Look at similar code in project
3. Ask team in Slack
4. Schedule 1-on-1 with assigned mentor

**Getting Help:**
- Mentor: [Name] - messages for quick questions
- Tech Lead: [Name] - architecture decisions
- PM: [Name] - requirements clarification

---

## Welcome Aboard! 🚀

You're now ready to contribute. Your first task is:

[ ] **Complete the "First Week Checklist"**
[ ] **Fix a "good first issue"** labeled on GitHub
[ ] **Deploy to staging** following DEPLOYMENT.md

Happy coding! 💻
