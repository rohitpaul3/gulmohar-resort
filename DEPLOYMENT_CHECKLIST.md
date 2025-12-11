# Gulmohar Resort Billing System - Deployment Checklist

## Pre-Deployment Verification

### Frontend Checks
- [x] All components updated with new features
- [x] Multiple customer names support
- [x] Multiple room selection support
- [x] Address panel added
- [x] Date-based serial number generation
- [x] Delete bills functionality
- [x] API integration complete

### Backend Checks
- [x] DELETE endpoint for bills added
- [x] Bill model updated with new fields
- [x] Server.js updated to handle new fields
- [x] MongoDB connection configured
- [x] Error handling implemented

---

## Deployment Steps

### Step 1: Environment Setup

#### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

#### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
PORT=5001
NODE_ENV=production
```

### Step 2: Build Frontend
```bash
cd Frontend
npm install
npm run build
```

### Step 3: Deploy Frontend
**Option A: Vercel**
```bash
npm install -g vercel
vercel --prod
```

**Option B: Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

**Option C: Render**
- Connect GitHub repo to Render
- Set build command: `cd Frontend && npm install && npm run build`
- Set start command: `npm start`

### Step 4: Deploy Backend
**Option A: Render**
1. Create new Web Service on Render
2. Connect GitHub repo
3. Set environment variables (MONGODB_URI, PORT)
4. Build command: `npm install`
5. Start command: `npm start`

**Option B: Railway**
1. Connect GitHub repo
2. Set environment variables
3. Deploy

**Option C: Heroku**
```bash
heroku login
heroku create your-app-name
git push heroku main
```

### Step 5: Update Frontend API URL
After backend deployment, update `.env.production`:
```
REACT_APP_API_URL=https://your-deployed-backend-url/api
```

### Step 6: Rebuild and Redeploy Frontend
```bash
npm run build
# Deploy using your chosen platform
```

---

## MongoDB Setup

### Local Development
```bash
# MongoDB should be running locally on port 27017
mongod
```

### Production (Atlas)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Add to backend `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gulmohar-resort
```

---

## Testing Checklist

### Frontend Tests
- [ ] Dashboard loads correctly
- [ ] Create Bill form displays all fields
- [ ] Multiple customer names can be added/removed
- [ ] Multiple rooms can be selected/removed
- [ ] Address fields are visible and functional
- [ ] Serial number is generated correctly (GRDDMMYYHHMMSS format)
- [ ] Bill preview PDF works
- [ ] View Bills page shows all bills
- [ ] Delete button appears on each bill
- [ ] Delete confirmation dialog works
- [ ] Bill is removed after deletion

### Backend Tests
- [ ] Health check endpoint: `GET /api/health`
- [ ] Create bill: `POST /api/bills`
- [ ] Get all bills: `GET /api/bills`
- [ ] Get bill by ID: `GET /api/bills/:id`
- [ ] Delete bill: `DELETE /api/bills/:id`
- [ ] MongoDB connection is working

### API Testing
```bash
# Test health check
curl https://your-backend-url/api/health

# Test create bill
curl -X POST https://your-backend-url/api/bills \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "roomNumber": "C1",
    "mobileNo": "9876543210",
    "roomCharges": 5000,
    "foodCharges": 1000,
    "otherCharges": 500
  }'

# Test delete bill
curl -X DELETE https://your-backend-url/api/bills/BILL_ID
```

---

## Performance Optimization

### Frontend
- [x] Code splitting enabled
- [x] Lazy loading configured
- [x] CSS minified with Tailwind
- [x] Images optimized
- [x] Build size optimized

### Backend
- [x] Database indexing on billNumber
- [x] Error handling implemented
- [x] CORS configured
- [x] Body parser limits set

---

## Security Checklist

- [ ] HTTPS enabled on all endpoints
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Environment variables not exposed
- [ ] Database credentials secured
- [ ] API rate limiting implemented (optional)
- [ ] SQL injection prevention (using MongoDB)
- [ ] XSS protection enabled

---

## Monitoring & Maintenance

### Recommended Tools
- **Frontend**: Vercel Analytics, Sentry
- **Backend**: Render Logs, MongoDB Atlas Monitoring
- **Uptime**: UptimeRobot, Pingdom

### Health Check
Set up automated health checks:
```
GET /api/health
Expected Response: { status: 'OK', database: 'Connected' }
```

---

## Rollback Plan

If deployment fails:
1. Revert to previous git commit
2. Redeploy previous version
3. Check logs for errors
4. Fix issues locally
5. Test thoroughly before redeploying

---

## Post-Deployment

1. **Verify all features work**
   - Create a test bill
   - Add multiple customers
   - Select multiple rooms
   - Fill address information
   - Delete a test bill

2. **Monitor logs**
   - Check backend logs for errors
   - Monitor frontend console for issues
   - Check database for data integrity

3. **Backup database**
   - Set up automated MongoDB backups
   - Test restore procedure

4. **Document deployment**
   - Record deployment date and version
   - Note any issues encountered
   - Update team documentation

---

## Support & Troubleshooting

### Common Issues

**Issue: API connection failed**
- Check REACT_APP_API_URL in .env.production
- Verify backend is running
- Check CORS configuration
- Check firewall/network settings

**Issue: Database connection error**
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions

**Issue: Bills not deleting**
- Check backend DELETE endpoint is implemented
- Verify billsAPI.delete() is called correctly
- Check MongoDB permissions

**Issue: Serial number not generating**
- Verify moment.js is imported
- Check generateSerialNumber() function
- Ensure billNumber is passed to backend

---

## Contact & Support

For issues or questions:
1. Check logs first
2. Review error messages
3. Test locally to reproduce
4. Check GitHub issues
5. Contact development team

---

**Last Updated**: December 8, 2025
**Version**: 1.0.0
**Status**: Deployment Ready ✓
