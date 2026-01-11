# 📅 10-Week Lab Progress Report: Fix-It Hub

> **Project:** Fix-It Hub (Campus Repair Marketplace)  
> **Stack:** MongoDB, Express, React, Node.js (MERN)

---

## 🟢 Phase 1: Planning & Backend Foundation (Weeks 1-3)

### **Week 1: Project Scoping & Environment Setup**
**Objective:** Define the problem statement, choose the technology stack, and set up the development environment.

**Key Activities:**
- **Idea Finalization:** creating a sustainability-focused platform for students to repair items instead of discarding them.
- **Tech Stack Selection:** Chosen **MERN** (MongoDB, Express, React, Node.js) for a unified JavaScript ecosystem.
- **Repository Setup:**
  - Initialized Git repository.
  - Created `.gitignore` to handle node_modules and env files.
  - Set up directory structure: `/server` (Backend) and `/src` (Frontend).

**Technical Explanation:**
- Understanding the **Client-Server Architecture**.
- Running `npm init` to create `package.json`.

---

### **Weeks 2-3: Backend Core & Database Design**
**Objective:** Build the server, connect to the database, and implement user authentication.

**Key Activities:**
- **Server Setup:** Configured a basic Express server (`server.js`).
- **Database Connection:** Connected to MongoDB using **Mongoose**.
- **User Model:** Defined the Schema for Users (Name, Email, Password, Skills).
- **Authentication API:**
  - Implemented `POST /api/users/register` and `/login`.
  - Used **bcryptjs** for hashing passwords.
  - Implemented **JWT (JSON Web Tokens)** for session management.

**Technical Concepts:**
- **REST API:** Designing endpoints that follow HTTP methods (GET, POST).
- **Middleware:** Created `authMiddleware.js` to protect private routes by verifying the JWT token in headers.

---

## 🟡 Phase 2: Frontend Core & Integration (Weeks 4-6)

### **Week 4: React Initialization & Routing**
**Objective:** Set up the client-side application and navigation structure.

**Key Activities:**
- **Vite Setup:** Created the React app using Vite for faster builds.
- **Tailwind CSS:** Configured utility-first CSS for styling.
- **Routing:** Implemented **React Router (v6)**.
  - Defined routes for `/home`, `/login`, `/register`.
- **Component Architecture:** Created reusable components like `Navbar` and `Footer`.

**Technical Explanation:**
- **SPA (Single Page Application):** Understanding how React swaps components without reloading the browser.
- **Props & State:** Passing data between parent/child components.

---

### **Week 5: Authentication Integration**
**Objective:** Connect the frontend forms to the backend authentication API.

**Key Activities:**
- **API Service:** Created `services/api.js` using **Axios** with interceptors to automatically attach JWT tokens to requests.
- **Context API:** Implemented `AuthContext.jsx` to manage global user state.
  - Allows any component (`Navbar`, `Profile`) to know if a user is logged in.
- **Forms:** Built `LoginPage.jsx` and `RegisterPage.jsx` with validation and error handling.

**Technical Explanation:**
- **Global State Management:** Using `useContext` to avoid "prop drilling" user data through every component.
- **Async/Await:** Handling asynchronous API calls cleanly in React components.

---

### **Week 6: Listing System (CRUD Operations)**
**Objective:** Allow users to create, view, and filter repair requests (Listings).

**Key Activities:**
- **Backend:**
  - Created `Listing` model (Title, Description, Category, Status).
  - Built Routes: `GET /listings` (fetch all) and `POST /listings` (create new).
- **Frontend:**
  - Built `NewListingPage` with form inputs.
  - Built `BrowseListingsPage` to display data.
- **Filtering Logic:** Implemented category filtering (Tech, Clothing, Furniture) and client-side search.

**Technical Explanation:**
- **Database Relations:** Linking a Listing to a specific User via MongoDB `ObjectId` (`ref: 'User'`).
- **Array Methods:** Using `.map()` to render lists of components and `.filter()` for search functionality.

---

## 🟠 Phase 3: Advanced Features (Weeks 7-8)

### **Week 7: Profile Management & Image Handling**
**Objective:** Enhance user profiles and enable image uploads for listings and avatars.

**Key Activities:**
- **Profile Page:** Created dynamic route `/profile/:id` to view stats like "Fixes Completed".
- **Image Upload System:**
  - Instead of complex cloud storage buckets (S3), we implemented a **Base64** solution.
  - Used JavaScript `FileReader` API to convert images to strings on the client.
  - Updated backend `body-parser` limits to allow requests up to 10MB.
- **UI Logic:** Added dynamic badges based on skills.

**Technical Explanation:**
- **Base64 Encoding:** Converting binary image data into text format for storage directly in MongoDB.
- **State Updates:** Instantly reflecting the new profile picture in the Navbar without a page refresh.

---

### **Week 8: In-App Messaging System**
**Objective:** Replace external communication methods (email) with an internal chat system.

**Key Activities:**
- **Database Schema:** Created `Message` model supporting conversation threads between two users regarding a specific listing.
- **Backend Logic:**
  - `getConversation`: Finds previous chat history.
  - `sendMessage`: Appends new message to the conversation array.
- **Frontend UI:**
  - `MessagesPage`: An inbox showing all active conversations.
  - `ConversationPage`: A chat interface inspired by standard messaging apps (WhatsApp/iMessage style bubbles).

**Technical Explanation:**
- **Subdocuments:** Storing messages as an array inside a Conversation document for efficient retrieval.
- **Polling vs Sockets:** For this lab scope, we utilized frequent fetching (or simple state updates) to simulate real-time behavior.

---

## 🔴 Phase 4: Polish & Deployment (Weeks 9-10)

### **Week 9: UI/UX Refinement**
**Objective:** Polish the design, improve user experience, and fix bugs.

**Key Activities:**
- **Visual Polish:** enhanced gradients, refined card shadows, and responsive layouts for mobile.
- **UX Feedback:**
  - Added **Toast Notifications** (pop-ups for "Login Successful" or "Listing Posted").
  - Added **Confirmation Modals** for destructive actions (Logout/Delete).
- **Navigation:** Implemented "Smooth Scroll to Top" on footer links.
- **Socials:** Added proper icons and links in the footer.

**Technical Explanation:**
- **React Portal:** (Concept used for Modals) Rendering components outside the main DOM hierarchy.
- **Conditional Rendering:** Showing different buttons based on `listing.status` (Open vs In Progress).

---

### **Week 10: Production Deployment**
**Objective:** Deploy the full-stack application to the cloud.

**Key Activities:**
- **Environment Configuration:**
  - Secured secrets (Database URIs, API Keys) using Environment Variables in Render/Netlify dashboards.
- **Database Migration:** Moved from local MongoDB to **MongoDB Atlas (Cloud)**.
- **Frontend Deployment:** Deployed React app to **Netlify**.
  - Configured `_redirects` / `netlify.toml` for Single Page App routing.
- **Backend Deployment:** Deployed Node.js server to **Render**.
  - Solved CORS issues by whitelisting the Netlify domain.
  - Fixed dependency issues in `package.json`.

**Technical Explanation:**
- **CI/CD:** Automatic deployment triggered by pushing code to GitHub main branch.
- **CORS (Cross-Origin Resource Sharing):** Configuring the backend to safely accept requests from a different domain (the Netlify frontend).

---

## ✅ Final Stats
- **Total Duration:** 10 Weeks
- **Architecture:** Monolithic Repo (Client + Server)
- **Status:** LIVE Production Build
