# Pre-Deployment Checklist

## ✅ Before You Deploy

### Code Preparation
- [ ] All sensitive data removed from code (passwords, API keys)
- [ ] `.env` file is in `.gitignore`
- [ ] `.env.example` created with sample values
- [ ] All console.logs reviewed (keep important ones, remove debug logs)
- [ ] Error handling implemented for all API calls
- [ ] Loading states added for all async operations

### Testing
- [ ] Test user registration
- [ ] Test user login
- [ ] Test create listing
- [ ] Test upload profile picture
- [ ] Test send message
- [ ] Test accept fixer
- [ ] Test mark as fixed
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile device
- [ ] Test all navigation links

### Git & GitHub
- [ ] Latest code committed
- [ ] Pushed to GitHub repository
- [ ] Repository is accessible
- [ ] Branch is `main` (not `master`)

### Configuration Files
- [ ] `netlify.toml` exists in root
- [ ] `vite.config.js` configured for environment variables
- [ ] `.gitignore` includes `.env` files
- [ ] `package.json` scripts are correct

---

## 🗄️ MongoDB Atlas Setup

- [ ] Account created
- [ ] Free cluster created
- [ ] Database user created with password saved
- [ ] Network access set to 0.0.0.0/0 (or specific IPs)
- [ ] Connection string copied and tested
- [ ] Database name added to connection string: `/fixithub`

**Connection String Format:**
```
mongodb+srv://username:password@cluster.xxxxx.mongodb.net/fixithub?retryWrites=true&w=majority
```

---

## 🔙 Backend Deployment (Render)

### Render Account
- [ ] Account created at render.com
- [ ] Connected with GitHub

### Web Service Setup
- [ ] New Web Service created
- [ ] GitHub repository connected
- [ ] Settings configured:
  - [ ] Name: `fixithub-backend`
  - [ ] Branch: `main`
  - [ ] Root Directory: `server`
  - [ ] Runtime: `Node`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `node server.js`
  - [ ] Instance Type: `Free`

### Environment Variables Set
- [ ] MONGODB_URI (Atlas connection string)
- [ ] JWT_SECRET (random long string)
- [ ] NODE_ENV (set to `production`)
- [ ] PORT (set to `5000`)
- [ ] CLIENT_URL (temporary, will update after frontend deploy)

### Verification
- [ ] Service deployed successfully
- [ ] No errors in logs
- [ ] Backend URL saved: `https://_____.onrender.com`
- [ ] Health check works: `https://_____.onrender.com/api/health`
- [ ] Returns: `{"status":"OK","message":"Fix-It Hub API is running!"}`

---

## 🎨 Frontend Deployment (Netlify)

### Netlify Account
- [ ] Account created at netlify.com
- [ ] Connected with GitHub

### Site Setup
- [ ] New site created
- [ ] GitHub repository connected
- [ ] Build settings configured:
  - [ ] Branch: `main`
  - [ ] Base directory: (empty)
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `dist`

### Environment Variables Set
- [ ] VITE_API_URL set to: `https://your-backend.onrender.com/api`

### Verification
- [ ] Site deployed successfully
- [ ] No build errors
- [ ] Frontend URL saved: `https://_____.netlify.app`
- [ ] Can access homepage
- [ ] Can navigate to different pages

### Update Backend
- [ ] Go back to Render
- [ ] Update CLIENT_URL environment variable to Netlify URL
- [ ] Backend redeployed automatically

---

## 🧪 Post-Deployment Testing

### Authentication
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Token stored in localStorage
- [ ] Can logout
- [ ] Protected routes work correctly

### Listings
- [ ] Can create new listing
- [ ] Can view all listings
- [ ] Can view single listing
- [ ] Can filter by category
- [ ] Can search listings
- [ ] Images display correctly

### Profile
- [ ] Can view own profile
- [ ] Can edit profile (name, bio)
- [ ] Can upload profile picture (test with 2MB+ image)
- [ ] Can add/remove skills
- [ ] Profile picture shows in navbar
- [ ] Profile picture shows in listings

### Messaging
- [ ] Can send message to poster
- [ ] Can reply to messages
- [ ] Messages show in conversations list
- [ ] Unread count shows correctly
- [ ] Can click on conversation to view
- [ ] Auto-scroll to bottom works

### Interactions
- [ ] Can express interest in listing
- [ ] Poster can see interested fixers
- [ ] Poster can accept fixer
- [ ] Can mark listing as fixed
- [ ] Status updates correctly

### Cross-Device
- [ ] Works on desktop Chrome
- [ ] Works on desktop Firefox
- [ ] Works on mobile Safari
- [ ] Works on mobile Chrome
- [ ] Responsive design looks good
- [ ] All buttons are clickable on mobile

---

## 🐛 Common Issues & Solutions

### CORS Errors
**Problem:** API calls fail with CORS error
**Solution:** 
- Check CLIENT_URL in Render matches Netlify URL exactly
- No trailing slashes
- Redeploy backend after changing

### 404 on Page Refresh
**Problem:** Netlify shows 404 when refreshing on `/profile` or other routes
**Solution:**
- Ensure `netlify.toml` exists with redirect rules
- Check it's in root directory
- Redeploy if needed

### Environment Variables Not Working
**Problem:** VITE_API_URL is undefined
**Solution:**
- Must start with `VITE_` prefix
- Set in Netlify dashboard
- Trigger new deploy after adding

### Images Not Uploading
**Problem:** Profile picture upload fails
**Solution:**
- Already fixed with 10MB limit
- Check browser console for errors
- Verify file is under 5MB

### Database Connection Fails
**Problem:** Backend can't connect to MongoDB
**Solution:**
- Check connection string format
- Verify username/password
- Check network access whitelist
- Test connection string locally first

### Backend Cold Start Slow
**Problem:** First request takes 30+ seconds
**Solution:**
- Normal on Render free tier
- Consider upgrading to paid tier
- Add loading message to frontend

---

## 🎉 Final Steps

- [ ] Test everything end-to-end
- [ ] Take screenshots for portfolio
- [ ] Update README with live URLs
- [ ] Share with friends for testing
- [ ] Add project to resume/portfolio
- [ ] Tweet about your launch! 🐦

---

## 📊 Monitoring

### Check Regularly
- [ ] Render logs for errors
- [ ] Netlify deploy logs
- [ ] MongoDB Atlas metrics
- [ ] User feedback

### Usage Limits (Free Tier)
- **Netlify**: 100GB bandwidth/month, 300 build minutes
- **Render**: 750 hours/month, spins down after 15min inactivity
- **MongoDB**: 512MB storage, M0 cluster

---

## 🚀 Optional Enhancements

- [ ] Set up custom domain
- [ ] Add Google Analytics
- [ ] Set up Sentry for error tracking
- [ ] Add email notifications
- [ ] Set up automated backups
- [ ] Add SSL certificates (already included!)
- [ ] Set up staging environment

---

## 📞 Support Resources

- **Netlify**: https://docs.netlify.com
- **Render**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Stack Overflow**: https://stackoverflow.com
- **GitHub Issues**: Your repo issues page

---

**Congratulations! 🎊 Your app is now live!**

Frontend: `https://your-app.netlify.app`
Backend: `https://your-api.onrender.com`
