# Admin Credentials Report
## Shahan Ahmed Portfolio Website

**Date:** January 2025  
**Status:** Security Audit Complete

---

## Executive Summary

The website uses a role-based authentication system with MongoDB. Currently, **no admin users are automatically created** during registration. All users default to `'user'` role and must be manually promoted to `'admin'` in the database.

---

## Authentication System Overview

### User Model Structure
- **Location:** `src/models/User.ts`
- **Role Field:** `role` with enum `['user', 'admin']`
- **Default Role:** `'user'` (all new registrations)
- **Password:** Hashed using bcryptjs

### Registration Restrictions
**Location:** `src/app/api/user/register/route.ts`

Only these 3 emails can register:
1. `imonatikulislam@gmail.com`
2. `shahan24h@gmail.com`
3. `atiqulimon.dev@gmail.com`

**Important:** Registration does NOT automatically assign admin role. All users start as `'user'`.

---

## Current Admin Status

### ⚠️ **CRITICAL FINDING: No Admin Users Detected**

Based on code analysis:
- **No automatic admin creation** in registration
- **No admin users** are created by default
- **Role must be manually set** in MongoDB

### How to Check Admin Users

**Option 1: Use the API Endpoint**
```bash
# Get your access token first by logging in
curl -X GET "http://localhost:3000/api/admin/users" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Option 2: Query MongoDB Directly**
```javascript
// Connect to MongoDB Atlas
// Query: db.users.find({ role: "admin" })
```

**Option 3: Run the Check Script**
```bash
cd shahan-nextjs
npx ts-node scripts/check-admin-users.ts
```

---

## Allowed Registration Emails

These emails can register (but will be `'user'` role by default):

1. **imonatikulislam@gmail.com**
   - Status: Unknown (check database)
   - Role: Unknown (likely 'user' unless manually changed)

2. **shahan24h@gmail.com**
   - Status: Unknown (check database)
   - Role: Unknown (likely 'user' unless manually changed)
   - **This is Shahan Ahmed's email** (from contact page)

3. **atiqulimon.dev@gmail.com**
   - Status: Unknown (check database)
   - Role: Unknown (likely 'user' unless manually changed)

---

## How to Create an Admin User

### Method 1: Update Existing User in MongoDB

1. **Connect to MongoDB Atlas**
2. **Find the user:**
   ```javascript
   db.users.findOne({ email: "shahan24h@gmail.com" })
   ```

3. **Update role to admin:**
   ```javascript
   db.users.updateOne(
     { email: "shahan24h@gmail.com" },
     { $set: { role: "admin" } }
   )
   ```

### Method 2: Create API Endpoint (Recommended)

Create `/api/admin/promote-user` endpoint to safely promote users to admin.

### Method 3: Update Registration (Not Recommended)

Modify `src/app/api/user/register/route.ts` to auto-assign admin role for specific emails (security risk).

---

## Security Issues Found

### 🔴 **CRITICAL: Dashboard Accessible Without Proper Auth**

**Issue:** Dashboard pages are accessible even when logged out because:
- Middleware only protects API routes, not dashboard pages
- Client-side auth check in layout can be bypassed
- No server-side token verification for dashboard routes

**Fix Applied:** ✅ Updated middleware to protect `/dashboard/*` routes

### 🟡 **MEDIUM: Role Not Returned in Login**

**Issue:** Login API doesn't return user role, so frontend can't check admin status.

**Fix Applied:** ✅ Updated login route to return role

### 🟡 **MEDIUM: No Role Check in Dashboard**

**Issue:** Dashboard doesn't verify if user is admin before showing admin features.

**Fix Needed:** Add role verification in dashboard routes

---

## Recommended Actions

### Immediate (High Priority)

1. ✅ **Fix Dashboard Authentication** - DONE
   - Added server-side protection in middleware
   - Dashboard routes now require valid token

2. ✅ **Update Login to Return Role** - DONE
   - Login API now returns user role
   - Frontend can check admin status

3. ⚠️ **Create First Admin User**
   - Connect to MongoDB
   - Find user with email `shahan24h@gmail.com`
   - Update role to `'admin'`

4. ⚠️ **Add Role Verification**
   - Update dashboard layout to check role
   - Add admin-only route protection
   - Create admin middleware helper

### Short-term (This Week)

5. **Create Admin Management API**
   - Endpoint to list all users
   - Endpoint to promote/demote users
   - Endpoint to check admin status

6. **Add Role-Based UI**
   - Show/hide admin features based on role
   - Add admin badge in dashboard
   - Separate admin and user dashboards

7. **Add Admin Audit Log**
   - Log admin actions
   - Track role changes
   - Monitor admin access

---

## Database Query Commands

### Check All Users
```javascript
db.users.find({}, { name: 1, email: 1, role: 1, createdAt: 1 })
```

### Check Admin Users Only
```javascript
db.users.find({ role: "admin" }, { name: 1, email: 1, role: 1, createdAt: 1 })
```

### Promote User to Admin
```javascript
db.users.updateOne(
  { email: "shahan24h@gmail.com" },
  { $set: { role: "admin" } }
)
```

### Check Specific User
```javascript
db.users.findOne({ email: "shahan24h@gmail.com" })
```

---

## Files Modified for Security

1. ✅ `src/middleware.ts` - Added dashboard route protection
2. ✅ `src/app/api/user/login/route.ts` - Added role to response
3. ✅ `src/contexts/AuthContext.tsx` - Added role to User interface
4. ✅ `src/app/login/page.tsx` - Store role in user data

---

## Next Steps

1. **Query MongoDB** to find existing users
2. **Promote Shahan's account** to admin (if exists)
3. **Test admin access** after promotion
4. **Create admin management UI** for future use

---

## Security Best Practices Implemented

- ✅ Token-based authentication
- ✅ Password hashing (bcrypt)
- ✅ JWT tokens with expiration
- ✅ Server-side route protection
- ✅ Role-based access control (structure ready)
- ⚠️ Need to implement role checks in dashboard

---

**Status:** Security audit complete, fixes applied  
**Action Required:** Create first admin user in MongoDB  
**Priority:** HIGH

