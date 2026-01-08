# CivicFix Authentication Setup Guide

## What Was Fixed

### 1. **Removed All Mock/Demo Authentication**
- ❌ Removed hardcoded citizen login bypass
- ❌ Removed technician mock login
- ✅ All logins now use MongoDB database

### 2. **Updated Data Models**
- **User.js**: Added support for citizen and technician roles with proper fields
- **Technician.js**: Added passwordHash for authentication
- All users are now database-driven

### 3. **Backend Authentication Routes**
- **Admin Login**: Username (aniket) + Password validation via bcrypt
- **Technician Login**: Password-based authentication  
- **Citizen Login**: Name + Government ID with auto-registration

### 4. **Frontend Changes**
- Removed "demo" and "any password" messages
- All form inputs properly captured and validated
- Real error messages from backend
- Proper password handling for all roles

---

## How to Run

### Prerequisites
1. **MongoDB** running on `localhost:27017`
2. **Node.js** installed

### Setup Steps

```bash
# 1. Install dependencies
cd server
npm install
cd ..

npm install

# 2. Start MongoDB (if not already running)
# On Windows: mongod
# On Linux/Mac: mongod

# 3. Start the backend server
cd server
npm start

# 4. In another terminal, start the frontend
npm run dev
```

---

## Login Credentials

### Admin
- **Username**: aniket
- **Password**: aniket123

### Technician
- **Password**: tech123
- (Auto-selects from available technicians)

### Citizen
- **Name**: Any name you enter
- **Government ID**: Any ID you enter
- (Creates/retrieves user from database)

---

## Database Seed Data

On server startup, the following is automatically created:

1. **Admin User**: username "aniket" with password hash
2. **10 Technicians**: All with password "tech123"
   - Viraj, Srushti, Samruddhi, Vaishnavi, Harshit
   - Neil, Adarsh, Ram, Malhar, Vinayak

---

## Troubleshooting

### "Admin user not found" Error
→ Restart the server. It will auto-seed the admin user on startup.

### "Invalid password" Error
→ Check your credentials match the setup above.

### MongoDB Connection Error
→ Ensure MongoDB is running on localhost:27017
→ Check MONGODB_URI in .env file

### Input Not Being Captured
→ All inputs are now properly captured and validated on both frontend and backend
→ Check browser console for validation errors

---

## Environment Variables (.env)

```
MONGODB_URI=mongodb://localhost:27017/civicfix
PORT=4000
JWT_SECRET=your_secret_key_change_this
ADMIN_PASSWORD_ANI=aniket123
TECH_PASSWORD=tech123
```

Change these for production use.
