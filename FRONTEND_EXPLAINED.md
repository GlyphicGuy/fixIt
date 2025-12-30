# ⚛️ Frontend Deep Dive - Fix-It Hub React App

> **A complete walkthrough of your `src/` directory with code snippets and explanations**

---

## 📁 **Directory Structure**

```
src/
├── main.jsx                  # React entry point (renders to DOM)
├── App.jsx                   # Main app component (routes setup)
├── index.css                 # Global CSS styles
├── App.css                   # App-specific styles
├── components/               # Reusable UI components
│   ├── Navbar.jsx           # Top navigation bar
│   ├── Footer.jsx           # Bottom footer
│   ├── ListingCard.jsx      # Repair listing card
│   ├── SkillProfileCard.jsx # Fixer profile card
│   ├── SearchBar.jsx        # Search input component
│   ├── StatsSection.jsx     # Statistics display
│   └── HowItWorks.jsx       # Feature explanation
├── pages/                    # Full page components (routes)
│   ├── HomePage.jsx         # Landing page
│   ├── BrowseListingsPage.jsx   # All listings view
│   ├── FindFixersPage.jsx   # All fixers view
│   ├── NewListingPage.jsx   # Create listing form
│   ├── ProfilePage.jsx      # User profile
│   ├── ListingDetailPage.jsx    # Single listing view
│   ├── MessagesPage.jsx     # Inbox/conversations list
│   ├── ConversationPage.jsx # Chat interface
│   ├── LoginPage.jsx        # Login form
│   └── RegisterPage.jsx     # Signup form
├── context/                  # Global state management
│   ├── AuthContext.jsx      # User authentication state
│   └── ToastContext.jsx     # Toast notifications
├── services/                 # API call functions
│   ├── api.js              # Axios setup + interceptors
│   ├── userService.js      # User API calls
│   ├── listingService.js   # Listing API calls
│   └── messageService.js   # Message API calls
├── data/
│   └── mockData.js         # Fallback demo data
└── assets/                  # Images, icons, etc.
```

---

## 🚀 **1. Entry Point: `main.jsx`**

This is where React starts - the first file that runs when the app loads.

### **YOUR CODE:**

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
```

### **What's Happening:**

1. **`ReactDOM.createRoot(document.getElementById('root'))`**
   - Finds the `<div id="root">` in `index.html`
   - Creates a React root to render the app into
   - This is React 18's new API (replaces old `ReactDOM.render`)

2. **`<React.StrictMode>`**
   - Development tool that highlights potential problems
   - Runs extra checks and warnings (only in development)
   - Helps catch bugs early

3. **`<AuthProvider>`**
   - Wraps entire app with authentication context
   - Makes `user`, `login`, `logout` available everywhere
   - Must be at the top level so all components can access it

4. **`<BrowserRouter>`**
   - Enables client-side routing (no page reloads)
   - Keeps UI in sync with URL
   - Makes React Router work

5. **`<App/>`**
   - Your main application component
   - Contains all routes and pages

### **Component Hierarchy:**

```
React Root
  └─ React.StrictMode
      └─ AuthProvider (Global auth state)
          └─ BrowserRouter (Routing)
              └─ App (Main component)
                  ├─ Navbar
                  ├─ Routes (different pages)
                  └─ Footer
```

---

## 🗺️ **2. Main App Component: `App.jsx`**

### **YOUR CODE:**

```javascript
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import BrowseListingsPage from './pages/BrowseListingsPage'
import FindFixersPage from './pages/FindFixersPage'
import NewListingPage from './pages/NewListingPage'
import ProfilePage from './pages/ProfilePage'
import ListingDetailPage from './pages/ListingDetailPage'
import ConversationPage from './pages/ConversationPage'
import MessagesPage from './pages/MessagesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'

function App() {
  return (
    <ToastProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowseListingsPage />} />
          <Route path="/fixers" element={<FindFixersPage />} />
          <Route path="/new-listing" element={<NewListingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/conversation/:listingId" element={<ConversationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
        <Footer />
      </div>
    </ToastProvider>
  )
}

