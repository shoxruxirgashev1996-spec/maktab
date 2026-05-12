# Testing Guide

## Unit Testing Setup

### Install Dependencies

```bash
cd backend
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev supertest @types/supertest
```

### Configure Jest

Create `backend/jest.config.js`:

```javascript
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts'
  ]
};
```

### Example Unit Tests

Create `backend/src/services/__tests__/firebase.service.test.ts`:

```typescript
import { FirebaseService } from '../firebase.service';

describe('FirebaseService', () => {
  describe('createDocument', () => {
    it('should create a new document', async () => {
      const data = { name: 'Test News', content: 'Content' };
      // Mock implementation
      expect(data).toBeDefined();
    });

    it('should throw error if required field is missing', async () => {
      const data = { name: 'Test News' }; // missing content
      expect(() => {
        if (!data.content) throw new Error('Content required');
      }).toThrow('Content required');
    });
  });
});
```

### Example Integration Tests

Create `backend/src/__tests__/routes.test.ts`:

```typescript
import request from 'supertest';
import app from '../server';

describe('Public API Routes', () => {
  describe('GET /api/health', () => {
    it('should return 200 with health status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/public/news', () => {
    it('should return paginated news', async () => {
      const response = await request(app)
        .get('/api/public/news')
        .query({ page: 1, limit: 10 });
      
      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.pagination).toBeDefined();
    });
  });
});

describe('Admin API Routes', () => {
  describe('POST /api/admin/login', () => {
    it('should return token on valid credentials', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'admin@test.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return 401 on invalid credentials', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'admin@test.com',
          password: 'wrong'
        });
      
      expect(response.status).toBe(401);
    });
  });
});
```

### Run Tests

```bash
npm test                    # Run all tests
npm test -- --coverage     # With coverage report
npm test -- --watch        # Watch mode
```

---

## Frontend Testing

### Install Dependencies

```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
npm install --save-dev jsdom
```

### Configure Vitest

Update `frontend/vite.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts']
  }
});
```

### Example Component Tests

Create `frontend/src/__tests__/components/Navbar.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

describe('Navbar Component', () => {
  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});
```

---

## Performance Testing

### Load Testing with k6

Create `tests/load-test.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Ramp-up
    { duration: '3m', target: 100 },  // Stress
    { duration: '1m', target: 0 },    // Ramp-down
  ],
};

const BASE_URL = 'http://localhost:3000/api';

export default function () {
  // Test public endpoints
  let response = http.get(`${BASE_URL}/public/news`);
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Test admin endpoints
  response = http.get(`${BASE_URL}/admin/dashboard`, {
    headers: {
      Authorization: 'Bearer YOUR_TOKEN'
    }
  });
  check(response, {
    'admin endpoint status 200': (r) => r.status === 200,
  });

  sleep(1);
}
```

### Run Load Test

```bash
k6 run tests/load-test.js
```

---

## Test Coverage Goals

| Component | Target Coverage |
|-----------|-----------------|
| Services | 90%+ |
| Controllers | 85%+ |
| Utilities | 95%+ |
| Middleware | 80%+ |

---

## Update package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --testMatch='**/*.integration.test.ts'",
    "test:load": "k6 run tests/load-test.js"
  }
}
```
