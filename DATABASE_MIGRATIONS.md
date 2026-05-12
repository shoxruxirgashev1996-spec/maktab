# Database Management & Migrations

## Firestore Schema Evolution

As your application grows, you'll need to modify the database structure. This guide covers safe schema evolution.

---

## Strategy 1: Adding New Fields

### Backwards Compatible Addition

When adding an optional field, no migration needed:

```typescript
// OLD
interface News {
  id: string;
  title: string;
  content: string;
}

// NEW - Safe, no migration needed
interface News {
  id: string;
  title: string;
  content: string;
  tags?: string[];      // Optional field
  featured?: boolean;
}
```

Existing documents will work fine. New documents include the field.

---

## Strategy 2: Adding Required Fields

When adding a required field, use a default value:

```typescript
// Migration script: backend/scripts/migrate-required-field.ts

import admin from 'firebase-admin';

async function addDefaultCategory() {
  const db = admin.firestore();
  const newsCollection = db.collection('news');
  
  const snapshot = await newsCollection
    .where('category', '==', undefined)
    .get();
  
  const batch = db.batch();
  
  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, {
      category: 'general',  // default
      updated_at: new Date()
    });
  });
  
  await batch.commit();
  console.log(`Updated ${snapshot.docs.length} documents`);
}

addDefaultCategory();
```

Run migration:
```bash
npx ts-node backend/scripts/migrate-required-field.ts
```

---

## Strategy 3: Renaming Fields

For renaming a field, shadow the old field:

```typescript
// Step 1: Add new field while keeping old
async function migrateRenameField() {
  const db = admin.firestore();
  const collection = db.collection('admins');
  
  const snapshot = await collection.get();
  const batch = db.batch();
  
  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, {
      email_address: doc.get('email'),  // New name
      // Keep old field for 30 days (for backward compatibility)
    });
  });
  
  await batch.commit();
}

// Step 2: In code, read from new field
const email = admin.email_address || admin.email;

// Step 3: After 30 days, remove old field
async function cleanupOldField() {
  const db = admin.firestore();
  const snapshot = await db.collection('admins').get();
  const batch = db.batch();
  
  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, {
      email: admin.firebaseDelete()  // Remove old field
    });
  });
  
  await batch.commit();
}
```

---

## Strategy 4: Removing Fields

Safe removal pattern:

```typescript
// Step 1: Stop writing to field in code
// (Update all write operations to exclude the field)

// Step 2: After 30 days, remove the field
async function removeField() {
  const db = admin.firestore();
  const collection = db.collection('news');
  
  const snapshot = await collection.get();
  const batch = db.batch();
  
  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, {
      deprecated_field: admin.firestore.FieldValue.delete()
    });
  });
  
  await batch.commit();
}
```

---

## Strategy 5: Splitting Collections

When a collection grows too large, split it:

```typescript
// Before: news collection with 1M documents

// After: news_2024_q1, news_2024_q2, news_archive
// (Split by date ranges)

async function splitNewsByYear() {
  const db = admin.firestore();
  const newsCollection = db.collection('news');
  
  // Migrate 2024 news to yearly collection
  const news2024 = await newsCollection
    .where('created_at', '>=', new Date('2024-01-01'))
    .where('created_at', '<', new Date('2025-01-01'))
    .get();
  
  const batch = db.batch();
  
  news2024.docs.forEach(doc => {
    const data = doc.data();
    batch.set(db.collection('news_2024').doc(doc.id), data);
  });
  
  await batch.commit();
}
```

---

## Strategy 6: Data Transformation

Transform data during migration:

```typescript
// Migrate to new format

async function normalizeData() {
  const db = admin.firestore();
  const newsCollection = db.collection('news');
  
  const snapshot = await newsCollection.get();
  const batch = db.batch();
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    
    batch.update(doc.ref, {
      // Transform: OLD -> NEW
      category: (data.category || 'uncategorized').toLowerCase(),
      tags: (data.tags || []).map(t => t.toLowerCase()),
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
    });
  });
  
  await batch.commit();
}
```

---

## Running Migrations

### Local Development

```bash
# Run migration locally against dev Firestore
firebase emulators:start

# In another terminal
npx ts-node backend/scripts/migrate-add-field.ts
```

### Staging

```bash
# Set credentials for staging
export GOOGLE_APPLICATION_CREDENTIALS=./staging-credentials.json

npx ts-node backend/scripts/migrate-add-field.ts
```

### Production

```bash
# 1. Backup production data
gcloud firestore export gs://your-bucket/backup-2024-01-15

# 2. Set credentials for production
export GOOGLE_APPLICATION_CREDENTIALS=./prod-credentials.json

# 3. Run migration
npx ts-node backend/scripts/migrate-add-field.ts

# 4. Verify
npx ts-node backend/scripts/verify-migration.ts

# 5. Keep backup for 30 days
```

---

## Migration Checklist

- [ ] Backup created
- [ ] Script tested on staging
- [ ] Rollback plan defined
- [ ] Validation queries written
- [ ] Team notified
- [ ] Migration scheduled during low-traffic time
- [ ] Performance impact assessed
- [ ] Indexes updated if needed
- [ ] Code changes merged before migration
- [ ] Metrics monitored after migration

