# 🔧 Backend Deep Dive - Fix-It Hub Server

> **A complete walkthrough of your `server/` directory with code snippets and explanations**

---

## 📁 **Directory Structure**

```
server/
├── server.js              # Main entry point (Express app setup)
├── package.json           # Dependencies and scripts
├── config/
│   └── db.js             # MongoDB connection logic
├── models/
│   ├── User.js           # User schema (accounts, profiles)
│   ├── Listing.js        # Listing schema (repair requests)
│   └── Message.js        # Message schema (conversations)
├── controllers/
│   ├── userController.js      # User business logic
│   ├── listingController.js   # Listing business logic
│   └── messageController.js   # Message business logic
├── middleware/
│   └── authMiddleware.js # JWT authentication protection
└── routes/
    ├── userRoutes.js     # User API endpoints
    ├── listingRoutes.js  # Listing API endpoints
    └── messageRoutes.js  # Message API endpoints
```

---

## 🚀 **1. Entry Point: `server.js`**

This is where everything starts when you run `node server.js`.

### **YOUR CODE:**

```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
connectDB();

const app = express();
```

### **What's Happening:**

1. **`require('express')`** - Imports the Express framework (makes building APIs easy)
2. **`require('cors')`** - Imports CORS middleware (allows frontend to call backend from different domain)
3. **`require('dotenv')`** - Loads environment variables from `.env` file
4. **`path.join(__dirname, '../.env')`** - Looks for `.env` file in parent directory
5. **`connectDB()`** - Calls the function that connects to MongoDB (we'll see this next)
6. **`express()`** - Creates an Express application instance

---

### **Middleware Setup:**

```javascript
// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
// Increase payload size limit for image uploads (10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

### **What's Happening:**

| Line | What It Does | Why It Matters |
|------|--------------|----------------|
| `app.use(cors({...}))` | Allows requests from your React app | Without this, browser blocks API calls (security) |
| `origin: process.env.CLIENT_URL` | Only allows requests from this URL | Production: `https://fixit-bmsce.netlify.app` |
| `credentials: true` | Allows cookies/auth headers | Needed for JWT tokens |
| `express.json({ limit: '10mb' })` | Parses JSON request bodies | Converts `{"name":"John"}` into JavaScript object |
| `limit: '10mb'` | Accepts up to 10MB of data | Needed for base64 images (default is 100KB) |
| `express.urlencoded()` | Parses form data | Handles `application/x-www-form-urlencoded` |

**Think of middleware as checkpoints** - every request passes through these before reaching your routes.

---

### **Route Mounting:**

```javascript
// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
```

### **What's Happening:**

This tells Express:
- **Any request to `/api/users/...`** → Go to `userRoutes.js`
- **Any request to `/api/listings/...`** → Go to `listingRoutes.js`
- **Any request to `/api/messages/...`** → Go to `messageRoutes.js`

**Example:**
```
Frontend calls: POST https://fixit-01yy.onrender.com/api/users/login
                     ↓
Express sees: "/api/users" → routes to userRoutes.js
              "/login" → handled by loginUser controller
```

---

### **Server Start:**

```javascript
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});
```

### **What's Happening:**

- **`process.env.PORT`** - Gets port from environment variable (Render sets this to a dynamic port)
- **`|| 5000`** - If no environment variable, use port 5000 (local development)
- **`app.listen()`** - Starts the HTTP server
- **Callback function** - Runs after server starts (logs confirmation)

---

## 🗄️ **2. Database Connection: `config/db.js`**

### **YOUR CODE:**

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### **What's Happening:**

1. **`mongoose.connect(process.env.MONGODB_URI)`**
   - Connects to MongoDB using connection string from `.env`
   - Example: `mongodb+srv://user:pass@cluster.mongodb.net/fixithub`
   - Returns a Promise (that's why we `await` it)

2. **`async/await`**
   - Makes asynchronous code look synchronous
   - `async` declares the function can use `await`
   - `await` pauses execution until the Promise resolves

3. **`try/catch`**
   - `try` block: Attempt the connection
   - `catch` block: Handle errors if connection fails

4. **`process.exit(1)`**
   - Exits the Node.js process with error code 1
   - Prevents server from running without database

5. **`module.exports = connectDB`**
   - Makes this function available to other files
   - That's how `server.js` can call `connectDB()`

### **MongoDB Connection Flow:**

```
1. Server starts
   ↓
2. dotenv loads MONGODB_URI from .env
   ↓
3. connectDB() function called
   ↓
4. Mongoose connects to MongoDB Atlas
   ↓
5. Connection successful ✅ or fails ❌
   ↓
6. If success: Console logs host
   If fail: Exit process
```

---

## 📋 **3. Models (Database Schemas)**

Models define **what data looks like** and **validation rules**.

---

### **3.1 User Model (`models/User.js`)**

### **YOUR CODE:**

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  photoUrl: {
    type: String,
    default: function() {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.email}`;
    }
  },
  skills: [{
    type: String,
    trim: true
  }],
  badges: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  fixesCompleted: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});
```

### **Field-by-Field Breakdown:**

| Field | Type | Explanation |
|-------|------|-------------|
| `name` | String | User's full name. `trim: true` removes whitespace. `required` means it MUST be provided. |
| `email` | String | Email address. `unique: true` prevents duplicates in DB. `lowercase: true` converts to lowercase before saving. |
| `password` | String | Hashed password. `minlength: 6` enforces minimum length. `select: false` means password won't be returned in queries (security). |
| `photoUrl` | String | Profile picture URL. `default: function()` generates unique avatar if none provided. Uses Dicebear API. |
| `skills` | Array of Strings | User's repair skills (e.g., ["Soldering", "Sewing"]). `[]` means it's an array. |
| `badges` | Array of Strings | Achievement badges. Same as skills but for gamification. |
| `rating` | Number | 0-5 star rating. `min: 0, max: 5` enforces range. |
| `fixesCompleted` | Number | Counter for completed repairs. `default: 0` starts at zero. |

### **Timestamps Option:**

```javascript
{
  timestamps: true
}
```

**What it does:** Automatically adds:
- `createdAt` - When user registered
- `updatedAt` - Last time profile was updated

**Example document in MongoDB:**
```json
{
  "_id": "abc123...",
  "name": "John Doe",
  "email": "john@college.edu",
  "password": "$2a$12$hashed...",
  "photoUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=john@college.edu",
  "skills": ["Laptop Repair", "Soldering"],
  "badges": [],
  "rating": 4.5,
  "fixesCompleted": 12,
  "createdAt": "2025-12-01T10:30:00.000Z",
  "updatedAt": "2025-12-29T15:20:00.000Z"
}
```

---

### **Password Hashing (Pre-save Hook):**

```javascript
// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

### **What's Happening:**

1. **`userSchema.pre('save', ...)`** - Runs BEFORE saving to database
2. **`if (!this.isModified('password'))`** - Only hash if password changed
   - Without this, password would be re-hashed on every profile update!
3. **`bcrypt.genSalt(10)`** - Generates a random "salt" (10 rounds)
   - Salt prevents rainbow table attacks
4. **`bcrypt.hash(this.password, salt)`** - Hashes password with salt
   - `"password123"` becomes `"$2a$10$hashed...random...string"`
5. **`next()`** - Continues with save operation

**Why hash passwords?**
- Never store plain passwords in database
- If database is compromised, passwords are safe
- Even identical passwords hash differently (thanks to salt)

---

### **Password Comparison Method:**

```javascript
// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

### **What's Happening:**

1. **`userSchema.methods.matchPassword`** - Adds a method to User instances
2. **`bcrypt.compare()`** - Compares plain password with hashed password
3. **Returns `true` or `false`**

**Usage in login:**
```javascript
const user = await User.findOne({ email });
if (await user.matchPassword('password123')) {
  // Login success!
}
```

---

### **3.2 Listing Model (`models/Listing.js`)**

### **YOUR CODE:**

```javascript
const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: 1000
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Tech', 'Clothing', 'Furniture', 'Other']
  },
  photoUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400'
  },
  status: {
    type: String,
    enum: ['open', 'fixed'],
    default: 'open'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});
```

### **Key Concepts:**

**1. `enum` (Enumeration):**
```javascript
category: {
  enum: ['Tech', 'Clothing', 'Furniture', 'Other']
}
```
- **Restricts values** to only these options
- If you try to save `category: 'Cars'`, MongoDB rejects it
- Ensures data consistency

**2. References (`ref`):**
```javascript
postedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}
```
- **Links to another collection** (foreign key)
- `ObjectId` is MongoDB's unique identifier type
- `ref: 'User'` means this ID points to a User document
- Allows you to "populate" user data later

**Example:**
```javascript
// Without populate
const listing = await Listing.findById('xyz');
console.log(listing.postedBy); // "abc123" (just an ID)

// With populate
const listing = await Listing.findById('xyz').populate('postedBy');
console.log(listing.postedBy); // { _id: "abc123", name: "John", email: "john@college.edu" }
```

---

### **3.3 Message Model (`models/Message.js`)**

### **YOUR CODE:**

```javascript
const messageSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
messageSchema.index({ listing: 1, participants: 1 });
messageSchema.index({ participants: 1, lastMessageAt: -1 });
```

### **Key Concepts:**

**1. Nested Documents (Subdocuments):**
```javascript
messages: [{
  sender: ObjectId,
  content: String,
  read: Boolean,
  createdAt: Date
}]
```
- **Array of embedded documents**
- Each message is stored INSIDE the conversation document
- Efficient for chat history (all messages retrieved in one query)

**Example document:**
```json
{
  "_id": "conv123",
  "listing": "listing456",
  "participants": ["user1", "user2"],
  "messages": [
    {
      "sender": "user1",
      "content": "Can you fix this?",
      "read": false,
      "createdAt": "2025-12-29T10:00:00Z"
    },
    {
      "sender": "user2",
      "content": "Yes, I can help!",
      "read": true,
      "createdAt": "2025-12-29T10:05:00Z"
    }
  ],
  "lastMessageAt": "2025-12-29T10:05:00Z"
}
```

**2. Indexes:**
```javascript
messageSchema.index({ listing: 1, participants: 1 });
messageSchema.index({ participants: 1, lastMessageAt: -1 });
```

**What are indexes?**
- Like a book's index - helps find data faster
- Without index: MongoDB scans every document (slow)
- With index: MongoDB jumps directly to matching documents (fast)

**Your indexes:**
- `{ listing: 1, participants: 1 }` - Fast lookup of conversation by listing and users
- `{ participants: 1, lastMessageAt: -1 }` - Fast sorting of user's conversations by most recent
- `1` = ascending, `-1` = descending

---

## 🎯 **4. Controllers (Business Logic)**

Controllers contain the **actual logic** for handling requests.

---

### **4.1 User Controller (`controllers/userController.js`)**

### **Register User:**

```javascript
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
        skills: user.skills,
        badges: user.badges,
        rating: user.rating,
        fixesCompleted: user.fixesCompleted,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### **Step-by-Step:**

1. **`const { name, email, password } = req.body;`**
   - Destructures data from request body
   - Frontend sends: `{ name: "John", email: "john@edu", password: "abc123" }`

2. **`await User.findOne({ email })`**
   - Searches database for existing user with this email
   - Mongoose translates to: `db.users.findOne({ email: "john@edu" })`

3. **`if (userExists) return res.status(400).json(...)`**
   - If email already registered, send error response
   - `status(400)` = Bad Request

4. **`await User.create({ name, email, password })`**
   - Creates new user document
   - **Triggers the pre-save hook** (hashes password automatically!)
   - Saves to MongoDB

5. **`res.status(201).json({...})`**
   - `status(201)` = Created (success)
   - Returns user data + JWT token

---

### **JWT Token Generation:**

```javascript
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};
```

### **What's Happening:**

1. **`jwt.sign(payload, secret, options)`**
   - Creates a JSON Web Token
   - **Payload:** `{ id }` - User's database ID
   - **Secret:** From environment variable (used to verify token later)
   - **expiresIn:** Token valid for 30 days

2. **Result:** Token string like:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFiYzEyMyIsImlhdCI6MTYwOTQ1OTIwMCwiZXhwIjoxNjEyMDUxMjAwfQ.signature
   ```

**Token Structure:**
```
header.payload.signature
  ↓       ↓        ↓
 {       {       (secret
 "alg":  "id":   verification)
 "HS256" "abc123",
 }       "iat": timestamp,
         "exp": timestamp
         }
```

---

### **Login User:**

```javascript
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### **Key Points:**

1. **`.select('+password')`**
   - Remember `select: false` in schema?
   - This OVERRIDES it to include password field
   - Needed to compare passwords

2. **`await user.matchPassword(password)`**
   - Calls the method we defined in User model
   - Compares entered password with hashed password
   - Returns `true` or `false`

3. **`status(401)`**
   - 401 = Unauthorized
   - Standard response for failed login

---

## 🔐 **5. Authentication Middleware (`middleware/authMiddleware.js`)**

### **YOUR CODE:**

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
```

### **Step-by-Step:**

1. **Check for Authorization Header:**
   ```javascript
   req.headers.authorization && req.headers.authorization.startsWith('Bearer')
   ```
   - Frontend sends: `Authorization: Bearer eyJhbGc...token...`
   - Checks if header exists and starts with "Bearer"

2. **Extract Token:**
   ```javascript
   token = req.headers.authorization.split(' ')[1];
   ```
   - Splits `"Bearer eyJhbGc..."` by space
   - Takes second part (the token)

3. **Verify Token:**
   ```javascript
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
   ```
   - Verifies signature using secret key
   - If tampered with, throws error
   - If valid, returns decoded payload: `{ id: "abc123", iat: ..., exp: ... }`

4. **Fetch User:**
   ```javascript
   req.user = await User.findById(decoded.id).select('-password');
   ```
   - Gets user from database using ID from token
   - Attaches user to `req` object
   - Now available in controller functions!

5. **Call `next()`:**
   - Moves to next middleware or route handler
   - If error occurs, sends 401 response instead

### **How It's Used:**

```javascript
// In routes/userRoutes.js
router.put('/profile', protect, updateUserProfile);
                       ↑
                    Middleware runs first

// In controller
const updateUserProfile = (req, res) => {
  console.log(req.user); // User is available here!
  // Update profile logic...
};
```

---

## 🛣️ **6. Routes (API Endpoints)**

### **YOUR CODE (`routes/userRoutes.js`):**

```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getFixers
} = require('../controllers/userController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', getUserProfile);
router.get('/fixers', getFixers);

// Protected routes
router.put('/profile', protect, updateUserProfile);

module.exports = router;
```

### **Understanding Routes:**

| Route | Method | Protection | Controller | What It Does |
|-------|--------|-----------|------------|--------------|
| `/api/users/register` | POST | Public | registerUser | Create new account |
| `/api/users/login` | POST | Public | loginUser | Login and get token |
| `/api/users/profile/:id` | GET | Public | getUserProfile | View any user's profile |
| `/api/users/fixers` | GET | Public | getFixers | Get list of fixers |
| `/api/users/profile` | PUT | Protected | updateUserProfile | Update own profile |

**Route Parameters:**
```javascript
router.get('/profile/:id', getUserProfile);
```
- `:id` is a URL parameter
- Frontend calls: `GET /api/users/profile/abc123`
- Controller accesses: `req.params.id` = `"abc123"`

**Middleware Chain:**
```javascript
router.put('/profile', protect, updateUserProfile);
```
- Request flows: protect → updateUserProfile
- If `protect` calls `next()`, continues to controller
- If `protect` sends response, stops there

---

## 🔄 **7. Request Flow Example**

### **Scenario: User Updates Profile Picture**

```
┌─────────────────────────────────────────────────────────┐
│ 1. Frontend (React)                                     │
│    User uploads image → converts to base64              │
│    Calls: userService.updateUserProfile({ photoUrl })   │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ PUT /api/users/profile
                         │ Headers: Authorization: Bearer token123
                         │ Body: { photoUrl: "data:image/jpeg..." }
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. server.js                                            │
│    ├─ CORS middleware (checks origin)                   │
│    ├─ express.json() (parses body to JavaScript object) │
│    └─ Routes to: /api/users → userRoutes.js            │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. routes/userRoutes.js                                 │
│    Matches: PUT /profile                                │
│    ├─ Runs: protect middleware                          │
│    └─ Then: updateUserProfile controller                │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 4. middleware/authMiddleware.js                         │
│    ├─ Extracts token from header                        │
│    ├─ Verifies JWT signature                            │
│    ├─ Fetches user from database                        │
│    ├─ Attaches to req.user                              │
│    └─ Calls next()                                      │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 5. controllers/userController.js                        │
│    updateUserProfile function:                          │
│    ├─ Gets user: req.user (from middleware)             │
│    ├─ Validates photoUrl (starts with data:image/)      │
│    ├─ Updates: user.photoUrl = req.body.photoUrl        │
│    └─ Saves: await user.save()                          │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 6. models/User.js                                       │
│    ├─ Mongoose validates schema                         │
│    ├─ Updates document in MongoDB                       │
│    └─ Returns updated user                              │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 7. Response Sent Back                                   │
│    res.json({                                           │
│      _id, name, email, photoUrl, skills, ...            │
│    })                                                   │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 8. Frontend (React)                                     │
│    ├─ Receives response                                 │
│    ├─ Updates AuthContext                               │
│    └─ Component re-renders with new photo               │
└─────────────────────────────────────────────────────────┘
```

---

## 🎓 **Key Concepts Summary**

### **1. Mongoose**
- **Schema:** Blueprint for documents (like a class definition)
- **Model:** Constructor compiled from schema (creates documents)
- **Document:** Individual record in MongoDB (like an object instance)
- **Query:** Methods like `findOne()`, `create()`, `save()`

### **2. Express Middleware**
- Functions that execute in sequence
- Each can modify `req` or `res`
- Must call `next()` to continue chain
- Can send response to stop chain

### **3. JWT Authentication**
- **Token:** Encoded JSON with signature
- **Stateless:** Server doesn't store sessions
- **Bearer Token:** Sent in `Authorization` header
- **Verification:** Secret key proves authenticity

### **4. Async/Await**
- Makes asynchronous code readable
- `await` pauses until Promise resolves
- Must use inside `async` function
- Use `try/catch` for error handling

### **5. MVC Pattern**
- **Model:** Data structure and validation
- **Controller:** Business logic
- **Route:** Maps URLs to controllers
- **Middleware:** Cross-cutting concerns (auth, CORS, etc.)

---

## 🔍 **Things to Research Further**

| Topic | Why | Where to Learn |
|-------|-----|----------------|
| **Mongoose Population** | Efficiently join related documents | [Mongoose Populate Docs](https://mongoosejs.com/docs/populate.html) |
| **bcrypt Salt Rounds** | Understand security trade-offs | [bcrypt Explained](https://auth0.com/blog/hashing-in-action-understanding-bcrypt/) |
| **JWT Claims** | What data to include in tokens | [JWT Introduction](https://jwt.io/introduction) |
| **Express Error Handling** | Centralized error management | [Express Error Docs](https://expressjs.com/en/guide/error-handling.html) |
| **MongoDB Indexes** | Query optimization | [MongoDB Index Docs](https://www.mongodb.com/docs/manual/indexes/) |
| **CORS Preflight** | OPTIONS requests | [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) |
| **Node.js Event Loop** | How async works | [Node.js Guide](https://nodejs.dev/learn/the-nodejs-event-loop) |

---

## 🚀 **Next Steps**

1. **Read this document thoroughly** - Understand each section
2. **Open your code side-by-side** - Follow along with real files
3. **Add console.logs** - See data flow in real-time
4. **Break something intentionally** - Learn by debugging
5. **Build a new feature** - Apply what you learned

---

**📝 Note:** This guide uses YOUR actual code from the Fix-It Hub project. Every snippet is from your `server/` directory!

