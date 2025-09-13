# Multi-Tenant SaaS Notes Application

A complete full-stack multi-tenant SaaS Notes Application with strict tenant isolation, role-based access control, and subscription feature gating. Built with Node.js, MongoDB, React, and deployed on Vercel.

## 🏗️ Architecture

### Multi-Tenancy Approach
This application uses a **shared schema with tenant ID column** approach:
- Single MongoDB database with tenant isolation via `tenant` field
- Strict application-level isolation enforcement
- Cost-effective and easy to maintain
- Suitable for moderate scale with migration path to database-per-tenant

### Tech Stack
- **Backend**: Node.js, Express, MongoDB, JWT
- **Frontend**: React, Vite, Tailwind CSS, Axios
- **Deployment**: Vercel
- **Database**: MongoDB (local or cloud)

## 🚀 Features

### ✅ Multi-Tenancy
- Support for multiple tenants (Acme, Globex)
- Strict data isolation between tenants
- Tenant-specific user management
- Tenant information and statistics

### ✅ Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/Member)
- Secure password hashing
- Token expiration handling

### ✅ Subscription Management
- **Free Plan**: Limited to 3 notes
- **Pro Plan**: Unlimited notes
- Real-time upgrade functionality
- Usage tracking and limits

### ✅ Notes Management
- Full CRUD operations for notes
- Rich text editing with character limits
- Tag system for organization
- Archive/unarchive functionality
- Author tracking and timestamps

### ✅ Modern UI/UX
- Responsive design for all devices
- Clean, professional interface
- Real-time updates and feedback
- Error handling and validation
- Mobile-first approach

## 📋 Test Accounts

All accounts use password: `password`

| Email | Role | Tenant |
|-------|------|--------|
| admin@acme.test | Admin | Acme |
| user@acme.test | Member | Acme |
| admin@globex.test | Admin | Globex |
| user@globex.test | Member | Globex |

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 16+
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/notes-saas
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## 🌐 API Endpoints

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

### Health
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed health check

## 🚀 Deployment

### Backend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy backend**
   ```bash
   cd backend
   vercel
   ```

3. **Set environment variables in Vercel dashboard:**
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string
   - `NODE_ENV` - production

### Frontend Deployment (Vercel)

1. **Deploy frontend**
   ```bash
   cd frontend
   vercel
   ```

2. **Set environment variables in Vercel dashboard:**
   - `VITE_API_URL` - Your deployed backend URL

## 🧪 Testing

### Backend Testing
```bash
cd backend
node test-api.js
```

### Manual Testing
1. Start both backend and frontend
2. Navigate to `http://localhost:5173`
3. Use the test accounts to login
4. Test note creation, editing, and deletion
5. Test tenant upgrade functionality
6. Verify tenant isolation

## 📁 Project Structure

```
yardistikAssignment/
├── backend/                 # Node.js backend
│   ├── controllers/         # Business logic
│   ├── middleware/          # Authentication & validation
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── scripts/            # Database seeding
│   ├── server.js           # Main server file
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main app
│   └── package.json
└── README.md
```

## 🔒 Security Features

- **Helmet.js**: Security headers
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for cross-origin requests
- **JWT**: Secure token-based authentication
- **Input Validation**: Express-validator for request validation
- **Password Hashing**: bcryptjs for secure password storage
- **Tenant Isolation**: Strict data separation

## 📱 Responsive Design

The frontend is fully responsive with:
- **Mobile-first** design approach
- **Collapsible sidebar** on mobile devices
- **Touch-friendly** buttons and inputs
- **Optimized typography** for all screen sizes
- **Responsive grid layouts** for notes and dashboard

## 🎨 UI/UX Features

- **Modern design** with Tailwind CSS
- **Smooth animations** and transitions
- **Loading states** and error handling
- **Form validation** with real-time feedback
- **Toast notifications** for user actions
- **Professional color scheme** and typography

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon
npm run seed # Seed database
```

### Frontend Development
```bash
cd frontend
npm run dev  # Start Vite dev server
npm run build # Build for production
```

## 📊 Database Schema

### Tenant Collection
```javascript
{
  name: String,
  slug: String (unique),
  subscription: {
    plan: 'free' | 'pro',
    noteLimit: Number
  }
}
```

### User Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'member',
  tenant: ObjectId (ref: Tenant)
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
  isArchived: Boolean
}
```

## 🚨 Error Handling

The application includes comprehensive error handling:
- **API errors**: Network and server error handling
- **Form validation**: Client-side validation with user feedback
- **Authentication errors**: Token expiration and invalid credentials
- **Subscription limits**: Clear messaging for plan limitations
- **User feedback**: Toast notifications and error messages

## 🔮 Future Enhancements

- Email invitations for user management
- Advanced note search and filtering
- Note sharing between users
- File attachments
- Audit logging
- Advanced analytics
- Webhook support
- API rate limiting per tenant
- Dark mode support
- Real-time collaboration

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions, please refer to the documentation or create an issue in the repository.
