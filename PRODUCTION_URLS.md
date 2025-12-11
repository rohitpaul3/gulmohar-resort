# 🔗 Production URLs & Quick Reference

**Last Updated**: December 11, 2025

---

## 🌐 Live URLs

### Frontend (Vercel)
```
https://your-vercel-frontend-url.vercel.app
```

### Backend (Render)
```
https://your-render-backend-url.onrender.com
```

---

## 🔌 API Endpoints

### Health Check
```
GET https://your-render-backend-url.onrender.com/api/health
```

### Bills Management
```
GET    https://your-render-backend-url.onrender.com/api/bills
GET    https://your-render-backend-url.onrender.com/api/bills/:id
POST   https://your-render-backend-url.onrender.com/api/bills
DELETE https://your-render-backend-url.onrender.com/api/bills/:id
```

### Monthly Summary
```
GET https://your-render-backend-url.onrender.com/api/summary/monthly/:month/:year
```

### Expenditures
```
GET    https://your-render-backend-url.onrender.com/api/expenditures
POST   https://your-render-backend-url.onrender.com/api/expenditures
DELETE https://your-render-backend-url.onrender.com/api/expenditures/:id
```

---

## 📊 Dashboard Links

### Vercel Dashboard
```
https://vercel.com/dashboard
```
**To**: Monitor frontend, view logs, manage deployments

### Render Dashboard
```
https://dashboard.render.com
```
**To**: Monitor backend, view logs, manage environment variables

### MongoDB Atlas
```
https://cloud.mongodb.com
```
**To**: Monitor database, manage backups, view metrics

---

## 🧪 Quick Test Commands

### Test Health Check
```bash
curl https://your-render-backend-url.onrender.com/api/health
```

### Test Get All Bills
```bash
curl https://your-render-backend-url.onrender.com/api/bills
```

### Test Create Bill
```bash
curl -X POST https://your-render-backend-url.onrender.com/api/bills \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "roomNumber": "C1",
    "mobileNo": "9876543210",
    "roomCharges": 5000,
    "foodCharges": 1000,
    "otherCharges": 500
  }'
```

### Test Delete Bill
```bash
curl -X DELETE https://your-render-backend-url.onrender.com/api/bills/BILL_ID
```

---

## 🔄 Deployment Commands

### Deploy Frontend (Vercel)
```bash
cd Frontend
npm run build
vercel --prod
```

### Deploy Backend (Render)
```bash
git push origin main
# Render auto-deploys on git push
```

---

## 📱 Frontend Routes

### Dashboard
```
https://your-vercel-url.vercel.app/
```

### Create Bill
```
https://your-vercel-url.vercel.app/create-bill
```

### View Bills
```
https://your-vercel-url.vercel.app/view-bills
```

### Monthly Summary
```
https://your-vercel-url.vercel.app/monthly-summary
```

### Expenditures
```
https://your-vercel-url.vercel.app/expenditures
```

---

## 🔐 Environment Variables

### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-render-backend-url.onrender.com/api
```

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gulmohar-resort
PORT=5001
NODE_ENV=production
```

---

## 📞 Support Contacts

### Vercel Support
- **Website**: https://vercel.com/support
- **Status**: https://www.vercel-status.com/

### Render Support
- **Website**: https://render.com/support
- **Status**: https://status.render.com/

### MongoDB Support
- **Website**: https://www.mongodb.com/support
- **Status**: https://status.mongodb.com/

---

## 🚀 Quick Actions

### View Frontend Logs
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to "Deployments" tab
4. Click latest deployment
5. View logs

### View Backend Logs
1. Go to https://dashboard.render.com
2. Select your backend service
3. Go to "Logs" tab
4. View real-time logs

### Restart Backend
1. Go to https://dashboard.render.com
2. Select your backend service
3. Click "Manual Deploy"
4. Select branch and deploy

### Check Database
1. Go to https://cloud.mongodb.com
2. Select your cluster
3. View collections and data
4. Check backups

---

## 📋 Checklist for New Deployments

- [ ] Code committed to GitHub
- [ ] All tests passed locally
- [ ] Environment variables updated
- [ ] Frontend URL updated in backend
- [ ] Backend URL updated in frontend
- [ ] Vercel deployment successful
- [ ] Render deployment successful
- [ ] Health check passes
- [ ] All features tested in production
- [ ] Logs reviewed for errors

---

## 🔍 Monitoring Checklist

**Daily**:
- [ ] Check Vercel logs
- [ ] Check Render logs
- [ ] Verify health endpoint

**Weekly**:
- [ ] Review error logs
- [ ] Check database size
- [ ] Verify backups
- [ ] Monitor performance

**Monthly**:
- [ ] Update dependencies
- [ ] Review security
- [ ] Optimize performance
- [ ] Plan maintenance

---

## 🎯 Common Tasks

### Update Frontend Code
```bash
git add .
git commit -m "Update message"
git push origin main
# Vercel auto-deploys
```

### Update Backend Code
```bash
git add .
git commit -m "Update message"
git push origin main
# Render auto-deploys
```

### Update Environment Variables
1. Go to Render/Vercel dashboard
2. Go to Settings → Environment Variables
3. Update the variable
4. Redeploy

### View Database
1. Go to MongoDB Atlas
2. Select cluster
3. Go to Collections
4. Browse data

---

## 📞 Emergency Contacts

### If Frontend is Down
1. Check Vercel status page
2. Check Vercel logs
3. Redeploy from Vercel dashboard
4. Contact Vercel support if needed

### If Backend is Down
1. Check Render status page
2. Check Render logs
3. Restart service from Render dashboard
4. Check MongoDB connection
5. Contact Render support if needed

### If Database is Down
1. Check MongoDB Atlas status
2. Check connection string
3. Verify IP whitelist
4. Contact MongoDB support if needed

---

## 📊 Status Page

### Check All Services
- **Vercel Status**: https://www.vercel-status.com/
- **Render Status**: https://status.render.com/
- **MongoDB Status**: https://status.mongodb.com/

---

## 🎉 You're All Set!

Your Gulmohar Resort Billing System is live and running in production.

**Key Points**:
- ✅ Frontend: Vercel
- ✅ Backend: Render
- ✅ Database: MongoDB Atlas
- ✅ All Features: Working
- ✅ Monitoring: Enabled

---

**Last Updated**: December 11, 2025  
**Status**: ✅ Production Ready  
**Next Review**: December 18, 2025
