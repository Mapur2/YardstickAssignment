# Notes SaaS Backend

A multi-tenant SaaS Notes Application backend built with Node.js, Express, and MongoDB.

## Multi-Tenancy Approach

This application uses a **shared schema with tenant ID column** approach for multi-tenancy:

### Architecture Decision

- **Database**: Single MongoDB database
- **Schema**: Shared collections with tenant isolation via `tenant` field
- **Isolation**: Strict tenant isolation enforced at the application level
- **Scalability**: Suitable for moderate scale; can be migrated to database-per-tenant if needed

### Benefits of This Approach

1. **Cost Effective**: Single database instance
2. **Easy Maintenance**: Single schema to manage
3. **Cross-Tenant Analytics**: Possible (with proper permissions)
4. **Backup/Restore**: Simplified process
5. **Development Speed**: Faster to implement and test

### Tenant Isolation Implementation

- Every document includes a `tenant` field referencing the tenant
- All queries automatically filter by the authenticated user's tenant
- Middleware ensures no cross-tenant data access
- JWT tokens include tenant information for validation

## Features

- ✅ Multi-tenant architecture with strict isolation
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin/Member)
- ✅ Subscription feature gating (Free/Pro plans)
- ✅ Notes CRUD operations
- ✅ Health check endpoint
- ✅ CORS enabled for external access
- ✅ Rate limiting and security headers

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/verify` - Verify JWT token

### Notes
- `POST /api/notes` - Create a note
- `GET /api/notes` - List all notes for tenant
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `PATCH /api/notes/:id/archive` - Archive/unarchive note

### Tenants
- `GET /api/tenants/info` - Get tenant information
- `POST /api/tenants/:slug/upgrade` - Upgrade to Pro plan (Admin only)
- `GET /api/tenants/stats` - Get tenant statistics (Admin only)
- `POST /api/tenants/invite` - Invite user (Admin only)

### Health
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed health check

## Test Accounts

All accounts use password: `password`

| Email | Role | Tenant |
|-------|------|--------|
| admin@acme.test | Admin | Acme |
| user@acme.test | Member | Acme |
| admin@globex.test | Admin | Globex |
| user@globex.test | Member | Globex |

## Subscription Plans

### Free Plan
- Maximum 3 notes per tenant
- All CRUD operations available
- Upgrade prompt when limit reached

### Pro Plan
- Unlimited notes
- All Free plan features
- Accessible via upgrade endpoint (Admin only)

## Setup Instructions

### Prerequisites
- Node.js 16+ 
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/notes-saas
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

3. **Database Setup**
   ```bash
   # Start MongoDB (if running locally)
   mongod
   
   # Seed the database with test data
   npm run seed
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd backend
   vercel
   ```

3. **Environment Variables**
   Set these in Vercel dashboard:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string
   - `NODE_ENV` - production

## Security Features

- **Helmet.js**: Security headers
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for cross-origin requests
- **JWT**: Secure token-based authentication
- **Input Validation**: Express-validator for request validation
- **Password Hashing**: bcryptjs for secure password storage

## Database Schema

### Tenant Collection
```javascript
{
  name: String,
  slug: String (unique),
  subscription: {
    plan: 'free' | 'pro',
    noteLimit: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### User Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'member',
  tenant: ObjectId (ref: Tenant),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Note Collection
```javascript
{
  title: String,
  content: String,
  tenant: ObjectId (ref: Tenant),
  author: ObjectId (ref: User),
  tags: [String],
  isArchived: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Testing the API

### Health Check
```bash
curl https://your-api.vercel.app/api/health
```

### Login
```bash
curl -X POST https://your-api.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@acme.test","password":"password"}'
```

### Create Note (with token)
```bash
curl -X POST https://your-api.vercel.app/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Test Note","content":"This is a test note"}'
```

## Error Handling

The API returns consistent error responses:

```javascript
{
  "error": "Error type",
  "message": "Human readable message",
  "details": [] // Validation errors if applicable
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions/limits)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error
- `503` - Service Unavailable (health check failures)

## Monitoring and Logging

- Health check endpoints for monitoring
- Console logging for development
- Error tracking in production
- Database connection monitoring

## Future Enhancements

- Email invitations for user management
- Advanced note search and filtering
- Note sharing between users
- File attachments
- Audit logging
- Advanced analytics
- Webhook support
- API rate limiting per tenant