export default App
```

### **What's Happening:**

1. **`<ToastProvider>`**
   - Provides toast notification system (success/error messages)
   - Shows popups when actions complete

2. **`<Navbar />`**
   - Rendered OUTSIDE `<Routes>`
   - Appears on every page (persistent navigation)

3. **`<Routes>` and `<Route>`**
   - Maps URLs to components
   - When URL changes, React Router renders matching component
   - NO page reload (Single Page Application)

4. **Route Parameters:**
   ```javascript
   <Route path="/profile/:userId" element={<ProfilePage />} />
   ```
   - `:userId` is a dynamic parameter
   - URL: `/profile/abc123` → `userId = "abc123"`
   - Access in component: `const { userId } = useParams()`

5. **`<Footer />`**
   - Rendered OUTSIDE `<Routes>`
   - Appears on every page

### **Routing Table:**

| URL | Component | What It Shows |
|-----|-----------|---------------|
| `/` | HomePage | Landing page with featured listings |
| `/browse` | BrowseListingsPage | All repair listings with filters |
| `/fixers` | FindFixersPage | All fixers/skilled users |
| `/new-listing` | NewListingPage | Form to post repair request |
| `/profile` | ProfilePage | Own profile (logged in user) |
| `/profile/abc123` | ProfilePage | Another user's profile |
| `/listing/xyz789` | ListingDetailPage | Single listing details |
| `/messages` | MessagesPage | Inbox with all conversations |
| `/conversation/listing123` | ConversationPage | Chat with someone |
| `/login` | LoginPage | Login form |
| `/register` | RegisterPage | Signup form |

---

## 🌐 **3. API Setup: `services/api.js`**

This file configures Axios for all API calls.

### **YOUR CODE:**

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
```

### **What's Happening:**

1. **Environment Variable:**
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
   ```
   - `import.meta.env.VITE_API_URL` reads from Netlify environment variable
   - Production: `https://fixit-01yy.onrender.com/api`
   - Development: Falls back to `http://localhost:5000/api`
   - **Note:** Vite requires `VITE_` prefix for env variables

2. **Axios Instance:**
   ```javascript
   const api = axios.create({
     baseURL: API_URL,
     headers: {
       'Content-Type': 'application/json',
     },
   });
   ```
   - Creates a configured axios instance
   - All requests automatically use this base URL
   - Instead of: `axios.post('https://fixit-01yy.onrender.com/api/users/login')`
   - You write: `api.post('/users/login')` ✨

3. **Request Interceptor:**
   ```javascript
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```
   - **Runs BEFORE every request**
   - Checks if JWT token exists in localStorage
   - Automatically adds `Authorization: Bearer <token>` header
   - You never have to manually add auth headers! 🎉

### **How It Works:**

```
Component calls API
     ↓
api.post('/users/login', data)
     ↓
Interceptor runs:
  - Gets token from localStorage
  - Adds Authorization header
     ↓
Request sent to:
  POST https://fixit-01yy.onrender.com/api/users/login
  Headers: {
    Content-Type: application/json,
    Authorization: Bearer eyJhbGc...
  }
     ↓
Backend receives authenticated request
```

---

## 👤 **4. User Service: `services/userService.js`**

Handles all user-related API calls.

### **YOUR CODE:**

```javascript
import api from './api';

// Register new user
export const register = async (userData) => {
  const { data } = await api.post('/users/register', userData);
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
};

// Login user
export const login = async (credentials) => {
  const { data } = await api.post('/users/login', credentials);
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Get user profile
export const getUserProfile = async (userId) => {
  const { data } = await api.get(`/users/profile/${userId}`);
  return data;
};

// Update user profile
export const updateUserProfile = async (userData) => {
  const { data } = await api.put('/users/profile', userData);
  // Update localStorage with new data
  const currentUser = getCurrentUser();
  if (currentUser) {
    localStorage.setItem('user', JSON.stringify({ ...currentUser, ...data }));
  }
  return data;
};
```

### **Understanding Each Function:**

