# Feature Development Guide

## Adding a New Feature

Follow this checklist when adding new features to maintain scalability.

---

## 1. Feature Planning

### Define Scope

```
Feature: File Upload for Applications

[ ] Who needs this? (Admins, Users, Both)
[ ] What files? (PDF, Images, Documents)
[ ] File size limit? (10MB, 100MB)
[ ] Storage? (Firebase Storage, S3, CDN)
[ ] When needed? (v1, future phase)
```

### Create Issue/Card

```markdown
## File Upload Feature

### Requirements
- Store files for applications
- Support PDF, images
- Max 10MB per file
- Virus scanning required

### Tasks
- [ ] Backend: Create upload endpoint
- [ ] Backend: File validation
- [ ] Frontend: Upload UI component
- [ ] Tests: Unit + integration
- [ ] Docs: Update API docs
```

---

## 2. Backend Development

### Step 1: Create Service Module

Create `backend/src/services/upload.service.ts`:

```typescript
export class UploadService {
  async uploadFile(file: File, metadata: any) {
    // Validate
    this.validateFile(file);
    
    // Scan for viruses (if enabled)
    await this.scanFile(file);
    
    // Upload to Firebase Storage or CDN
    const url = await this.storeFile(file);
    
    // Save metadata
    await this.saveMetadata({ ...metadata, url });
    
    return { url, id: metadata.id };
  }
}
```

### Step 2: Create Route

Update `backend/src/routes/admin.ts`:

```typescript
router.post('/upload', 
  authMiddleware,
  validateFile,
  asyncHandler(uploadController.handleUpload)
);
```

### Step 3: Create Controller

Create `backend/src/controllers/upload.controller.ts`:

```typescript
export const handleUpload = async (req: AuthRequest, res: Response) => {
  const file = req.file;
  const result = await UploadService.uploadFile(file, {
    userId: req.admin?.id
  });
  
  sendSuccess(res, result, 'File uploaded', 201);
};
```

### Step 4: Add Validation

Update `backend/src/middleware/validators.ts`:

```typescript
export const validateFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    throw new AppError('No file provided', 400);
  }
  
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (req.file.size > maxSize) {
    throw new AppError('File too large', 413);
  }
  
  const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowed.includes(req.file.mimetype)) {
    throw new AppError('File type not allowed', 415);
  }
  
  next();
};
```

### Step 5: Add Database Schema

Update `backend/src/database.schema.ts`:

```typescript
/**
 * file_uploads
 * 
 * Fields:
 * - id: string
 * - original_name: string
 * - size: number
 * - mime_type: string
 * - url: string
 * - uploaded_by: string (admin id)
 * - scanned: boolean
 * - safe: boolean
 * - related_to: string (application id, etc.)
 * - created_at: timestamp
 */
```

### Step 6: Write Tests

Create `backend/src/__tests__/upload.test.ts`:

```typescript
describe('Upload Endpoint', () => {
  it('should upload file successfully', async () => {
    const response = await request(app)
      .post('/api/admin/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', 'test-file.pdf');
    
    expect(response.status).toBe(201);
    expect(response.body.data.url).toBeDefined();
  });

  it('should reject file > 10MB', async () => {
    const response = await request(app)
      .post('/api/admin/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', 'large-file.pdf'); // > 10MB
    
    expect(response.status).toBe(413);
  });
});
```

### Step 7: Update Config

Add to `backend/src/config.ts`:

```typescript
export interface Config {
  // ...
  fileUpload: FileUploadConfig;
}

export interface FileUploadConfig {
  enabled: boolean;
  maxSize: number;
  allowedTypes: string[];
  storage: 'firebase' | 's3' | 'local';
  cdnUrl?: string;
  scanEnabled: boolean;
}
```

---

## 3. Frontend Development

### Step 1: Create API Function

Update `frontend/src/services/api.ts`:

```typescript
export const apiService = {
  // ...
  async uploadFile(file: File, token: string) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${ADMIN_API}/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    
    return response.json();
  }
};
```

### Step 2: Create Component

Create `frontend/src/components/FileUpload.tsx`:

