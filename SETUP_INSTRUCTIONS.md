# Gulmohar Resort Billing System - Setup Instructions

## Prerequisites

Before setting up the application, ensure you have the following installed:
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## Quick Setup

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd Backend

# Install dependencies
npm install

# Start the backend server
npm start
```

The backend server will start on `http://localhost:5001`

### 2. Frontend Setup

Open a new terminal window/tab:

```bash
# Navigate to the frontend directory
cd Frontend

# Install dependencies
npm install

# Start the frontend development server
npm start
```

The frontend application will start on `http://localhost:3001` and automatically open in your browser.

## Detailed Setup (Alternative)

If you prefer to set up each part separately:

### Backend (API Server)

1. **Install Backend Dependencies:**
   ```bash
   cd Backend
   npm install
   ```

2. **Start Backend Server:**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

### Frontend (React Application)

1. **Install Frontend Dependencies:**
   ```bash
   cd Frontend
   npm install
   ```

2. **Start Frontend Server:**
   ```bash
   npm start
   ```

## Features Included

### ✅ Billing System
- Create new bills with customer details
- Room selection (C1, C2, C3, C4, D1, D2, G1, G2)
- Food and other charges
- Automatic tax calculation (5% total: 2.5% SGST + 2.5% CGST)
- Check-in and check-out dates

### ✅ PDF Generation
- Download bills as PDF
- Professional bill format with logo
- GST details included
- One-page format

### ✅ Bill Management
- View all previous bills
- Search and filter functionality
- Download PDFs of existing bills
- Bills are automatically stored

### ✅ Monthly Summary
- Generate monthly reports
- Revenue breakdown
- Room usage statistics
- Export summary as PDF

### ✅ Expenditure Management
- Add resort expenses
- Categorize expenditures
- Filter by category and date
- Track monthly spending

### ✅ Dashboard
- Overview of key metrics
- Recent bills
- Quick actions
- Monthly revenue tracking

## Configuration

### GST Information
The system is pre-configured with:
- **GST Number:** 20AMUPB2430M1Z8
- **SGST:** 2.5%
- **CGST:** 2.5%
- **Total Tax:** 5%

### Room Numbers
Available rooms:
- **Category C:** C1, C2, C3, C4
- **Category D:** D1, D2
- **Category G:** G1, G2

## Data Storage

The application uses JSON files for data storage:
- Bills are stored in `Backend/data/bills.json`
- Expenditures are stored in `Backend/data/expenditures.json`

## Troubleshooting

### Common Issues:

1. **Port Already in Use:**
   - Backend (5000): Kill any process using port 5000
   - Frontend (3000): The system will offer an alternative port

2. **Dependencies Issues:**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules
   npm install
   ```

3. **CORS Issues:**
   - Ensure backend is running on port 5000
   - Check that frontend is configured to use `http://localhost:5000`

### API Endpoints

The backend provides these endpoints:
- `GET /api/bills` - Get all bills
- `POST /api/bills` - Create new bill
- `GET /api/bills/:id` - Get specific bill
- `GET /api/summary/monthly/:month/:year` - Get monthly summary
- `GET /api/expenditures` - Get all expenditures
- `POST /api/expenditures` - Create new expenditure
- `DELETE /api/expenditures/:id` - Delete expenditure

## Production Deployment

For production deployment:

1. **Build Frontend:**
   ```bash
   cd Frontend
   npm run build
   ```

2. **Configure Environment:**
   - Update API URLs in the frontend
   - Set appropriate environment variables
   - Configure production database if needed

## Support

For any issues or questions:
1. Check the browser console for error messages
2. Check the backend terminal for server errors
3. Ensure both frontend and backend are running
4. Verify all dependencies are installed correctly

## License

This project is created for Gulmohar Resort internal use.