#### **1. Register:**
```javascript
export const register = async (userData) => {
  const { data } = await api.post('/users/register', userData);
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
};
```

**Flow:**
1. **`api.post('/users/register', userData)`**
   - Sends POST request to backend
   - `userData` = `{ name, email, password }`
2. **Backend returns:**
   ```json
   {
     "_id": "abc123",
     "name": "John Doe",
     "email": "john@college.edu",
     "token": "eyJhbGc..."
   }
   ```
3. **Save to localStorage:**
   - `token` → For future API calls
   - `user` → User info (stays logged in after refresh)
4. **Return data** → Available to calling component

#### **2. localStorage (Browser Storage):**

**What is it?**
- Browser's local storage (persists after closing tab)
- Stores key-value pairs as strings
- Max ~5-10MB per domain
- Available across all tabs

**Your usage:**
```javascript
// Save
localStorage.setItem('token', 'eyJhbGc...');
localStorage.setItem('user', JSON.stringify({ name: 'John' }));

// Get
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');
const user = JSON.parse(userStr); // Convert string back to object

// Remove
localStorage.removeItem('token');
```

**Why JSON.stringify/parse?**
- localStorage only stores strings
- Objects must be converted: `{ name: 'John' }` → `'{"name":"John"}'`
- Parse converts back: `'{"name":"John"}'` → `{ name: 'John' }`

---

## 🔐 **5. Authentication Context: `context/AuthContext.jsx`**

Global state for user authentication.

### **YOUR CODE:**

```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, login as loginService, register as registerService, logout as logoutService } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const userData = await loginService(credentials);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await registerService(userData);
      setUser(newUser);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    // Update user in state and localStorage
    const currentUser = getCurrentUser();
    const newUserData = { ...currentUser, ...updatedUserData };
    localStorage.setItem('user', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### **Key Concepts:**

#### **1. Context API (React's Global State):**

**Problem it solves:**
```javascript
// Without Context - PROP DRILLING (passing props through many levels)
<App>
  <Navbar user={user} /> {/* Navbar needs user */}
  <HomePage>
    <ListingCard>
      <UserAvatar user={user} /> {/* Avatar needs user */}
    </ListingCard>
  </HomePage>
</App>
```

**With Context:**
```javascript
// Any component can access user directly!
function Navbar() {
  const { user } = useAuth(); // ✨ Magic!
}

function UserAvatar() {
  const { user } = useAuth(); // ✨ Magic!
}
```

#### **2. How Context Works:**

```javascript
// 1. Create context
const AuthContext = createContext();

// 2. Create provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Wrap app with provider (in main.jsx)
<AuthProvider>
  <App />
</AuthProvider>

// 4. Use in any component
function Navbar() {
  const { user, logout } = useAuth();
  // Now you have access to user and logout!
}
```

#### **3. useEffect Hook:**

```javascript
useEffect(() => {
  // Check if user is logged in on mount
  const currentUser = getCurrentUser();
  if (currentUser) {
    setUser(currentUser);
  }
  setLoading(false);
}, []);
```

**What's happening:**
- **`useEffect`** runs after component renders
- **Empty dependency array `[]`** = run only once (on mount)
- Checks localStorage for saved user
- If found, sets user state → App knows user is logged in
- **This is why you stay logged in after page refresh!** 🎉

#### **4. Double Exclamation (`!!`):**

```javascript
isAuthenticated: !!user
```

**What it does:**
- Converts value to boolean
- `!!null` = `false`
- `!!{ name: 'John' }` = `true`
- `!!undefined` = `false`

**Breakdown:**
```javascript
const user = { name: 'John' };

!user     // false (NOT user = NOT truthy = false)
!!user    // true (NOT NOT user = NOT false = true)
```

---

## 📄 **6. Login Page: `pages/LoginPage.jsx`**

Form component with state management.

### **YOUR CODE:**

```javascript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/'); // Redirect to home after successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 space-y-8">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          
          <input
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### **React Hooks in Action:**

#### **1. useState (Component State):**