```typescript
export const FileUpload: React.FC<Props> = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const { token } = useAuth();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await apiService.uploadFile(file, token!);
      onUpload(result.data);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={handleChange}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
    </div>
  );
};
```

### Step 3: Use in Forms

Update `frontend/src/pages/Admission.tsx`:

```typescript
const [uploadedFile, setUploadedFile] = useState(null);

return (
  <form onSubmit={handleSubmit}>
    {/* ... other fields ... */}
    <FileUpload onUpload={setUploadedFile} />
    {uploadedFile && <p>Uploaded: {uploadedFile.name}</p>}
  </form>
);
```

---

## 4. Documentation

### Update README

Add to `README.md`:

```markdown
## File Upload

Files can be uploaded for applications with the following requirements:
- Maximum size: 10MB
- Supported types: PDF, JPG, PNG
- Virus scanning: Enabled
- CDN: Files cached for 24 hours

### API Endpoint

POST /api/admin/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Response:
{
  "success": true,
  "data": {
    "url": "https://cdn.example.com/uploads/abc123.pdf",
    "id": "file_123"
  }
}
```

---

## 5. Use Feature Flags

### Enable Gradually

```typescript
// In backend/src/config.ts
enableFileUploads: process.env.FEATURE_FILE_UPLOADS === 'true'

// In routes
if (config.features.enableFileUploads) {
  router.post('/upload', uploadHandler);
}
```

### Test Before Release

```
Development: FEATURE_FILE_UPLOADS=true
Staging: FEATURE_FILE_UPLOADS=true      # Test fully
Production: FEATURE_FILE_UPLOADS=false  # Roll out gradually
```

---

## 6. Rollout Strategy

### Phase 1: Internal Testing
- Team tests locally
- Tests pass with 80%+ coverage

### Phase 2: Staging Deployment
- Deploy to staging environment
- Run load tests
- Test with real data

### Phase 3: Canary Release
- Deploy to production
- Enable for 10% of users
- Monitor for errors

### Phase 4: Full Release
- Monitor performance metrics
- Gradually increase to 100%
- Keep rollback plan ready

---

## 7. Monitoring

### Add Metrics

```typescript
// Track upload metrics
logger.info('file_uploaded', {
  fileSize: file.size,
  fileType: file.type,
  duration: endTime - startTime,
  success: true
});
```

### Create Alerts

```
Alert if:
- Upload success rate < 95%
- Average upload time > 5s
- File storage usage > 80%
```

---

## 8. Maintenance

### Regular Tasks

- [ ] Monitor file storage costs
- [ ] Archive old uploads
- [ ] Clean up failed uploads
- [ ] Review security logs
- [ ] Update virus signatures

---

## Example: Adding Notifications Feature

### 1. Create Notification Service

```typescript
export class NotificationService {
  async sendAdminNotification(admins: string[], message: string) {
    // Send email or in-app notification
  }
}
```

### 2. Use in Handlers

```typescript
// When new application arrives
await NotificationService.sendAdminNotification(
  adminIds,
  'New application received'
);
```

### 3. Add Frontend Component

```typescript
const [notifications, setNotifications] = useState([]);

useEffect(() => {
  // Poll or use WebSocket for real-time
  const interval = setInterval(fetchNotifications, 5000);
}, []);
```

---

## Scaling Considerations

### Database Growth

As features add data:
- Monitor collection sizes
- Create indexes for new query patterns
- Archive old data
- Plan for sharding

### API Scale

As traffic grows:
- Monitor endpoint latency
- Add caching layer
- Implement rate limiting
- Use CDN for static assets

### File Storage

As uploads grow:
- Monitor storage costs
- Implement cleanup policies
- Consider S3 for cost efficiency
- Implement compression

---

## Checklist for New Features

- [ ] Requirement document created
- [ ] Architecture designed (scalable)
- [ ] Backend implementation complete
- [ ] Frontend implementation complete
- [ ] Tests written (80%+ coverage)
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Performance tested
- [ ] Security reviewed
- [ ] Deployed to staging
- [ ] Staging tests passed
- [ ] Deployed to production with feature flag
- [ ] Monitored for errors (24 hours)
- [ ] Documentation finalized
- [ ] Feature flag enabled (100%)
