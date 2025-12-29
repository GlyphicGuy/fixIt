# 🚀 Fix-It Hub Deployment Guide

This guide will help you deploy Fix-It Hub with:
- **Frontend**: Netlify (Free tier)
- **Backend**: Render.com (Free tier)
- **Database**: MongoDB Atlas (Free tier)

---

## 📋 Prerequisites

1. GitHub account
2. Netlify account (free at [netlify.com](https://netlify.com))
3. Render account (free at [render.com](https://render.com))
4. MongoDB Atlas account (free at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))

---

## Part 1: Set Up MongoDB Atlas (Database)

### Step 1: Create a MongoDB Atlas Cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. **When asked "Local or Cloud Environment?"**:
   - Choose **"Cloud Environment"** (this is Atlas - the free cloud database)
   - Do NOT choose "Local" (that's for running MongoDB on your own computer)
4. Click **"Create a Deployment"** or **"Build a Database"**
5. Choose **FREE** tier - labeled as **"M0"** or **"M0 Sandbox"**
   - Should show "$0/month forever"
   - 512MB storage included
6. Select a cloud provider:
   - AWS, Google Cloud, or Azure (doesn't matter which)
   - Choose the one with a region closest to you
7. Select a region:
   - Pick the closest geographic location to your target users
   - Example: For US users, choose "us-east-1" or "us-west-1"
8. Name your cluster (optional): "fixithub-cluster" or leave default
9. Click **"Create Cluster"** or **"Create Deployment"**
10. Wait 1-3 minutes for cluster to be created

### Step 2: Create Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `fixithub-admin`
5. Password: Generate a strong password (SAVE THIS!)
6. User Privileges: **"Atlas Admin"** or **"Read and write to any database"**
7. Click **"Add User"**

### Step 3: Whitelist IP Addresses

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - This adds `0.0.0.0/0`
   - Note: For production, restrict to specific IPs
4. Click **"Confirm"**

### Step 4: Get Connection String

1. Go back to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string, it looks like:
   ```
   mongodb+srv://fixithub-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual database user password
7. Add database name before the `?`: `/fixithub`
   ```
   mongodb+srv://fixithub-admin:yourpassword@cluster0.xxxxx.mongodb.net/fixithub?retryWrites=true&w=majority
   ```
8. **SAVE THIS STRING!** You'll need it for backend deployment.

---

## Part 2: Push Code to GitHub

### Step 1: Initialize Git (if not already done)

```bash
cd /home/maduqa/Desktop/Proj/fixIt
git init
git add .
git commit -m "Initial commit - ready for deployment"
```

### Step 2: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **"+"** → **"New repository"**
3. Name: `fixIt` or `fix-it-hub`
4. Description: "Campus repair marketplace platform"
5. Keep it **Public** or **Private** (your choice)
6. **DO NOT** initialize with README, .gitignore, or license
7. Click **"Create repository"**

### Step 3: Push to GitHub

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/fixIt.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Part 3: Deploy Backend to Render

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (easier)
3. Authorize Render to access your GitHub

### Step 2: Create New Web Service

1. From Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository (`fixIt`)
3. **Configure the service:**

   - **Name**: `fixithub-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: **Free**

### Step 3: Add Environment Variables

In the "Environment Variables" section, add:

1. **MONGODB_URI**
   - Value: Your MongoDB Atlas connection string from Part 1
   - Example: `mongodb+srv://fixithub-admin:yourpassword@cluster0.xxxxx.mongodb.net/fixithub?retryWrites=true&w=majority`

2. **JWT_SECRET**
   - Value: A long random string (generate with: `openssl rand -base64 32`)
   - Example: `3f7a8b9c2d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9`

3. **NODE_ENV**
   - Value: `production`

4. **PORT**
   - Value: `5000`

5. **CLIENT_URL**
   - Value: `https://your-app-name.netlify.app` (you'll update this after deploying frontend)
   - For now, use: `https://fixithub.netlify.app` (we'll update later)

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://fixithub-backend.onrender.com`
4. **SAVE THIS URL!** You'll need it for frontend.
5. Test it by visiting: `https://fixithub-backend.onrender.com/api/health`

**Note**: Free tier on Render spins down after 15 minutes of inactivity. First request after inactivity takes ~30 seconds.

---

## Part 4: Deploy Frontend to Netlify

### Step 1: Create Netlify Account

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Authorize Netlify to access your repositories

### Step 2: Create New Site

1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Authorize and select your `fixIt` repository
4. **Configure build settings:**

   - **Branch to deploy**: `main`
   - **Base directory**: (leave empty)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### Step 3: Add Environment Variables

Before deploying, click **"Show advanced"** → **"New variable"**:

1. **VITE_API_URL**
   - Value: `https://your-backend-url.onrender.com/api`
   - Example: `https://fixithub-backend.onrender.com/api`

### Step 4: Deploy

1. Click **"Deploy site"**
2. Wait for deployment (2-3 minutes)
3. You'll get a random URL like: `https://random-name-12345.netlify.app`
4. You can change this in **Site settings** → **Change site name**

### Step 5: Update Backend CLIENT_URL

1. Go back to Render dashboard
2. Open your backend service
3. Go to **"Environment"**
4. Update **CLIENT_URL** to your Netlify URL: `https://your-app-name.netlify.app`
5. Save (this will trigger a redeploy)

---

## Part 5: Seed Database (Optional)

If you want to add sample data:

1. On your local machine, update `.env` with production MongoDB URI
2. Run: `npm run seed`
3. Change `.env` back to local settings

Or use MongoDB Atlas web interface to add data manually.

---

## 🎉 Your App is Live!

- **Frontend**: https://your-app-name.netlify.app
- **Backend**: https://your-backend-name.onrender.com
- **Database**: MongoDB Atlas (managed)

### Test Everything:

1. Visit your frontend URL
2. Create a new account (Register)
3. Create a listing
4. Upload a profile picture
5. Send messages

---

## 🔧 Troubleshooting

### Frontend Issues

**Build fails on Netlify:**
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Try building locally: `npm run build`

**API calls fail (CORS errors):**
- Check `VITE_API_URL` environment variable in Netlify
- Check `CLIENT_URL` in Render backend
- Ensure URLs don't have trailing slashes

**Page refreshes show 404:**
- Ensure `netlify.toml` file exists with redirect rules
- Check "Publish directory" is set to `dist`

### Backend Issues

**Server won't start on Render:**
- Check Render logs (click "Logs" tab)
- Verify environment variables are set correctly
- Check MongoDB connection string is valid

**Database connection fails:**
- Verify MongoDB Atlas username/password
- Check Network Access whitelist (0.0.0.0/0)
- Test connection string locally first

**Authentication not working:**
- Check JWT_SECRET is set in Render
- Clear browser localStorage and try again
- Check browser console for errors

### Common Issues

**Images not uploading:**
- Already fixed! 10MB limit set in backend
- Check browser console for errors

**Slow first load:**
- Normal on Render free tier (cold start)
- Consider upgrading to paid tier for production

---

## 📱 Custom Domain (Optional)

### On Netlify:
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain
4. Follow DNS configuration instructions

### On Render:
1. Go to **Settings** → **Custom domain**
2. Add your backend domain
3. Configure DNS records

---

## 🔐 Security Best Practices

1. **Change JWT_SECRET** to a strong random value
2. **Restrict MongoDB Network Access** to specific IPs (not 0.0.0.0/0)
3. **Use HTTPS** everywhere (Netlify and Render provide this automatically)
4. **Never commit `.env`** files to Git
5. **Review user uploaded content** regularly
6. **Set up monitoring** on Render dashboard

---

## 💰 Costs

**Free tier includes:**
- Netlify: 100GB bandwidth, 300 build minutes/month
- Render: 750 hours/month (enough for 1 service), spins down after 15 min
- MongoDB Atlas: 512MB storage, shared cluster

**Upgrade when:**
- You get consistent traffic (backend keeps spinning down)
- Need more storage or bandwidth
- Want custom domains
- Need better performance

**Estimated costs for paid tiers:**
- Render: $7/month (hobby tier)
- MongoDB Atlas: $9/month (M10 cluster)
- Netlify: Free tier usually sufficient

---

## 🚀 What's Next?

1. **Set up CI/CD**: Auto-deploy on git push (already done with GitHub integration!)
2. **Add analytics**: Google Analytics or Plausible
3. **Set up monitoring**: Sentry for error tracking
4. **Add email service**: SendGrid or Mailgun for notifications
5. **Optimize images**: CloudFlare or Cloudinary CDN
6. **Add real-time features**: Socket.io for live messaging

---

## 📞 Need Help?

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Render Docs**: [render.com/docs](https://render.com/docs)
- **MongoDB Atlas Docs**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Connection string obtained
- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Backend environment variables set
- [ ] Backend health check works
- [ ] Frontend deployed to Netlify
- [ ] Frontend environment variables set
- [ ] Frontend can connect to backend
- [ ] User registration works
- [ ] Authentication works
- [ ] File uploads work
- [ ] Messages work
- [ ] Updated CLIENT_URL in backend
- [ ] Tested on mobile device
- [ ] Added to portfolio/resume! 🎉

---

Good luck with your deployment! 🚀
