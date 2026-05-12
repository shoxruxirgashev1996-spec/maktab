# Security Specifications for Ixtisoslashtirilgan Maktab

## 1. Data Invariants
- **News**: Anyone can read news articles. Only verified administrators can create, update, or delete news. Title, content, and date are immutable if they represent a published state, normally only editable by admins.
- **Admission**: Public users can submit (create) admission applications. For privacy (PII), only administrators can read these records. Applicants cannot read their own record once submitted in this public form pattern (unless they were authenticated during submission, which we'll add if authenticated). Initial status is always 'pending'.
- **Announcement**: Publicly readable. Admin-only writes.
- **ContactMessage**: Publicly creatable. Admin-only reads.
- **Stats**: Publicly readable. Admin-only updates.

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)

1. **Privilege Escalation (News)**: Attempting to create a news article as an unauthenticated or non-admin user.
   - Payload: `{ "title": "Hacked", "content": "Bad news", "date": "2024-05-08" }`
   - Expected: `PERMISSION_DENIED`
2. **PII Leak (Admission)**: An unauthenticated or non-admin user attempting to list or get another student's admission data.
   - Operation: `list /admissions`
   - Expected: `PERMISSION_DENIED`
3. **Ghost Field Injection**: Attempting to create an admission with a non-existent field like `isAccepted: true`.
   - Payload: `{ "firstName": "John", "lastName": "Doe", "phone": "123", "birthDate": "2010-01-01", "isAccepted": true }`
   - Expected: `PERMISSION_DENIED`
4. **Identity Spoofing (News)**: A user trying to set themselves as an admin by writing to a protected path or field.
5. **Timestamp Forge (Contact)**: Sending a custom `createdAt` field that isn't the server time.
   - Payload: `{ "name": "A", "email": "a@a.com", "message": "Hi", "createdAt": "2020-01-01T00:00:00Z" }`
   - Expected: `PERMISSION_DENIED`
6. **Value Poisoning (Stats)**: Updating stats with an excessively long string (e.g., 2MB) to cause resource exhaustion.
   - Payload: `{ "students": "A".repeat(1024 * 1024 * 2) }`
   - Expected: `PERMISSION_DENIED`
7. **Status Short-circuiting (Admission)**: A public user trying to create an admission with `status: "accepted"`.
   - Payload: `{ "firstName": "J", "lastName": "D", "phone": "1", "birthDate": "2010", "status": "accepted" }`
   - Expected: `PERMISSION_DENIED`
8. **Orphaned Write (Sub-records)**: (Not applicable yet as no sub-collections).
9. **Illegal ID Characters**: Attempting to write a document with a malicious ID like `../../../etc/passwd`.
10. **Resource Exhaustion (News)**: Creating 10,000 news articles quickly (Rate limiting check).
11. **PII Read via Discovery**: Attempting to query `admissions` where `status == "pending"` without being an admin.
12. **Metadata Corruption**: Trying to modify `createdAt` once set.

## 3. Test Runner (Draft Plan)
A test runner (`firestore.rules.test.ts`) using `@firebase/rules-unit-testing` will be implemented to verify these scenarios against the rules.
