# Fix-It Hub 🔧

> **A full-stack campus repair marketplace connecting students who need repairs with skilled fixers, promoting sustainability and the circular economy.**

**Live Demo:** https://fixit-bmsce.netlify.app  
**Backend API:** https://fixit-01yy.onrender.com

---

## 📚 Table of Contents
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Features](#features)
- [How It All Works Together](#how-it-all-works-together)
- [Deployment Architecture](#deployment-architecture)
- [Local Development Setup](#local-development-setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Key Concepts to Research](#key-concepts-to-research)

---

## 🎯 Project Overview

**Fix-It Hub** is a campus-based platform that solves a real problem: students need items repaired but don't know who can help. Instead of throwing things away, students can:

1. **Post repair requests** (broken laptop, torn jeans, wobbly chair)
2. **Find skilled fixers** (other students with repair skills)
3. **Communicate in-app** (private messaging system)
4. **Track repair progress** (status updates and completion)

**Why it matters:**
- ♻️ Reduces waste and promotes sustainability
- 💰 Saves money (student-to-student pricing)
- 🤝 Builds community connections
- 🎓 Skill-sharing and learning opportunities

---

## 🛠️ Technology Stack

### **Frontend (What Users See)**
| Technology | Version | Purpose | Learn More |
|------------|---------|---------|------------|
| **React** | 18.2.0 | UI library for building interactive interfaces | [React Docs](https://react.dev) |
| **Vite** | 5.0.8 | Fast build tool and dev server (replaces Create React App) | [Vite Guide](https://vitejs.dev) |
| **React Router** | 6.21.1 | Client-side routing (navigate without page reloads) | [Router Tutorial](https://reactrouter.com) |
| **Axios** | 1.6.5 | HTTP client for API calls | [Axios Docs](https://axios-http.com) |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework for styling | [Tailwind CSS](https://tailwindcss.com) |

### **Backend (Server Logic)**
| Technology | Version | Purpose | Learn More |
|------------|---------|---------|------------|
| **Node.js** | 22.16.0 | JavaScript runtime for server-side code | [Node.js Docs](https://nodejs.org) |
| **Express** | 4.21.2 | Web framework for building REST APIs | [Express Guide](https://expressjs.com) |
| **MongoDB** | - | NoSQL database for storing data | [MongoDB Tutorial](https://www.mongodb.com/docs) |
| **Mongoose** | 8.9.3 | ODM (Object Data Modeling) for MongoDB | [Mongoose Guide](https://mongoosejs.com) |
| **JWT** | 9.0.2 | JSON Web Tokens for authentication | [JWT.io](https://jwt.io) |
| **bcryptjs** | 2.4.3 | Password hashing for security | [bcrypt Explained](https://en.wikipedia.org/wiki/Bcrypt) |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing (lets frontend talk to backend) | [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) |

### **Deployment & Hosting**
| Service | Purpose | Free Tier | Learn More |
|---------|---------|-----------|------------|
| **Netlify** | Hosts React frontend | 100GB bandwidth/month | [Netlify Docs](https://docs.netlify.com) |
| **Render** | Hosts Node.js backend | 750 hours/month | [Render Docs](https://render.com/docs) |
| **MongoDB Atlas** | Cloud database | 512MB storage | [Atlas Guide](https://www.mongodb.com/cloud/atlas) |
| **GitHub** | Version control & auto-deployment | Unlimited public repos | [Git Handbook](https://guides.github.com) |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                    (https://fixit-bmsce.netlify.app)            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests (AJAX/Axios)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      FRONTEND (React + Vite)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Components:                                              │  │
│  │  - Navbar, Footer, SearchBar                             │  │
│  │  - ListingCard, SkillProfileCard                         │  │
│  │                                                           │  │
│  │  Pages:                                                   │  │
│  │  - HomePage, BrowseListingsPage, LoginPage               │  │
│  │  - ProfilePage, MessagesPage, ConversationPage           │  │
│  │                                                           │  │
│  │  Services (API Calls):                                    │  │
│  │  - api.js (axios setup + interceptors)                   │  │
│  │  - userService.js (login, register, profile)             │  │
│  │  - listingService.js (CRUD operations)                   │  │
│  │  - messageService.js (chat functionality)                │  │
│  │                                                           │  │
│  │  Context (Global State):                                  │  │
│  │  - AuthContext.jsx (user auth state)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ API Calls (REST)
                             │ Example: POST /api/users/login
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                   BACKEND (Node.js + Express)                    │
│                  (https://fixit-01yy.onrender.com)              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  server.js (Entry Point)                                 │  │
│  │  - CORS configuration                                     │  │
│  │  - Body parsing (JSON, up to 10MB for images)            │  │
│  │  - Route mounting                                         │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼─────────────────────────────────────┐  │
│  │  Routes (API Endpoints):                                  │  │
│  │  - /api/users (login, register, profile, update)         │  │
│  │  - /api/listings (create, read, update, delete)          │  │
│  │  - /api/messages (conversations, send, read)             │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼─────────────────────────────────────┐  │
│  │  Middleware:                                              │  │
│  │  - authMiddleware.js (JWT verification, protect routes)  │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼─────────────────────────────────────┐  │
│  │  Controllers (Business Logic):                            │  │
│  │  - userController.js (auth, profile updates)             │  │
│  │  - listingController.js (CRUD, filtering)                │  │
│  │  - messageController.js (chat logic)                     │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼─────────────────────────────────────┐  │
│  │  Models (Database Schemas):                               │  │
│  │  - User.js (users, auth, skills, badges)                 │  │
│  │  - Listing.js (repair requests, status, category)        │  │
│  │  - Message.js (conversations, messages)                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Mongoose Queries
                             │ (CREATE, READ, UPDATE, DELETE)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                   DATABASE (MongoDB Atlas)                       │
│                        (Cloud Hosted)                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Collections:                                             │  │
│  │  - users (authentication, profiles, skills)              │  │
│  │  - listings (repair requests, images, status)            │  │
│  │  - messages (conversations, chat history)                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Features

### **1. User Authentication**
- ✅ Register with email & password
- ✅ Login with JWT token (stored in localStorage)
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ Protected routes (can't access profile without login)
- ✅ Auto-logout on token expiration

### **2. Listing Management**
- ✅ Create repair requests with photos (base64 encoding)
- ✅ Browse all listings with search & filters
- ✅ Category filtering (Tech, Clothing, Furniture, Other)
- ✅ Status tracking (Available, In Progress, Completed)
- ✅ Edit and delete your own listings
- ✅ Clickable cards for detailed view

### **3. Messaging System**
- ✅ In-platform private messaging (no email needed)
- ✅ Conversation threads per listing
- ✅ Real-time message display with timestamps
- ✅ Unread message counts
- ✅ Message read/unread status
- ✅ Auto-scroll to latest message

### **4. Profile Management**
- ✅ Upload profile pictures (base64, max 5MB)
- ✅ Add/edit skills (e.g., "Soldering", "Sewing")
- ✅ Display badges and stats
- ✅ View your listings (Available vs In Progress)
- ✅ Clickable usernames to view profiles

### **5. Search & Discovery**
- ✅ Real-time search across listings
- ✅ Filter by category
- ✅ Find skilled fixers page
- ✅ Stats dashboard (total repairs, items saved, CO2 reduced)

---

## 🔄 How It All Works Together

### **Example: User Logs In**

1. **User enters email/password** → React form captures input
2. **Frontend calls API** → `userService.login()` sends POST request
   ```javascript
   POST https://fixit-01yy.onrender.com/api/users/login
   Body: { email: "student@college.edu", password: "password123" }
   ```
3. **Backend receives request** → Express routes to `userController.loginUser()`
4. **Controller validates** → Checks MongoDB for user, compares hashed password
5. **JWT token generated** → Backend creates signed token with user ID
6. **Response sent** → Backend returns `{ token, user }` JSON
7. **Frontend stores token** → Saved in `localStorage` and `AuthContext`
8. **Future requests authenticated** → Axios interceptor adds `Authorization: Bearer <token>` header

### **Example: User Uploads Profile Picture**

1. **User selects image** → `<input type="file">` triggers
2. **FileReader converts to base64** → Browser reads file as data URL
   ```javascript
   data:image/jpeg;base64,/9j/4AAQSkZJRg...
   ```
3. **Size validation** → Check if < 5MB (frontend), < 10MB (backend)
4. **API call with base64** → `userService.updateUserProfile({ photoUrl: base64String })`
5. **Backend validates** → Checks if string starts with `data:image/`
6. **Mongoose saves to MongoDB** → Stored as string in user document
7. **Frontend updates** → AuthContext updates, component re-renders with new photo

### **Example: Two Users Chat**

1. **User A clicks "Message" on listing** → Navigates to conversation page
2. **Frontend fetches conversation** → `GET /api/messages/conversation/:listingId/:userId`
3. **Backend finds or creates** → Mongoose searches for existing conversation
4. **User A types message** → Form captures text input
5. **Frontend sends message** → `POST /api/messages/:conversationId`
6. **Backend saves to DB** → Adds message to messages array in conversation document
7. **Frontend refetches** → Gets updated conversation with new message
8. **User B opens inbox** → Sees unread count, clicks conversation
9. **Mark as read triggered** → `PUT /api/messages/:conversationId/read`

---

## 🚀 Deployment Architecture

### **The Three-Platform Setup**

```
GitHub (Code Storage)
    ↓
    ├─→ Netlify (Detects push to main branch)
    │   ├─ Runs: npm install
    │   ├─ Runs: npm run build (Vite builds React to /dist)
    │   ├─ Deploys: Serves static files from /dist
    │   └─ URL: https://fixit-bmsce.netlify.app
    │
    └─→ Render (Detects push to main branch)
        ├─ Runs: npm install (in /server directory)
        ├─ Runs: node server.js
        ├─ Environment: Loads MONGODB_URI, JWT_SECRET, etc.
        └─ URL: https://fixit-01yy.onrender.com

MongoDB Atlas (Always Online)
    ├─ Connection: Accepts connections from Render's IP (0.0.0.0/0)
    ├─ Database: fixithub
    └─ Collections: users, listings, messages
```

### **Environment Variables (Hidden Secrets)**

**Netlify (Frontend):**
```bash
VITE_API_URL=https://fixit-01yy.onrender.com/api
```
- Tells React where the backend API is located
- `VITE_` prefix required for Vite to expose to browser

**Render (Backend):**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fixithub
JWT_SECRET=super-secret-random-string-for-signing-tokens
NODE_ENV=production
PORT=5000
CLIENT_URL=https://fixit-bmsce.netlify.app
```
- `MONGODB_URI`: Database connection string
- `JWT_SECRET`: Used to sign/verify authentication tokens
- `CLIENT_URL`: Allowed origin for CORS (security)

### **How Deployment Works**

1. **You push code** → `git push origin main`
2. **GitHub receives** → Code stored in repository
3. **Netlify webhook triggered** → Detects new commit
   - Clones repo
   - Installs dependencies (`npm install`)
   - Builds React app (`npm run build` → creates `/dist` folder)
   - Deploys static files to CDN
   - **Result:** https://fixit-bmsce.netlify.app updated
4. **Render webhook triggered** → Detects new commit
   - Clones repo
   - Enters `/server` directory
   - Installs dependencies (`npm install`)
   - Starts server (`node server.js`)
   - **Result:** https://fixit-01yy.onrender.com restarted
5. **Both live in ~2 minutes!** 🎉

### **Why This Architecture?**

| Aspect | Explanation |
|--------|-------------|
| **Separation of Concerns** | Frontend and backend deployed independently |
| **Static Frontend** | React builds to HTML/CSS/JS files (fast CDN delivery) |
| **Dynamic Backend** | Node.js server handles business logic and database |
| **Scalability** | Each part can scale independently |
| **Security** | API keys and secrets hidden in environment variables |
| **Cost** | All three platforms free for small projects! |

---

## 💻 Local Development Setup

### **Prerequisites**
- Node.js 22.16.0+ ([Download](https://nodejs.org))
- npm (comes with Node.js)
- MongoDB (local) or MongoDB Atlas account
- Git

### **Step-by-Step Setup**

```bash
# 1. Clone the repository
git clone https://github.com/GlyphicGuy/fixIt.git
cd fixIt

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd server
npm install
cd ..

# 4. Create environment file
cat > .env << EOF
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/fixithub
JWT_SECRET=your-dev-secret-key
CLIENT_URL=http://localhost:5173
EOF

# 5. Start MongoDB (if using local)
# macOS/Linux: brew services start mongodb-community
# Windows: net start MongoDB

# 6. Start backend (in one terminal)
cd server
npm run dev  # Uses nodemon for auto-restart

# 7. Start frontend (in another terminal)
npm run dev  # Runs on http://localhost:5173
```

### **Project Structure**
```
fixIt/
├── public/              # Static assets
├── src/                 # Frontend React code
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route pages
│   ├── services/        # API call functions
│   ├── context/         # Global state (Auth)
│   ├── assets/          # Images, icons
│   └── main.jsx         # React entry point
├── server/              # Backend Node.js code
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   ├── config/          # Database connection
│   └── server.js        # Express entry point
├── .env                 # Environment variables (gitignored)
├── package.json         # Frontend dependencies
├── vite.config.js       # Vite configuration
└── netlify.toml         # Netlify deployment config
```

---

## 📡 API Documentation

### **Base URL**
- **Production:** `https://fixit-01yy.onrender.com/api`
- **Development:** `http://localhost:5000/api`

### **Authentication Endpoints**

#### `POST /api/users/register`
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@college.edu",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "abc123",
    "name": "John Doe",
    "email": "john@college.edu"
  }
}
```

#### `POST /api/users/login`
Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@college.edu",
  "password": "securepassword123"
}
```

**Response:** Same as register

### **Listing Endpoints**

#### `GET /api/listings`
Get all repair listings (with optional filters).

**Query Parameters:**
- `category` (optional): Tech, Clothing, Furniture, Other
- `search` (optional): Search in title/description

**Response:**
```json
[
  {
    "_id": "listing123",
    "title": "Broken Laptop Screen",
    "description": "MacBook Air 2020, cracked display",
    "category": "Tech",
    "status": "Available",
    "photoUrl": "data:image/jpeg;base64,...",
    "postedBy": {
      "_id": "user123",
      "name": "Jane Doe"
    },
    "createdAt": "2025-12-29T10:30:00.000Z"
  }
]
```

#### `POST /api/listings` 🔒
Create a new listing (requires authentication).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "title": "Torn Jeans Need Patching",
  "description": "Ripped at the knee, blue denim",
  "category": "Clothing",
  "photoUrl": "data:image/jpeg;base64,..."
}
```

### **Message Endpoints**

#### `GET /api/messages/conversations` 🔒
Get all conversations for logged-in user.

#### `GET /api/messages/conversation/:listingId/:otherUserId` 🔒
Get or create a conversation between two users about a listing.

#### `POST /api/messages/:conversationId` 🔒
Send a message in a conversation.

**Request Body:**
```json
{
  "content": "Hi, can you fix this by Friday?"
}
```

🔒 = Requires `Authorization: Bearer <token>` header

---

## 🗄️ Database Schema

### **Users Collection**
```javascript
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@college.edu",
  password: "$2a$12$hashed...",  // bcrypt hashed
  photoUrl: "data:image/jpeg;base64,...",  // optional
  skills: ["Soldering", "Screen Replacement"],  // optional array
  createdAt: ISODate("2025-12-01T..."),
  updatedAt: ISODate("2025-12-29T...")
}
```

### **Listings Collection**
```javascript
{
  _id: ObjectId("..."),
  title: "Broken Laptop Screen",
  description: "MacBook Air 2020, cracked display",
  category: "Tech",  // enum: Tech, Clothing, Furniture, Other
  status: "Available",  // enum: Available, In Progress, Completed
  photoUrl: "data:image/jpeg;base64,...",
  postedBy: ObjectId("user123"),  // reference to Users
  createdAt: ISODate("2025-12-29T..."),
  updatedAt: ISODate("2025-12-29T...")
}
```

### **Messages Collection**
```javascript
{
  _id: ObjectId("..."),
  listing: ObjectId("listing123"),  // reference to Listings
  participants: [ObjectId("user1"), ObjectId("user2")],
  messages: [
    {
      sender: ObjectId("user1"),
      content: "Can you fix this?",
      read: false,
      timestamp: ISODate("2025-12-29T10:00:00Z")
    },
    {
      sender: ObjectId("user2"),
      content: "Yes, I can help!",
      read: true,
      timestamp: ISODate("2025-12-29T10:05:00Z")
    }
  ],
  lastMessageAt: ISODate("2025-12-29T10:05:00Z"),
  createdAt: ISODate("2025-12-29T09:50:00Z")
}
```

---

## 🎓 Key Concepts to Research

Here's what you should understand to fully grasp this project:

### **Frontend Concepts**

| Concept | What to Learn | Why It Matters |
|---------|---------------|----------------|
| **React Components** | Functional components, props, state | Building blocks of the UI |
| **React Hooks** | useState, useEffect, useContext | Manage state and side effects |
| **React Router** | Routes, navigation, URL parameters | Multi-page feel without page reloads |
| **Context API** | Global state management | Share auth state across components |
| **Axios Interceptors** | Request/response middleware | Auto-add auth tokens to requests |
| **Base64 Encoding** | Binary data → text string | Store images in database as text |
| **Tailwind CSS** | Utility classes, responsive design | Fast styling without writing CSS |
| **Vite** | Build tool, HMR, environment variables | Faster than Webpack, modern tooling |

### **Backend Concepts**

| Concept | What to Learn | Why It Matters |
|---------|---------------|----------------|
| **REST API** | HTTP methods, status codes, endpoints | How frontend and backend communicate |
| **Express Middleware** | Request pipeline, next() | Process requests before reaching routes |
| **JWT (JSON Web Tokens)** | Token structure, signing, verification | Stateless authentication |
| **bcrypt** | Hashing, salts, rainbow tables | Secure password storage |
| **Mongoose** | Schemas, models, queries | Object-oriented MongoDB interaction |
| **CORS** | Same-origin policy, preflight requests | Allow cross-domain API calls |
| **Environment Variables** | .env files, process.env | Hide secrets, configure environments |
| **Async/Await** | Promises, error handling | Handle asynchronous operations |

### **Database Concepts**

| Concept | What to Learn | Why It Matters |
|---------|---------------|----------------|
| **NoSQL vs SQL** | Document vs relational databases | Why MongoDB for this project |
| **MongoDB Documents** | JSON-like structure, flexibility | How data is stored |
| **Mongoose Schemas** | Schema definition, validation | Enforce data structure in NoSQL |
| **References** | ObjectId, populate() | Link documents together |
| **Indexing** | Query optimization | Fast lookups on participants |

### **Deployment Concepts**

| Concept | What to Learn | Why It Matters |
|---------|---------------|----------------|
| **Git & GitHub** | Version control, branches, commits | Track changes, collaborate |
| **CI/CD** | Continuous integration/deployment | Auto-deploy on git push |
| **Static vs Dynamic Hosting** | File serving vs server execution | Why Netlify ≠ Render |
| **Environment Variables** | Config management, secrets | Different settings per environment |
| **CDN** | Content delivery networks | Fast global asset delivery |
| **Webhooks** | Event-driven triggers | GitHub → Netlify/Render communication |

### **Security Concepts**

| Concept | What to Learn | Why It Matters |
|---------|---------------|----------------|
| **Password Hashing** | One-way encryption, salts | Never store plain passwords |
| **JWT Security** | Token expiration, secret keys | Prevent token forgery |
| **CORS Policy** | Origin whitelist, credentials | Prevent malicious sites accessing API |
| **.gitignore** | Exclude sensitive files | Don't commit secrets to GitHub |
| **HTTPS** | SSL/TLS, encryption | Secure data in transit |

---

## 📖 Recommended Learning Path

### **Phase 1: Frontend Basics**
1. ✅ HTML/CSS/JavaScript fundamentals
2. ✅ React basics (components, props, state)
3. ✅ React Hooks (useState, useEffect)
4. ✅ React Router (navigation)
5. ✅ Axios (API calls)

### **Phase 2: Backend Basics**
1. ✅ Node.js fundamentals
2. ✅ Express.js (routes, middleware)
3. ✅ MongoDB basics (CRUD operations)
4. ✅ Mongoose (schemas, models)
5. ✅ REST API design

### **Phase 3: Authentication**
1. ✅ JWT concept and implementation
2. ✅ bcrypt password hashing
3. ✅ Protected routes (middleware)
4. ✅ Context API for global auth state

### **Phase 4: Advanced Features**
1. ✅ File uploads (base64 encoding)
2. ✅ Real-time features (messaging)
3. ✅ Search and filtering
4. ✅ CORS configuration

### **Phase 5: Deployment**
1. ✅ Git and GitHub
2. ✅ Environment variables
3. ✅ Netlify deployment (static sites)
4. ✅ Render deployment (Node.js apps)
5. ✅ MongoDB Atlas (cloud database)

---

## 🚀 Future Enhancements

Ideas to expand the project:

- [ ] **Real-time messaging** (Socket.io for instant updates)
- [ ] **Image compression** (Reduce base64 size before upload)
- [ ] **Email notifications** (Nodemailer for new messages)
- [ ] **Rating system** (5-star reviews for fixers)
- [ ] **Payment integration** (Stripe for transactions)
- [ ] **Admin dashboard** (Moderate listings and users)
- [ ] **Mobile app** (React Native version)
- [ ] **PWA** (Progressive Web App for offline support)
- [ ] **Search autocomplete** (ElasticSearch integration)
- [ ] **Image storage** (AWS S3 instead of base64)

---

## 🤝 Contributing

This is a learning project! Feel free to:
- Report bugs
- Suggest features
- Fork and experiment
- Ask questions

---

## 📄 License

This project is open source and available for educational purposes.

---

## 🙏 Acknowledgments

Built as a campus sustainability project to promote the circular economy and reduce waste through student collaboration.

---

## 📞 Support

**Live Site:** https://fixit-bmsce.netlify.app  
**API Health Check:** https://fixit-01yy.onrender.com/api/health

For questions about the codebase, refer to the guides:
- `DEPLOYMENT_GUIDE.md` - Detailed deployment instructions
- `QUICK_DEPLOY.md` - 30-minute deployment summary
- `MESSAGING_SYSTEM.md` - How the chat system works
- `PROFILE_PICTURE_UPLOAD.md` - Image upload implementation

---

**Built with ❤️ by students, for students 🎓**

## 🌟 Features

### Pages
- **Home Page** - Browse repair listings with search, category filtering, stats dashboard, and featured fixers
- **Listing Detail Page** - View complete listing information, contact fixers, and see interested helpers
- **New Listing Page** - Post repair requests with photos, descriptions, and categories
- **Profile Page** - Manage skills, view badges, and track your repair listings

### Components
- **Navbar** - Responsive navigation with routing
- **Footer** - Site-wide footer with links and contact info
- **ListingCard** - Display repair requests with images and status
- **SkillProfileCard** - Show fixer profiles with ratings and badges
- **SearchBar** - Real-time search functionality
- **StatsSection** - Platform impact statistics
- **HowItWorks** - Step-by-step guide for users

## 🚀 Getting Started

### Prerequisites
- Node.js 22.12 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd fixIt
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Database Viewer

To view and inspect the MongoDB database in your browser:

1. Make sure the backend server is running (`npm run dev` in the `server` directory)

2. Open `server/db-viewer.html` in your browser or visit it directly:
```bash
open server/db-viewer.html
# or on Linux: xdg-open server/db-viewer.html
# or just drag the file into your browser
```

The database viewer provides:
- **Live Statistics** - Total users, listings, open/fixed counts
- **Users Collection** - View all users with their skills, ratings, and activity
- **Listings Collection** - Browse all listings with status, interested fixers, and details
- **Table & JSON Views** - Toggle between formatted table and raw JSON data
- **Real-time Refresh** - Update data with the refresh button

**API Endpoints:**
- `GET /api/db/stats` - Database statistics
- `GET /api/db/users` - All users (passwords excluded)
- `GET /api/db/listings` - All listings with populated references

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with Vite
- **Styling**: Tailwind CSS 3
- **Routing**: React Router DOM
- **Backend** (Planned): Node.js, Express, MongoDB

## 📁 Project Structure

```
fixIt/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ListingCard.jsx
│   │   ├── SkillProfileCard.jsx
│   │   ├── SearchBar.jsx
│   │   ├── StatsSection.jsx
│   │   └── HowItWorks.jsx
│   ├── pages/           # Main application pages
│   │   ├── HomePage.jsx
│   │   ├── ListingDetailPage.jsx
│   │   ├── NewListingPage.jsx
│   │   └── ProfilePage.jsx
│   ├── data/            # Mock data (will be replaced with API calls)
│   │   └── mockData.js
│   ├── App.jsx          # Main app component with routes
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## 📊 Key Data Models

### User
- Name, email, photo
- Array of skills (e.g., "Sewing", "Soldering", "Bike Repair")
- Badges earned
- Rating and fixes completed

### Listing
- Title, description, category
- Photo URL
- Status ('open', 'fixed')
- Posted by (user reference)
- Posted date

## 🎨 Categories

- **Tech** - Electronics, computers, phones
- **Clothing** - Sewing, mending, alterations
- **Furniture** - Woodworking, assembly, repairs
- **Other** - Bikes, sports equipment, misc items

## 🔜 Upcoming Features

### Backend Integration
- [ ] User authentication (oAuth Google)
- [ ] Email notifications

### Frontend Enhancements
- [ ] Booking/scheduling system
- [ ] Image before/after
- [ ] Mobile app version

## 🤝 Contributing

This is a college project. Contributions and suggestions are welcome!

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌱 Sustainability Mission

Fix-It Hub promotes the circular economy by:
- Reducing waste through repair instead of replacement
- Building a skill-sharing community
- Extending the life of products
- Educating students about sustainability
- Creating a culture of resourcefulness

## 📧 Contact

For questions or feedback, contact us at support@fixithub.edu

---
Copyright 2026