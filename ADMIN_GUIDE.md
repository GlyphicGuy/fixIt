# 🛡️ Admin Dashboard & Moderation Guide

This guide explains how to access, use, and manage the Admin Dashboard in both Local and Production environments.

## 1. How It Works
The Admin system is built on specific user permissions in the database.
- **Normal User:** `{ "role": "user" }` (or missing role field)
- **Admin User:** `{ "role": "admin" }`

When a user logs in, the backend checks this field. If it is "admin":
1. The backend allows access to `/api/admin/*` routes.
2. The frontend shows the **"Admin Panel"** link in the Navbar.

---

## 2. How to Promote a User to Admin

Since there is no "Sign Up as Admin" button (for security), you must manually promote an existing user.

### 🟢 Method A: Using MongoDB Atlas (The GUI Way)
*Recommended for Production*

1.  Log in to the **[MongoDB Atlas Dashboard](https://cloud.mongodb.com)**.
2.  Click **"Browse Collections"** on your database cluster.
3.  Select the **`users`** collection.
4.  Search for the user: properties `email` equals `target@email.com`.
5.  Click the **Pencil Icon (Edit Document)**.
6.  Add a new field inside the document:
    - **Key:** `role`
    - **Value:** `admin` (Type: String)
7.  Click **Update**.
8.  **Important:** Ask the user to **Log Out** and **Log In** again to see the dashboard.

### 🟡 Method B: Using the Script (The CLI Way)
*Recommended for Local Dev*

1.  Open your terminal in the `server/` folder.
2.  Run the helper script:
    ```bash
    node promoteAdmin.js your.email@example.com
    ```
3.  The script will connect to whatever database is defined in your `.env` file and update the user.

---

## 3. Deployment Checklist
When you deploy this new feature to Render/Netlify, ensure the following:

1.  **Push Code:** 
    ```bash
    git add .
    git commit -m "feat: added admin dashboard"
    git push origin main
    ```
2.  **Environment Variables:**
    - Ensure your Render backend uses the correct `MONGODB_URI` (it should already be set if the app works).
3.  **Create the First Admin:**
    - Once deployed, visit your live site (`https://fixit-bmsce.netlify.app`).
    - Register a user (e.g., `admin@fixit.com`).
    - Go to MongoDB Atlas (Method A above) and promote this user to `admin`.
    - Log out and log back in on the live site.

## 4. Troubleshooting
**"I don't see the Admin Panel link!"**
- Did you **Log Out** and Log In? (The token needs to be refreshed).
- Check the database user document. Does it explicitly say `"role": "admin"`?
- Clear your browser cache/local storage.

**"I get 'Not Authorized' errors!"**
- Your JWT token might still think you are a 'user'. Log out and log in again.
