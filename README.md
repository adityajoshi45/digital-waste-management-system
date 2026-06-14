# Digital Waste Management System (DWMS)

A full-stack e-waste marketplace that connects customers, companies, and admins to manage electronic waste responsibly.

## Features

- Multi-role authentication (Customer, Company, Admin)
- Customers can list e-waste items for pickup or bidding
- Companies can browse listings and place live bids
- QR code-based pickup verification
- Admin dashboard for managing users and listings

## Tech Stack

**Frontend:** React, Vite  
**Backend:** Node.js, Express  
**Database:** MySQL  

## Project Structure
digital-waste-management-system/

├── ewaste-frontend/   # React frontend

└── ewaste-backend/    # Node.js + Express backend
## Setup Instructions

### Backend
```bash
cd ewaste-backend
npm install
npm start
```

### Frontend
```bash
cd ewaste-frontend
npm install
npm run dev
```

> Make sure MySQL is running and you've configured the `.env` file with your DB credentials.