---

## Firestore Indexing

### Auto-Created Indexes

Firestore creates automatic indexes for:
- Single field queries
- Ordering by a field

### Custom Indexes (Required)

Create indexes for complex queries:

```typescript
// Query that needs index:
db.collection('applications')
  .where('status', '==', 'pending')
  .where('created_at', '>', oneMonthAgo)
  .orderBy('created_at', 'desc')

// Firestore will prompt to create index automatically
// Or manually in firestore.rules:
```

**firestore.rules:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Auto-index for frequently used queries
  }
}
```

---

## Database Cleanup

### Archive Old Data

```typescript
async function archiveOldMessages() {
  const db = admin.firestore();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  const oldMessages = await db.collection('messages')
    .where('created_at', '<', oneYearAgo)
    .get();
  
  // Copy to archive collection
  const batch = db.batch();
  oldMessages.docs.forEach(doc => {
    batch.set(
      db.collection('messages_archived').doc(doc.id),
      { ...doc.data(), archived_at: new Date() }
    );
    batch.delete(doc.ref);
  });
  
  await batch.commit();
}
```

### Delete Soft-Deleted Records

```typescript
async function purgeSoftDeletedRecords() {
  const db = admin.firestore();
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  const deleted = await db.collection('news')
    .where('deleted_at', '<', ninetyDaysAgo)
    .get();
  
  const batch = db.batch();
  deleted.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
}
```

---

## Performance Optimization

### Query Optimization

```typescript
// BEFORE: Inefficient - retrieves all data then filters
const allNews = await db.collection('news').get();
const recent = allNews.docs.filter(doc => 
  doc.data().created_at > oneMonthAgo
);

// AFTER: Efficient - filters at database level
const recent = await db.collection('news')
  .where('created_at', '>', oneMonthAgo)
  .get();
```

### Pagination Optimization

```typescript
// Returns 1000 documents (expensive)
const allNews = await db.collection('news').get();

// Returns 20 documents (efficient)
const page = await db.collection('news')
  .orderBy('created_at', 'desc')
  .limit(20)
  .get();

// Get next page
const nextPage = await db.collection('news')
  .orderBy('created_at', 'desc')
  .startAfter(lastDoc)
  .limit(20)
  .get();
```

### Denormalization Strategy

For frequently read relationships, denormalize:

```typescript
// Before: Need 2 queries
const news = await db.collection('news').doc(newsId).get();
const admin = await db.collection('admins').doc(news.data().author_id).get();

// After: Denormalize admin data in news doc
interface News {
  title: string;
  author_id: string;
  author_name: string;     // Denormalized
  author_email: string;    // Denormalized
}

const news = await db.collection('news').doc(newsId).get();
// All data in one query
```

When denormalizing, keep data fresh with migration scripts.

---

## Monitoring Queries

### Track Query Performance

Add to queries:

```typescript
const start = Date.now();

const result = await db.collection('news')
  .where('status', '==', 'published')
  .limit(20)
  .get();

const duration = Date.now() - start;

if (duration > 1000) {
  logger.warn('Slow query', {
    collection: 'news',
    duration,
    documents: result.size
  });
}
```

### Firestore Usage

Monitor in Firebase Console:
- Reads per day
- Writes per day
- Deletes per day
- Storage used
- Index usage

---

## Backup Strategy

### Automated Daily Backups

```bash
# In .github/workflows/backup.yml
name: Daily Firestore Backup

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.FIREBASE_CREDENTIALS }}
      - run: |
          gcloud firestore export \
            gs://your-backup-bucket/backup-$(date +%Y-%m-%d)
```

### Restore from Backup

```bash
gcloud firestore import gs://bucket-name/backup-2024-01-15
```

---

## Testing Database Changes

### Unit Test Migration

```typescript
describe('Database Migrations', () => {
  it('should add category field to existing news', async () => {
    // Create test data
    await db.collection('news').doc('test1').set({
      title: 'Test',
      content: 'Content'
    });

    // Run migration
    await migrateCategory();

    // Verify
    const doc = await db.collection('news').doc('test1').get();
    expect(doc.data().category).toBe('general');
  });
});
```

---

## Disaster Recovery

### Recover from Accidental Delete

```bash
# 1. Stop application to prevent more writes
systemctl stop school-backend

# 2. Restore from backup
gcloud firestore import gs://backup-bucket/backup-2024-01-14

# 3. Verify restoration
firebase emulators:firestore --import=restored-data

# 4. Restart application
systemctl start school-backend

# 5. Check application logs
tail -f logs/server.log
```

---

## Change Record Template

When running a migration, document it:

```markdown
# Migration: Add Category Field to News

**Date**: 2024-01-15
**Author**: DevName
**Environment**: Production

## Changes
- Added `category` field to news collection
- Set default value: 'general'

## Impact
- 1,200 documents updated
- Query: Completed in 45 seconds
- Storage: Increased by ~2.4K

## Rollback
- Backup: gs://bucket/backup-2024-01-15
- Time: 15 minutes

## Verification
- Queries still work ✓
- Performance impact: None ✓
- Data integrity: Verified ✓
```