```javascript
const [formData, setFormData] = useState({
  email: '',
  password: ''
});
```

**What is state?**
- Data that changes over time
- When state changes, component re-renders
- Hooks must be at top level (not inside loops/conditions)

**Your states:**
- `formData` - Email and password values
- `error` - Error message to display
- `loading` - Loading spinner state

#### **2. Controlled Inputs:**

```javascript
<input
  name="email"
  value={formData.email}
  onChange={handleChange}
/>
```

**What's happening:**
1. **`value={formData.email}`** - Input displays current state
2. **User types** → `onChange` fires
3. **`handleChange`** updates state
4. **Component re-renders** → Input shows new value
5. **React controls the input** (not browser)

**handleChange explained:**
```javascript
const handleChange = (e) => {
  setFormData({
    ...formData,  // Keep existing data
    [e.target.name]: e.target.value  // Update changed field
  });
};
```

**Example:**
```javascript
// Before: formData = { email: '', password: '' }
// User types "john@edu" in email input

handleChange runs:
  e.target.name = "email"
  e.target.value = "john@edu"

setFormData({
  ...formData,           // { email: '', password: '' }
  [e.target.name]: e.target.value   // { email: 'john@edu' }
})

// After: formData = { email: 'john@edu', password: '' }
```

#### **3. Form Submission:**

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();  // Prevent page reload
  setError('');
  setLoading(true);

  try {
    await login(formData);  // Call AuthContext login
    navigate('/');          // Redirect to home
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to login');
  } finally {
    setLoading(false);     // Always stop loading spinner
  }
};
```

**Flow:**
1. **`e.preventDefault()`** - Stop form from reloading page
2. **Clear errors** - Fresh start
3. **Show loading** - Disable button, show spinner
4. **Try login** - Call API via AuthContext
5. **Success** - Navigate to home page
6. **Error** - Show error message
7. **Finally** - Stop loading (runs whether success or error)

#### **4. Optional Chaining (`?.`):**

```javascript
err.response?.data?.message
```

**Without optional chaining (old way):**
```javascript
err.response && err.response.data && err.response.data.message
```

**What it does:**
- Safely accesses nested properties
- If any part is `null`/`undefined`, returns `undefined`
- Prevents "Cannot read property of undefined" errors

---

## 🏠 **7. Home Page: `pages/HomePage.jsx`**

Complex page with data fetching and filtering.

### **YOUR CODE:**

```javascript
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import SearchBar from '../components/SearchBar';
import { getListings } from '../services/listingService';
import { getFixers } from '../services/userService';

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [listings, setListings] = useState([]);
  const [fixers, setFixers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [listingsData, fixersData] = await Promise.all([
        getListings({ status: 'open' }),
        getFixers()
      ]);
      setListings(listingsData);
      setFixers(fixersData);
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredListings = listings
    .filter(listing => selectedCategory === 'All' || listing.category === selectedCategory)
    .filter(listing => 
      searchTerm === '' || 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <h1 className="text-5xl font-bold">Welcome to Fix-It Hub! 🔧</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Listings */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
```

### **Key Concepts:**

#### **1. useEffect for Data Fetching:**

```javascript
useEffect(() => {
  fetchData();
}, []);
```

**Why useEffect?**
- Can't call async functions directly in component body
- useEffect runs AFTER render (prevents blocking)
- Empty `[]` = run once on mount

**Lifecycle:**
```
1. Component mounts → Render with loading=true
2. useEffect runs → fetchData() called
3. API calls complete → State updates
4. Component re-renders → Shows data
```

#### **2. Promise.all (Parallel Requests):**

```javascript
const [listingsData, fixersData] = await Promise.all([
  getListings({ status: 'open' }),
  getFixers()
]);
```

**What it does:**
- Runs multiple Promises in parallel (not one-by-one)
- Waits for ALL to complete
- Returns array of results

**Comparison:**
```javascript
// Sequential (SLOW) - 2 seconds total
const listings = await getListings();  // 1 second
const fixers = await getFixers();      // 1 second

// Parallel (FAST) - 1 second total
const [listings, fixers] = await Promise.all([
  getListings(),  // Both run at same time
  getFixers()
]);
```

#### **3. Array Filtering (Chaining):**

```javascript
const filteredListings = listings
  .filter(listing => selectedCategory === 'All' || listing.category === selectedCategory)
  .filter(listing => 
    searchTerm === '' || 
    listing.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
```

**How it works:**
1. **First filter** - By category
   - Keep listing if "All" selected OR category matches
2. **Second filter** - By search term
   - Keep listing if search empty OR title/description includes term
3. **Chaining** - Each filter returns new array

**Example:**
```javascript
// Original: 10 listings (5 Tech, 5 Clothing)
listings = [/* 10 items */]

// After category filter (Tech selected):
[/* 5 Tech items */]

// After search filter ("laptop" entered):
[/* 2 Tech items with "laptop" in title */]
```

#### **4. Array.map (Rendering Lists):**

```javascript
{filteredListings.map(listing => (
  <ListingCard key={listing._id} listing={listing} />
))}
```

**What it does:**
- Transforms array into React elements
- Each element needs unique `key` prop
- Keys help React efficiently update DOM

**Breakdown:**
```javascript
filteredListings = [
  { _id: '1', title: 'Laptop' },
  { _id: '2', title: 'Bike' }
]

map() transforms to:
[
  <ListingCard key="1" listing={{ _id: '1', title: 'Laptop' }} />,
  <ListingCard key="2" listing={{ _id: '2', title: 'Bike' }} />
]
```

---

## 🧩 **8. Components: `components/Navbar.jsx`**

Reusable UI component with conditional rendering.

### **YOUR CODE:**

```javascript
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">Fix-It Hub</h1>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/">Home</Link>
            <Link to="/browse">Browse Listings</Link>
            {isAuthenticated && (
              <>
                <Link to="/messages">Messages</Link>
                <Link to="/profile">My Profile</Link>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <img 
                    src={user?.photoUrl}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>Hi, {user?.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogoutClick}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
```

### **Key Concepts:**

#### **1. Conditional Rendering:**

```javascript
{isAuthenticated ? (
  <button onClick={logout}>Logout</button>
) : (
  <Link to="/login">Login</Link>
)}
```

**Three ways to conditionally render:**

```javascript
// 1. Ternary operator (if-else)
{isAuthenticated ? <Logout /> : <Login />}

// 2. Logical AND (if only)
{isAuthenticated && <Messages />}

// 3. Early return (in component body)
if (!isAuthenticated) return <Redirect to="/login" />;
```

#### **2. React Router Hooks:**

```javascript
const navigate = useNavigate();

const handleLogout = () => {
  logout();
  navigate('/');  // Programmatic navigation
};
```

**`<Link>` vs `navigate()`:**
- `<Link>` - For clickable elements (renders as `<a>` tag)
- `navigate()` - For programmatic redirects (after action completes)

#### **3. String Manipulation:**

```javascript
<span>Hi, {user?.name?.split(' ')[0]}</span>
```

**What it does:**
```javascript
user.name = "John Doe"
user.name.split(' ')     // ["John", "Doe"]
user.name.split(' ')[0]  // "John"

// Result: "Hi, John"
```

---

## 🔄 **9. Complete User Flow Example**

### **Scenario: User Logs In and Views Profile**

```
┌────────────────────────────────────────────────────────┐
│ 1. User visits /login                                  │
│    → React Router renders LoginPage component          │
└────────────────────┬───────────────────────────────────┘
                     │
                     ↓
┌────────────────────────────────────────────────────────┐
│ 2. LoginPage renders                                   │
│    - useState creates formData state                   │
│    - Renders form with controlled inputs               │
└────────────────────┬───────────────────────────────────┘
                     │
                     ↓
┌────────────────────────────────────────────────────────┐
│ 3. User enters credentials                             │
│    - Types email → onChange → handleChange             │
│    - Types password → onChange → handleChange          │
│    - formData state updates on each keystroke         │
└────────────────────┬───────────────────────────────────┘
                     │
                     ↓
┌────────────────────────────────────────────────────────┐
│ 4. User clicks "Sign In"                               │
│    - onSubmit → handleSubmit                           │
│    - e.preventDefault() stops page reload              │
└────────────────────┬───────────────────────────────────┘
                     │
                     ↓
┌────────────────────────────────────────────────────────┐
│ 5. handleSubmit calls AuthContext.login()              │
│    - login() calls userService.login()                 │
└────────────────────┬───────────────────────────────────┘
                     │
                     ↓
┌────────────────────────────────────────────────────────┐
│ 6. userService.login()                                 │
│    - api.post('/users/login', formData)                │
└────────────────────┬───────────────────────────────────┘
                     │
                     ↓
┌────────────────────────────────────────────────────────┐
│ 7. Axios request interceptor                           │
│    - Adds baseURL: https://fixit-01yy.onrender.com/api │
│    - Checks for token (none yet, first login)          │
│    - Sends POST request                                │
└────────────────────┬───────────────────────────────────┘
                     │
                     ↓ Network Request
                     │
┌────────────────────────────────────────────────────────┐
│ 8. Backend receives request                            │
│    - Validates credentials                             │
│    - Generates JWT token                               │
│    - Returns: { _id, name, email, token, ... }         │
└────────────────────┬───────────────────────────────────┘
                     │
                     ↓ Network Response
                     │
┌────────────────────────────────────────────────────────┐
│ 9. userService receives response                       │
│    - Saves token to localStorage                       │
│    - Saves user to localStorage                        │
│    - Returns data                                      │
└────────────────────┬───────────────────────────────────┘
                     │
                     ↓
┌────────────────────────────────────────────────────────┐
│ 10. AuthContext.login() completes                      │
│     - Calls setUser(userData)                          │
│     - Updates global state                             │
└────────────────────┬───────────────────────────────────┘
                     │
                     ↓
┌────────────────────────────────────────────────────────┐
│ 11. LoginPage handleSubmit continues                   │
│     - navigate('/') redirects to home                  │
└────────────────────┬───────────────────────────────────┘
                     │
                     ↓
┌────────────────────────────────────────────────────────┐
│ 12. React Router changes route                         │
│     - Unmounts LoginPage                               │
│     - Mounts HomePage                                  │
└────────────────────┬───────────────────────────────────┘
                     │
                     ↓
┌────────────────────────────────────────────────────────┐
│ 13. Navbar re-renders                                  │
│     - useAuth() gets updated user from context         │
│     - isAuthenticated = true                           │
│     - Shows: Messages, Profile, Logout buttons         │
│     - Hides: Login, Sign Up buttons                    │
└────────────────────┬───────────────────────────────────┘
                     │
                     ↓
┌────────────────────────────────────────────────────────┐
│ 14. User clicks "My Profile"                           │
│     - React Router navigates to /profile               │
│     - ProfilePage component mounts                     │
└────────────────────┬───────────────────────────────────┘
                     │
                     ↓
┌────────────────────────────────────────────────────────┐
│ 15. ProfilePage useEffect runs                         │
│     - Calls api.get('/users/profile')                  │
└────────────────────┬───────────────────────────────────┘
                     │
                     ↓
┌────────────────────────────────────────────────────────┐
│ 16. Axios request interceptor                          │
│     - Gets token from localStorage                     │
│     - Adds header: Authorization: Bearer <token>       │
│     - Sends GET request to backend                     │
└────────────────────┬───────────────────────────────────┘
                     │
                     ↓
┌────────────────────────────────────────────────────────┐
│ 17. Backend middleware authenticates                   │
│     - Verifies JWT token                               │
│     - Allows access to protected route                 │
│     - Returns user profile data                        │
└────────────────────┬───────────────────────────────────┘
                     │
                     ↓
┌────────────────────────────────────────────────────────┐
│ 18. ProfilePage updates state                          │
│     - setProfile(data)                                 │
│     - Component re-renders with data                   │
│     - Shows: Name, Email, Skills, Photo                │
└────────────────────────────────────────────────────────┘
```

---

## 🎓 **Key Concepts Summary**

### **React Fundamentals**

| Concept | What It Does | Example |
|---------|--------------|---------|
| **Components** | Reusable UI pieces | `<Navbar />`, `<ListingCard />` |
| **JSX** | HTML-like syntax in JavaScript | `<div className="container">` |
| **Props** | Pass data to components | `<ListingCard listing={data} />` |
| **State** | Component data that changes | `const [user, setUser] = useState(null)` |
| **Hooks** | React features in functions | `useState`, `useEffect`, `useContext` |

### **Important Hooks**

| Hook | Purpose | Usage |
|------|---------|-------|
| **useState** | Component state | `const [count, setCount] = useState(0)` |
| **useEffect** | Side effects (API calls, etc) | `useEffect(() => { fetch() }, [])` |
| **useContext** | Access global state | `const { user } = useAuth()` |
| **useNavigate** | Programmatic navigation | `navigate('/login')` |
| **useParams** | Get URL parameters | `const { id } = useParams()` |

### **React Router**

| Feature | What It Does |
|---------|--------------|
| **BrowserRouter** | Enables routing in app |
| **Routes** | Container for route definitions |
| **Route** | Maps URL to component |
| **Link** | Navigation without page reload |
| **useNavigate** | Navigate from code |
| **useParams** | Access URL parameters |

### **Data Flow**

```
User Action → Event Handler → State Update → Re-render → UI Update
     ↓
API Call → Backend → Response → State Update → Re-render
     ↓
Context Update → All Consumers Re-render
```

### **localStorage vs State**

| Feature | localStorage | State |
|---------|--------------|-------|
| **Persistence** | Survives page refresh | Lost on refresh |
| **Scope** | All tabs/windows | Single component tree |
| **Type** | Only strings | Any JavaScript type |
| **Speed** | Slow (disk) | Fast (memory) |
| **Use Case** | Save login token | UI interactions |

---

## 🔍 **Things to Research Further**

| Topic | Why | Where to Learn |
|-------|-----|----------------|
| **React Hooks Rules** | Must follow rules for bugs | [React Hooks Docs](https://react.dev/reference/react) |
| **useEffect Cleanup** | Prevent memory leaks | [Effect Cleanup](https://react.dev/learn/synchronizing-with-effects#fetching-data) |
| **React Keys** | Why lists need keys | [Lists and Keys](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key) |
| **Controlled Components** | Form best practices | [Forms in React](https://react.dev/reference/react-dom/components/input) |
| **Context Performance** | When to split contexts | [Context Optimization](https://react.dev/reference/react/useContext#optimizing-re-renders) |
| **React Router Loaders** | Data fetching on route | [Router Loaders](https://reactrouter.com/en/main/route/loader) |
| **Axios Interceptors** | Request/response middleware | [Axios Interceptors](https://axios-http.com/docs/interceptors) |
| **Tailwind CSS** | Utility-first CSS | [Tailwind Docs](https://tailwindcss.com/docs) |

---

## 🚀 **Next Steps**

1. **Read this guide thoroughly** - Understand each section
2. **Open DevTools** - See React components and state
   - Install [React DevTools](https://react.dev/learn/react-developer-tools)
3. **Add console.logs** - Track data flow
   ```javascript
   console.log('Form data:', formData);
   console.log('User from context:', user);
   ```
4. **Experiment** - Change values and see what happens
5. **Build a feature** - Practice by adding something new

---

## 🎯 **Common Patterns in Your Code**

### **1. Data Fetching Pattern:**
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/endpoint');
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### **2. Form Handling Pattern:**
```javascript
const [formData, setFormData] = useState({ email: '', password: '' });

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  await api.post('/endpoint', formData);
};
```

### **3. Authentication Check Pattern:**
```javascript
const { isAuthenticated } = useAuth();

if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

---

**📝 Note:** This guide uses YOUR actual code from the Fix-It Hub project. Every snippet is from your `src/` directory!

