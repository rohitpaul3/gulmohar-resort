# 🚀 QUICK DEPLOYMENT STEPS - Gulmohar Resort

## ⚡ Summary
Follow these steps to deploy your website online in 30 minutes!

---

## 📋 Prerequisites
- GitHub account (free)
- MongoDB Atlas account (free)
- Render account (free)
- Netlify account (free)

---

## 🗂️ Files Ready
✅ **Backend updated** with MongoDB support
✅ **Models created** (Bill.js, Expenditure.js)
✅ **Configuration files** created
✅ **Deployment guide** written

---

## 🎯 Quick Steps

### 1️⃣ **Push to GitHub** (5 mins)
```bash
cd "c:\Users\rohit\CascadeProjects\gulmohar final"
git init
git add .
git commit -m "Gulmohar Resort - Ready for deployment"
git branch -M main
# Create repo on GitHub, then:
git remote add origin https://github.com/YOURUSERNAME/gulmohar-resort.git
git push -u origin main
```

### 2️⃣ **MongoDB Atlas Setup** (10 mins)
1. Visit: [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Create database user
4. Allow all IPs (0.0.0.0/0)
5. Copy connection string

### 3️⃣ **Deploy Backend** (10 mins)
1. Visit: [render.com](https://render.com)
2. New Web Service → Connect GitHub
3. Build: `cd Backend && npm install`
4. Start: `cd Backend && npm start`
5. Add environment variable: `MONGODB_URI`

### 4️⃣ **Deploy Frontend** (5 mins)
1. Visit: [netlify.com](https://netlify.com)
2. New site → Connect GitHub
3. Base: `Frontend`
4. Build: `npm run build`
5. Publish: `Frontend/build`

### 5️⃣ **Update Frontend Config** (2 mins)
Update `.env.production` with your Render backend URL

---

## 🎉 Result
**Your website will be live at:**
- Frontend: `https://SITENAME.netlify.app`
- Backend: `https://APPNAME.onrender.com`

**Access from any device 24/7!**

---

## 📞 Support
Check the detailed `DEPLOYMENT_GUIDE.md` for step-by-step instructions with screenshots.
