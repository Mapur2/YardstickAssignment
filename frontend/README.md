# Notes SaaS Frontend

A modern, responsive React frontend for the multi-tenant SaaS Notes Application built with Vite, Tailwind CSS, and Axios.

## Features

- ✅ **Modern UI/UX**: Clean, professional design with Tailwind CSS
- ✅ **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ✅ **Authentication**: Secure login with JWT token management
- ✅ **Notes Management**: Create, read, update, and delete notes
- ✅ **Multi-tenant Support**: Tenant isolation and information display
- ✅ **Subscription Management**: Free/Pro plan handling with upgrade functionality
- ✅ **Real-time Updates**: Automatic data refresh and state management
- ✅ **Error Handling**: Comprehensive error handling and user feedback

## Tech Stack

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **Context API** - State management

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with sidebar
│   ├── ProtectedRoute.jsx # Route protection
│   ├── NotesList.jsx   # Notes listing component
│   ├── NoteForm.jsx    # Note creation/editing form
│   └── TenantInfo.jsx  # Tenant information display
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   └── Dashboard.jsx   # Main dashboard
├── services/           # API services
│   └── api.js          # Axios configuration and API calls
├── App.jsx             # Main app component with routing
└── main.jsx            # App entry point
```

## Components Overview

### Layout
- **Responsive sidebar** with user info and navigation
- **Mobile-friendly** with collapsible menu
- **User context** showing role and tenant information

### Authentication
- **Secure login** with form validation
- **Test account buttons** for easy testing
- **Token management** with automatic refresh
- **Protected routes** with redirect handling

### Notes Management
- **CRUD operations** for notes
- **Rich text editing** with character limits
- **Tag system** for organization
- **Real-time updates** and error handling
- **Responsive design** for all screen sizes

### Tenant Information
- **Plan status** display (Free/Pro)
- **Usage statistics** with progress bars
- **Upgrade functionality** for admins
- **Feature comparison** between plans

## API Integration

The frontend communicates with the backend through a centralized API service:

```javascript
// Example API usage
import { notesAPI, authAPI } from './services/api';

// Login
const result = await authAPI.login(email, password);

// Get notes
const notes = await notesAPI.getNotes();

// Create note
const newNote = await notesAPI.createNote({ title, content, tags });
```

## Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md-lg)
- **Desktop**: > 1024px (lg+)

Key responsive features:
- Collapsible sidebar on mobile
- Responsive grid layouts
- Touch-friendly buttons and inputs
- Optimized typography for all screen sizes

## Styling

### Tailwind CSS Configuration
- **Custom color palette** with primary and secondary colors
- **Custom animations** for smooth interactions
- **Component classes** for consistent styling
- **Responsive utilities** for all breakpoints

### Design System
- **Consistent spacing** using Tailwind's spacing scale
- **Typography hierarchy** with proper font weights
- **Color scheme** with semantic color usage
- **Interactive states** with hover and focus effects

## State Management

The application uses React Context for state management:

- **AuthContext**: User authentication and profile data
- **Local state**: Component-specific state with useState
- **API state**: Loading states and error handling

## Error Handling

Comprehensive error handling throughout the application:

- **API errors**: Network and server error handling
- **Form validation**: Client-side validation with user feedback
- **Authentication errors**: Token expiration and invalid credentials
- **User feedback**: Toast notifications and error messages

## Performance Optimizations

- **Code splitting** with React.lazy (ready for implementation)
- **Optimized images** and assets
- **Efficient re-renders** with proper dependency arrays
- **Debounced inputs** for better UX

## Deployment

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Environment Variables**
   Set in Vercel dashboard:
   - `VITE_API_URL` - Your backend API URL

### Build Output

The build creates optimized static files in the `dist/` directory:
- Minified JavaScript and CSS
- Optimized images and assets
- Service worker ready (can be added)

## Testing

The application is ready for testing with the predefined accounts:

| Email | Password | Role | Tenant |
|-------|----------|------|--------|
| admin@acme.test | password | Admin | Acme |
| user@acme.test | password | Member | Acme |
| admin@globex.test | password | Admin | Globex |
| user@globex.test | password | Member | Globex |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- Dark mode support
- Advanced note search and filtering
- Note sharing between users
- File attachments
- Real-time collaboration
- PWA capabilities
- Advanced analytics dashboard